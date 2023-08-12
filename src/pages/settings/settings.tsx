import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import ClassHelmet from '../../components/ts/pagehead.tsx';
import Sidebar from '../../components/ts/sidebar.tsx';

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