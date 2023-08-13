import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import ClassHelmet from '../../components/ts/pagehead.tsx';
import Sidebar from '../../components/ts/sidebar.tsx';
import SelectionItems from './selections.tsx';

const SettingsPage: React.FC = () => {
    return (
        <HelmetProvider>
            <ClassHelmet page="Settings" />
            <div id="settingspage">
                <Sidebar />
                <div id="Settings">
                    <h1 id="SettingsTopMainLabel">Settings</h1>
                    <hr id="line" />
                    <SelectionItems />
                </div>
            </div>
        </HelmetProvider>
    )
}

export default SettingsPage;