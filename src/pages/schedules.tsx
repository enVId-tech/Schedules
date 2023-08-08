import React from "react";
import { HelmetProvider } from "react-helmet-async";
import '../components/scss/home.scss';
import ClassHelmet from "../components/ts/pagehead.tsx";
import Sidebar from "../components/ts/sidebar.tsx";

const SchedulesPage: React.FC = () => {
    return (
        <HelmetProvider>
            <ClassHelmet page="Schedules" />
            <span id="schedulespage">
                <Sidebar />
                <span id="Schedules">
                    <h1 id="SchedulesLabel">Schedules</h1>
                    <hr id="line" />
                    <div id="Students">
                        <div className="Student">
                            <h1 className="Name">Erick Tran</h1>
                            <h2 className="StudentInfo">1071039 - 9th grade</h2>
                            <div className="Periods">
                                <p className="Period">P1 - English 1 H</p>
                                <p className="Period">P2 - Career/Fin/Tech</p>
                                <p className="Period">P3 - Living Earth H</p>
                                <p className="Period">P4 - AP Comp. Sci. Principles</p>
                                <p className="Period">P5 - Adv. String Ensemble</p>
                                <p className="Period">P6 - Spanish 2</p>
                                <p className="Period">P7 - PE 1 - Athletes</p>
                                <p className="Period">P8 - Integrated Math 2-3 H</p>
                            </div>
                        </div>
                        <div className="Student">
                            <h1 className="Name">Nick Nguyen</h1>
                            <h2 className="StudentInfo">1069869 - 9th grade</h2>
                            <div className="Periods">
                                <p className="Period">P1 - Living Earth H</p>
                                <p className="Period">P2 - AP Comp. Sci. Principles</p>
                                <p className="Period">P3 - Integrated Math 2-3 H</p>
                                <p className="Period">P4 - DE-CHIN 101 C</p>
                                <p className="Period">P5 - Adv. String Ensemble</p>
                                <p className="Period">P6 - PE 1 - Athletes</p>
                                <p className="Period">P7 - Health Sci 1</p>
                                <p className="Period">P8 - English 1 H</p>
                            </div>
                        </div>
                    </div>
                </span>
            </span>
        </HelmetProvider>
    );
};

export default SchedulesPage;