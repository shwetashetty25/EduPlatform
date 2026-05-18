from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class LessonBase(BaseModel):
    title: str
    video_url: str
    duration_seconds: int
    order_index: int

class LessonCreate(LessonBase):
    pass

class Lesson(LessonBase):
    id: int
    course_id: int

    class Config:
        from_attributes = True

class CourseBase(BaseModel):
    title: str
    description: str
    category: str
    thumbnail_url: str

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int
    instructor_id: int
    created_at: datetime
    instructor: Optional[User] = None
    lessons: List[Lesson] = []

    class Config:
        from_attributes = True

class EnrollmentBase(BaseModel):
    course_id: int

class EnrollmentCreate(EnrollmentBase):
    pass

class Enrollment(EnrollmentBase):
    id: int
    user_id: int
    enrolled_at: datetime
    course: Optional[Course] = None

    class Config:
        from_attributes = True

class ProgressUpdate(BaseModel):
    lesson_id: int
    watched_seconds: int
    completed: bool

class Progress(BaseModel):
    id: int
    user_id: int
    lesson_id: int
    watched_seconds: int
    completed: bool
    last_watched_at: datetime

    class Config:
        from_attributes = True
