import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { request } from '../api';
import { PlayCircle } from 'lucide-react';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const userData = await request('/auth/me');
        setUser(userData);
        
        if (userData.role === 'student') {
          const enrollData = await request('/enrollments/my');
          setEnrollments(enrollData);
        }
      } catch (err) {
        navigate('/login');
      }
    };
    fetchDashboard();
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user.name.split(' ')[0]}!</h1>
        <p className="page-subtitle">Here is your {user.role} dashboard.</p>
      </div>

      {user.role === 'student' ? (
        <div>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>My Learning</h2>
          {enrollments.length === 0 ? (
            <p className="text-light">You are not enrolled in any courses yet. <Link to="/courses" style={{ color: 'var(--accent-blue)' }}>Browse courses</Link></p>
          ) : (
            <div className="grid-container">
              {enrollments.map(enrollment => (
                <div key={enrollment.id} className="course-card">
                  <img src={enrollment.course.thumbnail_url} alt={enrollment.course.title} className="course-img" />
                  <div className="course-content">
                    <div className="course-tag">{enrollment.course.category}</div>
                    <h3 className="course-title">{enrollment.course.title}</h3>
                    <div className="progress-container" style={{ marginTop: '1rem' }}>
                      {/* Note: in a real app, we'd fetch individual progress % for each course */}
                      <div className="progress-bar" style={{ width: '45%' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>45% Complete</span>
                      <Link to={`/courses/${enrollment.course.id}`} className="btn" style={{ padding: '0.5rem', backgroundColor: 'var(--accent-blue)', color: 'white', borderRadius: '50%' }}>
                        <PlayCircle size={24} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>Instructor Panel</h2>
          <div className="grid-container">
            <div className="course-card" style={{ padding: '1.5rem' }}>
              <h3>Create New Course</h3>
              <p className="text-light" style={{ margin: '1rem 0' }}>Share your knowledge with the world.</p>
              <button className="btn btn-primary">Create Course</button>
            </div>
            {/* Real app would show their created courses here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
