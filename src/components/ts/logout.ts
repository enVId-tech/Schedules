import { useEffect } from 'react';

/**
 * Logs out the current user by sending a GET request to the server and redirecting to the login page.
 * @returns A Promise that resolves when the user is logged out.
 */
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

/**
 * Checks if the user is logged in by making a GET request to '/student/data/checklogin'.
 * If the response status is not 200, the user is redirected to the login page.
 * @throws {Error} If there is an error with the fetch request.
 * @returns {Promise<void>} A Promise that resolves when the check is complete.
 */
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