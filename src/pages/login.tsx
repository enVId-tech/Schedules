/* eslint-disable jsx-a11y/heading-has-content */
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import ClassHelmet from '../components/ts/pagehead.tsx';
import '../components/scss/home.scss';
import { logIn } from '../components/ts/login.ts';

const LoginPage: React.FC = () => {
    return (
        <HelmetProvider>
            <ClassHelmet page="Login" />
            <div id="loginpage">
                <div className="LoginContainer">
                    <span id="BackgroundImage">
                        <br /><br /><br />
                        <h1 id="CopyrightedMaterial">Schedules List</h1>
                    </span>
                    <p id="LoginLabel">Login</p>
                    <br /><br />
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
                    <br /><br />
                </div>
            </div>

        </HelmetProvider>
    );
};

export default LoginPage;
