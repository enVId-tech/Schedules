import React, { useState, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import '../components/scss/home.scss';
import ClassHelmet from "../components/ts/pagehead.tsx";
import Sidebar from "../components/ts/sidebar.tsx";

interface Student {
    displayName: string;
    grade: number;
    profilePicture: string;
    schedule: object[];
    studentID: string;
}

const SchedulesPage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        getStudents();
    }, []);

    const getStudents: () => void = async () => {
        const data = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const fetchData = await fetch('/api/getstudentschedules', data);
        const response = await fetchData.json();

        if (response.error) {
            console.error(response.error);
            throw new Error(response.error);
        }

        console.log(response);

        setStudents(response);
    }

    const createPeriods = () => {
        for (let i = 0; i < students.length; i++) {
            return (
                <div className="Student">
                    <h1 className="Name">{students[i].displayName}</h1>
                    <h2 className="StudentInfo">{students[i].studentID} - {students[i].grade}th grade</h2>
                    <div className="Periods">
                        {students[i].schedule.map((period: any) => {
                            return (
                                <p className="Period">P{period.period} - {period.class}</p>
                            )
                        })}
                    </div>
                </div>
            )
        }
    }

    return (
        <HelmetProvider>
            <ClassHelmet page="Schedules" />
            <span id="schedulespage">
                <Sidebar />
                <span id="Schedules">
                    <h1 id="SchedulesLabel">Schedules</h1>
                    <hr id="line" />
                    <div id="Students">
                        {createPeriods()}
                    </div>
                </span>
            </span>
        </HelmetProvider>
    );
};

export default SchedulesPage;