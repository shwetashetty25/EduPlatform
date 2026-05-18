import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../api';
import { BookOpen, Users, TrendingUp } from 'lucide-react';

const HomePage = () => {
  const [stats, setStats] = useState({ total_courses: 0, total_students: 0, total_enrollments: 0 });

  useEffect(() => {
    request('/analytics/overview').then(data => setStats(data)).catch(console.error);
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h1 className="page-title" style={{ fontSize: '3rem', color: 'var(--primary-navy)' }}>
          Learn Without Limits
        </h1>
        <p className="page-subtitle" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '1rem auto' }}>
          Build skills with courses, certificates, and degrees online from world-class universities and companies.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary" style={{ width: 'auto', padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Get Started
          </Link>
          <Link to="/courses" className="btn" style={{ width: 'auto', padding: '1rem 2rem', fontSize: '1.1rem', backgroundColor: 'white', color: 'var(--primary-navy)', border: '1px solid var(--border-color)' }}>
            Browse Courses
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '4rem', flexWrap: 'wrap' }}>
        <div className="course-card" style={{ padding: '2rem', textAlign: 'center', flex: '1', minWidth: '250px' }}>
          <BookOpen size={40} color="var(--accent-blue)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>{stats.total_courses}+</h3>
          <p className="text-light">Expert Courses</p>
        </div>
        <div className="course-card" style={{ padding: '2rem', textAlign: 'center', flex: '1', minWidth: '250px' }}>
          <Users size={40} color="var(--success-green)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>{stats.total_students}+</h3>
          <p className="text-light">Active Students</p>
        </div>
        <div className="course-card" style={{ padding: '2rem', textAlign: 'center', flex: '1', minWidth: '250px' }}>
          <TrendingUp size={40} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>{stats.total_enrollments}+</h3>
          <p className="text-light">Course Enrollments</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
