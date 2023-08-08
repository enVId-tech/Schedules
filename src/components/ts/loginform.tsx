/* eslint-disable jsx-a11y/heading-has-content */
import React from 'react';
import logIn from '../ts/login.ts';

const LoginForm: React.FC = () => {
    return (
        <form id="MainLogin">
            <input type="text" autoComplete="username" placeholder="Username" id="username" spellCheck="false" />
            <br /><br />
            <input type="password" autoComplete="current-password" placeholder="Password" id="password"
                spellCheck="false" />
            <br /><br />
            <h1 id="Error"></h1>
            <button type="submit" id="LoginButton" onClick={() => logIn()}>Login</button>

            <br /><br /><br />

            <a href="http://localhost:3001/auth/google" className="googlesignin">
                <span className="fa fa-google"></span>Register/Sign In with Google
            </a>
        </form>
    )
}

export default LoginForm;