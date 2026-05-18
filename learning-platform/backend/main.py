from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models, database, auth
from routers import users, courses, enrollment, progress, analytics
from sqlalchemy.orm import Session

# SYSTEM DESIGN NOTE: In a production environment with high traffic, this FastAPI application 
# would be horizontally scaled. You would run multiple instances of it behind a Load Balancer 
# (like Nginx or AWS ALB) using Kubernetes or Docker Swarm.

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Online Learning Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(courses.router)
app.include_router(enrollment.router)
app.include_router(progress.router)
app.include_router(analytics.router)

@app.on_event("startup")
def startup_event():
    db = database.SessionLocal()
    seed_database(db)
    db.close()

def seed_database(db: Session):
    # Check if we already seeded
    if db.query(models.User).first():
        return

    # 1. Create Users
    instructor1 = models.User(name="Dr. Jane Smith", email="instructor1@demo.com", hashed_password=auth.get_password_hash("demo123"), role="instructor")
    instructor2 = models.User(name="Prof. Alan Turing", email="instructor2@demo.com", hashed_password=auth.get_password_hash("demo123"), role="instructor")
    student1 = models.User(name="Alice Student", email="student1@demo.com", hashed_password=auth.get_password_hash("demo123"), role="student")
    student2 = models.User(name="Bob Student", email="student2@demo.com", hashed_password=auth.get_password_hash("demo123"), role="student")
    
    db.add_all([instructor1, instructor2, student1, student2])
    db.commit()

    # 2. Create Courses
    c1 = models.Course(
        title="Modern React Bootcamp", 
        description="Learn React from scratch with hooks and context API. Master modern web development.",
        instructor_id=instructor1.id,
        category="Web Development",
        thumbnail_url="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80"
    )
    c2 = models.Course(
        title="Python for Data Science", 
        description="Data analysis, visualization, and machine learning basics using Python.",
        instructor_id=instructor1.id,
        category="Data Science",
        thumbnail_url="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80"
    )
    c3 = models.Course(
        title="System Design Masterclass", 
        description="Architect scalable, reliable, and distributed systems. Essential for senior engineering interviews.",
        instructor_id=instructor2.id,
        category="Software Engineering",
        thumbnail_url="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
    )
    c4 = models.Course(
        title="UI/UX Design Principles", 
        description="Create beautiful, intuitive, and accessible user interfaces.",
        instructor_id=instructor2.id,
        category="Design",
        thumbnail_url="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80"
    )

    db.add_all([c1, c2, c3, c4])
    db.commit()

    # 3. Create Lessons for Course 1
    # Using real YouTube embed URLs
    l1 = models.Lesson(course_id=c1.id, title="Introduction to React", video_url="https://www.youtube.com/embed/bMknfKXIFA8", duration_seconds=1200, order_index=1)
    l2 = models.Lesson(course_id=c1.id, title="Understanding JSX", video_url="https://www.youtube.com/embed/7fPXI_MnBOY", duration_seconds=1500, order_index=2)
    l3 = models.Lesson(course_id=c1.id, title="State and Props", video_url="https://www.youtube.com/embed/IYvD9oAQ0Zk", duration_seconds=1800, order_index=3)
    db.add_all([l1, l2, l3])

    # Lessons for Course 3
    l4 = models.Lesson(course_id=c3.id, title="What is System Design?", video_url="https://www.youtube.com/embed/bBTPHM9GqcY", duration_seconds=900, order_index=1)
    l5 = models.Lesson(course_id=c3.id, title="Load Balancing", video_url="https://www.youtube.com/embed/K0Ta65OqQkY", duration_seconds=1400, order_index=2)
    db.add_all([l4, l5])
    db.commit()

    # 4. Create Enrollments and Progress
    e1 = models.Enrollment(user_id=student1.id, course_id=c1.id)
    e2 = models.Enrollment(user_id=student1.id, course_id=c3.id)
    e3 = models.Enrollment(user_id=student2.id, course_id=c1.id)
    db.add_all([e1, e2, e3])

    p1 = models.Progress(user_id=student1.id, lesson_id=l1.id, watched_seconds=1200, completed=True)
    p2 = models.Progress(user_id=student1.id, lesson_id=l2.id, watched_seconds=500, completed=False)
    db.add_all([p1, p2])
    db.commit()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Learning Platform API"}
