import React, { useEffect, useState } from 'react';
import LoadInStudentData from './getstudentdata.ts';

const Sidebar: React.FC = () => {
    const [firstName, setFirstName] = useState<string>("")
    const [userImg, setUserImg] = useState<string>("")

    useEffect(() => {
        const loadInData = async () => {
            const data = await LoadInStudentData();
            setFirstName(data.firstName);
            setUserImg(data.profilePicture);
        }
        loadInData();
    }, [])

    const moveToDifferentFile: (page: string) => void = (page: string) => {
        window.location.href = page;
    }

    return (
        <div id="Sidebar">
            <div id="Logo">
                <img src={userImg} alt="Logo" id="LogoImage" />
                <p id="LoggedIn">Logged in as {firstName}</p>
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