import React from 'react';
import '../scss/sidebar.module.scss';
import LoadInStudentData from './loadinstudentdata.tsx';

const Sidebar: React.FC = () => {
    return (
        <section className='sidebar' id='sidebar'>
        <div className='sidebardiv' id='sidebardiv'>
            <LoadInStudentData />
        </div>
        <div id='Credits'>
            <h1 id='ComputerScience'>Personal Project</h1>
            <h2 id='Copyright'>(Unofficial) Copyright 2023; All rights reserved.</h2>
        </div>
    </section>
    )
}

export default Sidebar;