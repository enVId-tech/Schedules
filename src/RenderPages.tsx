import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import HomePage from './pages/home.tsx';
import LoginPage from './pages/login.tsx';

// Render
const RenderPages: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Redirects */}
                <Route path="/*" element={<Navigate to="/home" />} />
                <Route path="/home/*" element={<Navigate to="/home" />} />
                <Route path="/login/*" element={<Navigate to="/login" />} />

                {/* Pages */}
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </Router>
    );
}

export default RenderPages;