import React from 'react';
import '../scss/sidebar.module.scss';
import LoadInStudentData from './loadinstudentdata.tsx';

const Sidebar: React.FC = () => {
    const moveToDifferentFile: (page: string) => void = (page: string) => {
        window.location.href = page;
    }

    return (
        <div id="Sidebar">
            <div id="Logo">
                <img src="NotepadTransparent.jpg" alt="Logo" id="LogoImage"/>
                <p id="LoggedIn">Logged in as <LoadInStudentData /></p>
                <h1 id="LogoText">Schedules</h1>
            </div>
            <div id="Menu">
                <div className="MenuItem" id="Home" onClick={() => moveToDifferentFile('/')}>
                    <h2 className="MenuText">Home</h2>
                </div>
                <div className="MenuItem" id="SchedulesList" onClick={() => moveToDifferentFile('/schedules')}>
                    <h2 className="MenuText">Schedules</h2>
                </div>
                <div className="MenuItem" id="Settings">
                    <h2 className="MenuText">Settings</h2>
                </div>
                <div className="MenuItem" id="LogOut">
                    <h2 className="MenuText" onClick={() => moveToDifferentFile('/login')}>Log Out</h2>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;