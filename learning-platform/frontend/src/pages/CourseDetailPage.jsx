import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { request } from '../api';
import { CheckCircle, Play, Lock } from 'lucide-react';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progressData, setProgressData] = useState({ progress_percentage: 0 });
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const cData = await request(`/courses/${id}`);
        setCourse(cData);
        if (cData.lessons && cData.lessons.length > 0) {
          setActiveLesson(cData.lessons[0]);
        }

        const token = localStorage.getItem('token');
        if (token) {
          const enrollData = await request('/enrollments/my');
          const enrolled = enrollData.some(e => e.course_id === parseInt(id));
          setIsEnrolled(enrolled);

          if (enrolled) {
            const pData = await request(`/progress/${id}`);
            setProgressData(pData);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetails();
  }, [id]);

  const handleEnroll = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await request('/enrollments/', {
        method: 'POST',
        body: JSON.stringify({ course_id: parseInt(id) })
      });
      setIsEnrolled(true);
      // Reload progress
      const pData = await request(`/progress/${id}`);
      setProgressData(pData);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCompleteLesson = async (lessonId) => {
    try {
      await request('/progress/', {
        method: 'POST',
        body: JSON.stringify({ lesson_id: lessonId, watched_seconds: 100, completed: true })
      });
      // Refresh progress
      const pData = await request(`/progress/${id}`);
      setProgressData(pData);
    } catch (err) {
      console.error(err);
    }
  };

  if (!course) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      
      {/* Left Column: Video or Thumbnail */}
      <div style={{ flex: '2', minWidth: '300px' }}>
        {isEnrolled && activeLesson ? (
          <div style={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: 'var(--shadow-md)', backgroundColor: '#000', aspectRatio: '16/9' }}>
            <iframe 
              width="100%" 
              height="100%" 
              src={activeLesson.video_url} 
              title={activeLesson.title} 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>
        ) : (
          <img src={course.thumbnail_url} alt={course.title} style={{ width: '100%', borderRadius: '1rem', boxShadow: 'var(--shadow-md)' }} />
        )}

        <div style={{ marginTop: '2rem', background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div className="course-tag">{course.category}</div>
          <h1 style={{ fontSize: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>{course.title}</h1>
          <p className="text-light" style={{ lineHeight: '1.6' }}>{course.description}</p>
          
          {!isEnrolled && (
            <button className="btn btn-primary" onClick={handleEnroll} style={{ marginTop: '2rem' }}>
              Enroll for Free
            </button>
          )}

          {isEnrolled && activeLesson && (
            <button className="btn" onClick={() => handleCompleteLesson(activeLesson.id)} style={{ marginTop: '2rem', backgroundColor: 'var(--success-green)', color: 'white' }}>
              <CheckCircle size={20} /> Mark Lesson as Complete
            </button>
          )}
        </div>
      </div>

      {/* Right Column: Lessons List */}
      <div style={{ flex: '1', minWidth: '300px' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Course Content</h3>
          
          {isEnrolled && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                <span>Your Progress</span>
                <span style={{ fontWeight: 'bold', color: 'var(--success-green)' }}>{progressData.progress_percentage}%</span>
              </div>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progressData.progress_percentage}%` }}></div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {course.lessons.map((lesson, idx) => (
              <div 
                key={lesson.id} 
                onClick={() => isEnrolled && setActiveLesson(lesson)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '1rem', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '0.5rem',
                  cursor: isEnrolled ? 'pointer' : 'not-allowed',
                  backgroundColor: activeLesson?.id === lesson.id ? '#eff6ff' : 'white',
                  borderColor: activeLesson?.id === lesson.id ? 'var(--accent-blue)' : 'var(--border-color)',
                  opacity: isEnrolled ? 1 : 0.7
                }}
              >
                <div style={{ marginRight: '1rem', color: isEnrolled ? 'var(--accent-blue)' : 'var(--text-light)' }}>
                  {isEnrolled ? <Play size={20} /> : <Lock size={20} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', color: 'var(--text-dark)' }}>{idx + 1}. {lesson.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                    {Math.floor(lesson.duration_seconds / 60)} mins
                  </div>
                </div>
              </div>
            ))}
            {course.lessons.length === 0 && <p className="text-light">No lessons available yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
