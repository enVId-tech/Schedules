import React from 'react';
import '../scss/home.module.scss';

const HomeContent: React.FC = () => {
    return (
        <section className='content'>
            <div id="NamePlate">Welcome Placeholder!</div>
            <span id="NewsOfTheDay">
                <span id="Prerequistes">
                    <div id="Assignments">
                        <h1 id="AssignmentsTitle">Assignments</h1>
                        <p id="AssignmentsContent">This box that you see shows you pain</p>
                    </div>
                    <div id="Announcements">
                        <h1 id="AnnouncementsTitle">Announcements</h1>
                        <p id="AnnouncementsContent">Teachers yell at you constantly here</p>
                    </div>
                    <div id="UpcomingEvents">
                        <h1 id="UpcomingEventsTitle">Upcoming Events</h1>
                        <p id="UpcomingEventsContent">ASB has an aneurysm here</p>
                    </div>
                </span>
            </span>
        </section>
    )
}

export default HomeContent;