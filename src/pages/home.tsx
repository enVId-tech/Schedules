import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import HomeContent from '../components/ts/homecontent.tsx';
import ClassHelmet from '../components/ts/pagehead.tsx';

const HomePage: React.FC = () => {
    return (
        <HelmetProvider>
            <ClassHelmet page="Home" />
            <HomeContent />
        </HelmetProvider>
    );
}

export default HomePage;