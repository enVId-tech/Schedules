import React from 'react';
import { BrowserRouter as Router, Route, Navigate } from 'react-router-dom';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import HomePage from './pages/home';
import LoginPage from './pages/login';

// Render
const RenderPages: React.FC = () => {
    return (
        <Router>
            {/* Redirects */}
            <Route path="/*" element={<Navigate to="/home" />} />

            {/* Pages */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
        </Router>
    );
}

export default RenderPages;