import React, { useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import ClassHelmet from "../../components/ts/pagehead.tsx";
import Sidebar from "../../components/ts/sidebar.tsx";

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

        setStudents(response);
    }

    const createPeriods = (i: number) => {
        return (
            <div className="Student" onClick={() => appearOrDisappear(students[i].studentID)}>
                <h1 className="Name">{students[i].displayName}</h1>
                <h2 className="StudentInfo">{students[i].studentID} - {students[i].grade}th grade</h2>
                <div className="Periods">
                    {students[i].schedule.map((period: any, index: number) => {
                        return (
                            <p className="Period" id={index.toString()}>P{period.period} - {period.class}</p>

                        )
                    })}
                </div>
            </div>
        )
    }

    const createFullSchedules = (i: number) => {
        const defaultStyle = {
            display: 'none'
        };
        return (
            <div id="FullSchedules" className={`Student${students[i].studentID}`} style={defaultStyle}>
                <div id="fullpageschedule">
                    {
                        <div className="StudentFull" key={i}>
                            <div id="NameFull">
                                <h1 className="Name">{students[i].displayName}</h1>
                                <h2 className="StudentInfo">{students[i].studentID} - {students[i].grade}th grade</h2>
                                <p onClick={() => appearOrDisappear(students[i].studentID)} id="CloseWindow">Close</p>
                            </div>
                            <div className="PeriodsFull">
                                {
                                    students[i].schedule.length > 0 ?
                                        students[i].schedule.map((period: any, index: number) => (
                                            <div id={`PeriodFull-${i}-${index}`} key={`PeriodFull-${i}-${index}`} className="PeriodFullTeachers">
                                                <p className="PeriodFullName">P{period.period}</p>
                                                <p className="ClassName">{period.class}</p>
                                                <p className="TeacherFullName">Teacher: {period.teacher}</p>
                                            </div>
                                        )) : <p className="NoSchedule">No schedule found.</p>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    };

    const appearOrDisappear = (studentID: string) => {
        const student = document.querySelector(`.Student${studentID}`) as HTMLElement;

        if (student.style.display === "none") {
            student.style.display = "flex";
        } else {
            student.style.display = "none";
        }
    };

    return (
        <HelmetProvider>
            <ClassHelmet page="Schedules" />
            <span id="schedulespage">
                <Sidebar />
                {
                    <span id="Schedules">
                        <h1 id="SchedulesLabel">Schedules</h1>
                        <hr id="line" />
                        <div id="Students">
                            {
                                students.map((student: any, i: number) => (
                                    createPeriods(i)
                                ))
                            }
                        </div>
                    </span>
                }
                {
                    students.map((student: any, i: number) => (
                        createFullSchedules(i)
                    ))
                }
            </span>
        </HelmetProvider>
    );
};

export default SchedulesPage;