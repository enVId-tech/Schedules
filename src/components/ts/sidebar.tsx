import React, { useEffect, useState } from 'react';
import LoadInStudentData from './getstudentdata.ts';
import { logOut } from './logout.ts';

/**
 * Sidebar component that displays user information and navigation menu.
 * @returns React functional component
 */
const Sidebar: React.FC = () => {
    // State variables for user information
    const [firstName, setFirstName] = useState<string>("")
    const [userImg, setUserImg] = useState<string>("")

    const [menuItems, setMenuItems] = useState<Array<string>>(["Home", "Schedules", "Settings", "Log Out"]);

    /**
     * Loads in student data and sets state variables for user information.
     */
    useEffect(() => {
        const loadInData = async () => {
            const data = await LoadInStudentData();
            setFirstName(data.firstName);
            setUserImg(data.profilePicture);
        }
        loadInData();
    }, [])

    /**
     * Redirects to a different page.
     * @param page - URL of the page to redirect to
     */
    const moveToDifferentFile: (page: string) => void = (page: string) => {
        window.location.href = page;
    }

    /**
     * Renders the Sidebar component.
     * @returns JSX element
     */
    return (
        <div id="Sidebar">
            <div id="Logo">
                <img src={userImg} alt="Logo" id="LogoImage" />
                <p id="LoggedIn">Logged in as {firstName}</p>
            </div>
            <hr />
            <div id="Menu">
                <div className="MenuItem" id="HomeSidebar" onClick={() => moveToDifferentFile('/')}>
                    <h2 className="MenuText">
                        {menuItems[0]}
                    </h2>
                </div>
                <div className="MenuItem" id="SchedulesListSidebar" onClick={() => moveToDifferentFile('/schedules')}>
                    <h2 className="MenuText">{menuItems[1]}</h2>
                </div>
                <div className="MenuItem" id="SettingsSidebar" onClick={() => moveToDifferentFile('/settings')}>
                    <h2 className="MenuText">{menuItems[2]}</h2>
                </div>
                <div className="MenuItem" id="LogOutSidebar">
                    <h2 className="MenuText" onClick={() => logOut()}>{menuItems[3]}</h2>
                </div>
            </div>
            <h1 className='MenuText'>Beta <br />0.1.11,<br /> Development Build</h1>
        </div>
    )
}

export default Sidebar;