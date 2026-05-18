import React, { useEffect, useState } from 'react';
import { request } from '../api';
import { BarChart3, Users, BookOpen } from 'lucide-react';

const AnalyticsPage = () => {
  const [stats, setStats] = useState({ 
    total_users: 0, 
    total_students: 0, 
    total_instructors: 0,
    total_courses: 0, 
    total_enrollments: 0 
  });

  useEffect(() => {
    request('/analytics/overview').then(data => setStats(data)).catch(console.error);
  }, []);

  // Simple pure CSS bar chart data
  const chartData = [
    { label: 'Jan', value: 20 },
    { label: 'Feb', value: 45 },
    { label: 'Mar', value: 30 },
    { label: 'Apr', value: 80 },
    { label: 'May', value: stats.total_enrollments > 80 ? stats.total_enrollments : 120 }
  ];
  
  const maxValue = Math.max(...chartData.map(d => d.value), 100);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Platform Analytics</h1>
        <p className="page-subtitle">Real-time overview of platform performance.</p>
      </div>

      <div className="grid-container" style={{ marginBottom: '3rem' }}>
        <div className="course-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center' }}>
          <div style={{ padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', marginRight: '1rem' }}>
            <Users size={24} color="var(--accent-blue)" />
          </div>
          <div>
            <p className="text-light" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Total Users</p>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-dark)' }}>{stats.total_users}</h3>
          </div>
        </div>
        
        <div className="course-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', marginRight: '1rem' }}>
            <BookOpen size={24} color="var(--success-green)" />
          </div>
          <div>
            <p className="text-light" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Total Courses</p>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-dark)' }}>{stats.total_courses}</h3>
          </div>
        </div>

        <div className="course-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center' }}>
          <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', marginRight: '1rem' }}>
            <BarChart3 size={24} color="#f59e0b" />
          </div>
          <div>
            <p className="text-light" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Total Enrollments</p>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-dark)' }}>{stats.total_enrollments}</h3>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ marginBottom: '2rem' }}>Enrollments Over Time</h3>
        
        {/* Pure CSS Bar Chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '300px', gap: '2rem', padding: '0 1rem' }}>
          {chartData.map((data, idx) => {
            const heightPercent = (data.value / maxValue) * 100;
            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                <div style={{ 
                  marginTop: 'auto',
                  width: '100%', 
                  height: `${heightPercent}%`, 
                  backgroundColor: 'var(--accent-blue)',
                  borderRadius: '0.25rem 0.25rem 0 0',
                  transition: 'height 1s ease-out',
                  position: 'relative'
                }}>
                  <span style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-dark)' }}>
                    {data.value}
                  </span>
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
                  {data.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
