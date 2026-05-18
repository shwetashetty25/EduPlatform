from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database, auth

router = APIRouter(
    prefix="/courses",
    tags=["Courses"]
)

@router.get("/", response_model=List[schemas.Course])
def read_courses(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    # SYSTEM DESIGN NOTE: In a production environment, you would use a Redis cache here
    # to avoid hitting the database on every request, especially for listing popular courses.
    # Example simulation:
    # cached_courses = redis_client.get("courses_list")
    # if cached_courses: return json.loads(cached_courses)
    
    courses = db.query(models.Course).offset(skip).limit(limit).all()
    
    # redis_client.setex("courses_list", 3600, serialize(courses)) # cache for 1 hour
    return courses

@router.get("/{course_id}", response_model=schemas.Course)
def read_course(course_id: int, db: Session = Depends(database.get_db)):
    # SYSTEM DESIGN NOTE: This detail page is heavily read. Perfect candidate for Redis caching.
    # redis_client.get(f"course:{course_id}")
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.post("/", response_model=schemas.Course)
def create_course(course: schemas.CourseCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "instructor":
        raise HTTPException(status_code=403, detail="Only instructors can create courses")
    
    db_course = models.Course(**course.model_dump(), instructor_id=current_user.id)
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    
    # SYSTEM DESIGN NOTE: After creating a course, you would invalidate the Redis cache for courses list
    # redis_client.delete("courses_list")
    return db_course
