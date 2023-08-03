/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import logout from './logout.tsx';

interface UserInformation {
    displayName: string;
    profilePicture: string;
    firstName: string;
}

const LoadInStudentData: React.FC = () => {
    const [userDisplayName, setUserDisplayName] = useState<string>("");
    const [profilePicture, setProfilePicture] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");

    useEffect(() => {
        (async () => {
            setInterval(async () => {
                await logout.refreshSessionCookie();
            }, 5000);
            await logout.refreshSessionCookie();

            const userInformation: UserInformation[] = await getUserDataFromServer() as UserInformation[];
            await setUserIntoValues(userInformation);

            await logout.checkLogin();
        })();
    }, []);

    async function setUserIntoValues(userInformation: UserInformation[]): Promise<void> {
        try {
            setUserDisplayName(userInformation[0].displayName);
            setProfilePicture(userInformation[0].profilePicture);
            setFirstName(userInformation[0].firstName);
        } catch (error: any) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function getUserDataFromServer(): Promise<object> {
        try {
            const response: Response = await fetch('/student/data');

            if (response.status !== 200) {
                //window.location.href = '/login';
            }

            return await response.json();
        } catch (error: any) {
            console.error(error);
            throw new Error(error);
        }
    }

    const handleSidebarButtonClick = (link: string): void => {
        window.location.replace(link);
    }

    return (
        <>
            <div className='sidebar-item'>
                <div className='img' id='LeftImg'>
                    <img
                        id='ProfilePicture'
                        src={profilePicture}
                        className='image'
                        referrerPolicy='no-referrer'
                    />
                    <br />
                    <h4 id='Loggedinas'>Logged in as<br/>{userDisplayName}</h4>
                </div>
            </div>
            <div className='sidebar-item'>
                <button className='sidebar-label' onClick={() => handleSidebarButtonClick('/')}>
                    Home
                </button>
            </div>
            <div className='sidebar-item'>
                <button className='sidebar-label' onClick={() => handleSidebarButtonClick('/schedule')}>
                    Schedule
                </button>
            </div>
        </>
    )
}

export default LoadInStudentData;