from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
import models, schemas, database, auth

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)

@router.get("/overview")
def get_analytics_overview(db: Session = Depends(database.get_db)):
    # SYSTEM DESIGN NOTE: In a real system, these aggregates might be computed offline 
    # using a data pipeline (e.g., Spark, Airflow) and stored in a data warehouse,
    # or cached in Redis to avoid expensive count queries on large production DBs.
    
    total_users = db.query(models.User).count()
    total_students = db.query(models.User).filter(models.User.role == "student").count()
    total_instructors = db.query(models.User).filter(models.User.role == "instructor").count()
    total_courses = db.query(models.Course).count()
    total_enrollments = db.query(models.Enrollment).count()
    
    return {
        "total_users": total_users,
        "total_students": total_students,
        "total_instructors": total_instructors,
        "total_courses": total_courses,
        "total_enrollments": total_enrollments
    }

@router.get("/course/{course_id}")
def get_course_analytics(course_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Simple check for demo purposes
    if current_user.role != "instructor":
        pass # Allow reading for now, or restrict to course owner in production

    enrollment_count = db.query(models.Enrollment).filter(models.Enrollment.course_id == course_id).count()
    
    # Average progress calculation could be more complex
    return {
        "course_id": course_id,
        "enrollment_count": enrollment_count
    }
