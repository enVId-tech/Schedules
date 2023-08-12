/* eslint-disable jsx-a11y/heading-has-content */
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import ClassHelmet from '../../components/ts/pagehead.tsx';
import LoginForm from './loginform.tsx';

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
                    <LoginForm />
                    <br /><br />
                </div>
            </div>
        </HelmetProvider>
    );
};

export default LoginPage;
