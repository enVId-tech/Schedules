import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import ClassHelmet from '../components/ts/pagehead.tsx';
import HomeContent from '../components/ts/homecontent.tsx';
import Sidebar from '../components/ts/sidebar.tsx';

const HomePage: React.FC = () => {
    return (
        <HelmetProvider>
            <ClassHelmet page="Home" />
            <div className='home'>
                <Sidebar />
                <center>
                    <HomeContent />
                </center>
            </div>
        </HelmetProvider>
    );
}

export default HomePage;