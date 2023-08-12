import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/scss/home.scss'
// Components
import HomePage from './pages/home/home.tsx';
import LoginPage from './pages/login/login.tsx';
import SchedulesPage from './pages/schedules/schedules.tsx';
import SettingsPage from './pages/settings/settings.tsx';

// Render
const RenderPages: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Redirects */}
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home/*" element={<Navigate to="/home" />} />
                <Route path="/login/*" element={<Navigate to="/login" />} />
                <Route path="/schedules/*" element={<Navigate to="/schedules" />} />
                <Route path="/settings/*" element={<Navigate to="/settings" />} />

                {/* Pages */}
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/schedules" element={<SchedulesPage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>
        </Router>
    );
}

export default RenderPages;