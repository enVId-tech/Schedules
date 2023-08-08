import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Sidebar from '../components/ts/sidebar.tsx';
import ClassHelmet from '../components/ts/pagehead.tsx';
import '../components/scss/home.scss';

const SettingsPage: React.FC = () => {
    return (
        <HelmetProvider>
            <ClassHelmet page="Settings" />
            <div id="settingspage">
                <Sidebar />
            </div>
        </HelmetProvider>
    )
}

export default SettingsPage;