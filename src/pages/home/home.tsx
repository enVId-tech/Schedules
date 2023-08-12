import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import ClassHelmet from '../../components/ts/pagehead.tsx';
import HomeContent from './homecontent.tsx';

const HomePage: React.FC = () => {
    return (
        <HelmetProvider>
            <ClassHelmet page="Home" />
            <HomeContent />
        </HelmetProvider>
    );
}

export default HomePage;