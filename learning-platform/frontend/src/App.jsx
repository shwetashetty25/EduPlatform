import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Compass, BarChart2, LogOut } from 'lucide-react';
import './App.css';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CoursePage from './pages/CoursePage';
import CourseDetailPage from './pages/CourseDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  // Don't show sidebar on login/register
  if (['/login', '/register'].includes(location.pathname)) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <BookOpen size={28} color="var(--accent-blue)" />
        <span>EduStream</span>
      </div>
      
      <nav className="sidebar-nav">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <Compass size={20} />
          <span>Home</span>
        </Link>
        <Link to="/courses" className={`nav-item ${location.pathname.startsWith('/courses') ? 'active' : ''}`}>
          <BookOpen size={20} />
          <span>Browse Courses</span>
        </Link>
        {token && (
          <>
            <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link to="/analytics" className={`nav-item ${location.pathname === '/analytics' ? 'active' : ''}`}>
              <BarChart2 size={20} />
              <span>Analytics</span>
            </Link>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        {token ? (
          <button onClick={handleLogout} className="nav-item" style={{ width: '100%', background: 'transparent', textAlign: 'left', marginTop: 'auto' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/courses" element={<CoursePage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
