import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../api';
import { Search } from 'lucide-react';

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    request('/courses/').then(data => setCourses(data)).catch(console.error);
  }, []);

  const filteredCourses = courses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Explore Courses</h1>
          <p className="page-subtitle">Find the perfect course to advance your career.</p>
        </div>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={20} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-light)' }} />
          <input 
            type="text" 
            placeholder="Search courses..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}
          />
        </div>
      </div>

      <div className="grid-container">
        {filteredCourses.map(course => (
          <Link to={`/courses/${course.id}`} key={course.id} className="course-card">
            <img src={course.thumbnail_url} alt={course.title} className="course-img" />
            <div className="course-content">
              <div className="course-tag">{course.category}</div>
              <h3 className="course-title">{course.title}</h3>
              <p className="course-desc">{course.description}</p>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-dark)' }}>By Instructor {course.instructor_id}</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Free</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CoursePage;
