import React, { useEffect, useState } from 'react';
import LoadInStudentData from './getstudentdata.ts';
import { logOut } from './logout.ts';

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
            </div>
            <hr />
            <div id="Menu">
                <div className="MenuItem" id="HomeSidebar" onClick={() => moveToDifferentFile('/')}>
                    <h2 className="MenuText">Home</h2>
                </div>
                <div className="MenuItem" id="SchedulesListSidebar" onClick={() => moveToDifferentFile('/schedules')}>
                    <h2 className="MenuText">Schedules</h2>
                </div>
                <div className="MenuItem" id="SettingsSidebar" onClick={() => moveToDifferentFile('/settings')}>
                    <h2 className="MenuText">Settings</h2>
                </div>
                <div className="MenuItem" id="LogOutSidebar">
                    <h2 className="MenuText" onClick={() => logOut()}>Log Out</h2>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;