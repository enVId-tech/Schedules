import React from 'react';
import '../scss/home.scss'

const HomeContent: React.FC = () => {

    const sendToDifferentPage = (page: string) => {
        window.location.href = page;
    }

    return (
        <>
            <span id="homepage">
                <div id="Sidebar">
                    <div id="Logo">
                        <img src="NotepadTransparent.jpg" alt="Logo" id="LogoImage" />
                        <p id="LoggedIn">Logged in as [placeholder]</p>
                        <h1 id="LogoText">Schedules</h1>
                    </div>
                    <div id="Menu">
                        <div className="MenuItem" id="Home" onClick={() => sendToDifferentPage('/')}>
                            <h2 className="MenuText">Home</h2>
                        </div>
                        <div className="MenuItem" id="SchedulesList" onClick={() => sendToDifferentPage('/schedules')}>
                            <h2 className="MenuText">Schedules</h2>
                        </div>
                        <div className="MenuItem" id="Settings">
                            <h2 className="MenuText">Settings</h2>
                        </div>
                        <div className="MenuItem" id="LogOut" onClick={() => sendToDifferentPage('/login')}>
                            <h2 className="MenuText">Log Out</h2>
                        </div>
                    </div>
                </div>

                <div id="main2">
                    <h1 id="home">Home</h1>
                    <hr id="line" />
                    <span id="homepage-content">
                        <div id="YourPeriods">
                            <h1 id="PeriodsLabelMain">Your Periods</h1>
                            <span className="PersonalPeriodSelection">
                                <h1 className="PeriodNum">P1</h1>
                                <input type="text" id="Period1" className="PeriodInput" placeholder=" Period 1" />
                            </span>
                            <span className="PersonalPeriodSelection">
                                <h1 className="PeriodNum">P2</h1>
                                <input type="text" id="Period2" className="PeriodInput" placeholder=" Period 2" />
                            </span>
                            <span className="PersonalPeriodSelection">
                                <h1 className="PeriodNum">P3</h1>
                                <input type="text" id="Period3" className="PeriodInput" placeholder=" Period 3" />
                            </span>
                            <span className="PersonalPeriodSelection">
                                <h1 className="PeriodNum">P4</h1>
                                <input type="text" id="Period4" className="PeriodInput" placeholder=" Period 4" />
                            </span>
                            <span className="PersonalPeriodSelection">
                                <h1 className="PeriodNum">P5</h1>
                                <input type="text" id="Period5" className="PeriodInput" placeholder=" Period 5" />
                            </span>
                            <span className="PersonalPeriodSelection">
                                <h1 className="PeriodNum">P6</h1>
                                <input type="text" id="Period6" className="PeriodInput" placeholder=" Period 6" />
                            </span>
                            <span className="PersonalPeriodSelection">
                                <h1 className="PeriodNum">P7</h1>
                                <input type="text" id="Period7" className="PeriodInput" placeholder=" Period 7" />
                            </span>
                            <span className="PersonalPeriodSelection">
                                <h1 className="PeriodNum">P8</h1>
                                <input type="text" id="Period8" className="PeriodInput" placeholder=" Period 8" />
                            </span>
                            <span className="PersonalPeriodSelection">
                                <h1 className="PeriodNum">00 </h1>
                                <input type="submit" id="Save" className="PeriodInput" value="Press to Save" />
                            </span>
                        </div>
                        <div id="PeriodsRecent">
                            <span id="Visited">
                                <h1 id="VisitedRecent">
                                    Recently Visited Periods
                                </h1>
                            </span>
                            <span id="Saved">
                                <h1 id="SavedRecent">
                                    Saved Periods
                                </h1>
                            </span>
                        </div>
                    </span>
                </div>
            </span>
        </>
    )
}

export default HomeContent;