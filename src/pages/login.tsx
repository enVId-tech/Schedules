import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import ClassHelmet from '../components/ts/pagehead.tsx';
import '../components/scss/home.module.scss'

const LoginPage: React.FC = () => {
    return (
        <HelmetProvider>
            <ClassHelmet page="Login" />
            <div>
                <center>
                </center>
            </div>
        </HelmetProvider>
    );
};

export default LoginPage;
