from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
import models, schemas, database, auth

router = APIRouter(
    prefix="/progress",
    tags=["Progress"]
)

@router.post("/", response_model=schemas.Progress)
def update_progress(progress: schemas.ProgressUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_progress = db.query(models.Progress).filter(
        models.Progress.user_id == current_user.id,
        models.Progress.lesson_id == progress.lesson_id
    ).first()

    if db_progress:
        db_progress.watched_seconds = progress.watched_seconds
        db_progress.completed = progress.completed
    else:
        db_progress = models.Progress(
            user_id=current_user.id,
            lesson_id=progress.lesson_id,
            watched_seconds=progress.watched_seconds,
            completed=progress.completed
        )
        db.add(db_progress)

    db.commit()
    db.refresh(db_progress)
    
    # SYSTEM DESIGN NOTE: If a lesson is marked completed, we can trigger an event via Kafka.
    # An 'Achievement Service' listening to this topic could unlock a badge for the user.
    # if progress.completed:
    #    kafka_producer.send('lesson_completed', value={'user_id': current_user.id, 'lesson_id': progress.lesson_id})

    return db_progress

@router.get("/{course_id}")
def get_course_progress(course_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Calculate percentage
    total_lessons = db.query(models.Lesson).filter(models.Lesson.course_id == course_id).count()
    if total_lessons == 0:
        return {"progress_percentage": 0}
        
    completed_lessons = db.query(models.Progress).join(models.Lesson).filter(
        models.Progress.user_id == current_user.id,
        models.Lesson.course_id == course_id,
        models.Progress.completed == True
    ).count()
    
    percentage = (completed_lessons / total_lessons) * 100
    return {"progress_percentage": round(percentage, 2), "completed_lessons": completed_lessons, "total_lessons": total_lessons}
