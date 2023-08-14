import { useEffect } from 'react';

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

            console.log(logOutResponse);
        } catch (error: any) {
            console.error(error);
            throw new Error(error);
        } finally {
            window.location.href = '/login';
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

export {
    logOut,
    checkLogin
}