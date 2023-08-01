import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const LoginPage: React.FC = () => {
    return (
        <HelmetProvider>
            <Helmet>
                <title>Login</title>
            </Helmet>
            <div>Login</div>
        </HelmetProvider>
    );
}

export default LoginPage;