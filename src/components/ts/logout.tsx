import React, { useEffect } from 'react';

async function logOut(): Promise<void> {
    try {
        const logOutData: object = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }

        try {
            const logOutResponse: Response = await fetch('/student/data/logout', logOutData);
            const logOutResponseJSON: object = await logOutResponse.json();
            console.log(logOutResponseJSON);
        } catch (error: any) {
            console.error(error);
            throw new Error(error);
        } finally {
            window.location.href = '/logout';
        }
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}

async function checkLogin(): Promise<void> {
    try {
        const checkLoggedInData: object = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        };

        try {
            const response: Response = await fetch('/student/data/checklogin', checkLoggedInData);

            if (response.status !== 200) {
                window.location.href = '/login';
            }
        } catch (error: any) {
            console.error(error);
            throw new Error(error);
        }
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}

function LoggedOut(): JSX.Element {
    useEffect(() => {
        (async () => {
            await logOut();
        })();
    }, []);

    const handleLogout = async (): Promise<void> => {
        try {
            await logOut();
        } catch (error: any) {
            console.error(error);
            throw new Error(error);
        }
    }

    return (
        <div>
            <button onClick={handleLogout}>Log Out</button>
        </div>
    );
}

async function refreshSessionCookie(): Promise<void> {
    const data: Response = await fetch('/student/data/refresh');

    if (data.status !== 200) {
        //window.location.href = '/login';
        //console.error('Error refreshing session cookie.');
    } else {
        //console.log('Session cookie refreshed.');
    }
}

const logout = {
    logOut,
    checkLogin,
    LoggedOut,
    refreshSessionCookie
}

export default logout;