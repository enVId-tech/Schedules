import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const HomePage: React.FC = () => {
    return (
        <HelmetProvider>
            <Helmet>
                <title>Home</title>
            </Helmet>
            <div>Home</div>
        </HelmetProvider>
    );
}

export default HomePage;