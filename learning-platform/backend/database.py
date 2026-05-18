from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "sqlite:///./learning_platform.db"

# SYSTEM DESIGN NOTE: In a production environment, you would typically use a 
# robust relational database like PostgreSQL or MySQL.
# You would also set up Database Read Replicas to handle high read traffic 
# (e.g., users browsing courses) while the primary database handles writes 
# (e.g., enrollments, progress updates).
# Example connection string for PostgreSQL: "postgresql://user:password@postgresserver/db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency for FastAPI to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
