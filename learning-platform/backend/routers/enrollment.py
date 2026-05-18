from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database, auth

router = APIRouter(
    prefix="/enrollments",
    tags=["Enrollments"]
)

@router.post("/", response_model=schemas.Enrollment)
def enroll_in_course(enrollment: schemas.EnrollmentCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Check if course exists
    course = db.query(models.Course).filter(models.Course.id == enrollment.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    # Check if already enrolled
    existing = db.query(models.Enrollment).filter(
        models.Enrollment.user_id == current_user.id,
        models.Enrollment.course_id == enrollment.course_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled in this course")

    db_enrollment = models.Enrollment(user_id=current_user.id, course_id=enrollment.course_id)
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)
    
    # SYSTEM DESIGN NOTE: Here you would typically publish an event to Kafka or RabbitMQ
    # e.g., kafka_producer.send('course_enrollments', value={'user_id': user.id, 'course_id': course.id})
    # This allows other microservices (like Email notification service, Recommendation engine) to react asynchronously.
    
    return db_enrollment

@router.get("/my", response_model=List[schemas.Enrollment])
def get_my_enrollments(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    enrollments = db.query(models.Enrollment).filter(models.Enrollment.user_id == current_user.id).all()
    return enrollments
