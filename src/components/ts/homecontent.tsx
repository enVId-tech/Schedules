import React, { useState, useEffect } from 'react';
import '../scss/home.scss'
import Sidebar from './sidebar.tsx';

interface Teacher {
    name: string;
    periods: number[];
}

interface Subject {
    subject: string;
    teachers: Teacher[];
}

const HomeContent: React.FC = () => {
    const [periods, setPeriods] = useState([]);
    const [grades, setGrades] = useState("7");

    const numberOfPeriods = 8;

    useEffect(() => {
        getPeriods();
    }, [grades]); // Update when the selected grade changes

    const jsonData: Subject[] = periods[0] ? periods[0][Number(grades)] : [];


    const savePeriods: () => void = async () => {
        let periods = [];

        for (let i = 1; i <= numberOfPeriods; i++) {
            const period = document.getElementById(`Period${i}`) as HTMLSelectElement;
            const teacher = period.value.split('P')[0];
            const periodNum = period.value.split('P')[1];

            if (teacher && periodNum) {
                periods.push({
                    teacher,
                    period: Number(periodNum)
                });
            }
        }

        console.log(periods);

        const data = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(periods)
        }

        const fetchData = await fetch('/api/saveperiods', data);
        const response = await fetchData.json();

        if (response.status === 'success') {
            alert('Successfully saved periods!');
        } else {
            alert('Failed to save periods!');
        }
    }

    const getPeriods: () => void = async () => {
        try {
            const fetchData = await fetch('/api/getteachers');
            const response = await fetchData.json();

            setPeriods(response);
        } catch (error) {
            console.log(error);
        }
    }

    const renderTeacherOptions = (period: number) => {
        return (
            jsonData.map((subject) => (
                subject.teachers.length > 0 ? (
                    <optgroup label={subject.subject}>
                        {subject.teachers.map((teacher) => (
                            teacher.periods.includes(period) ? (
                                <option value={`${teacher.name}P${period}`}>{teacher.name}, P{period}</option>
                            ) : (
                                null
                            )
                        ))}
                    </optgroup>
                ) : (
                    null
                )
            ))
        );
    };

    return (
        <>
            <span id="homepage">
                <Sidebar />

                <div id="main2">
                    <h1 id="home">Home</h1>
                    <hr id="line" />
                    <span id="homepage-content">
                        <div id="YourPeriods">
                            <div id="P">
                                <h1 id="PeriodsLabelMain">Your Periods</h1>
                                <select
                                    id="Grades"
                                    title='Select Grade'
                                    className="PeriodInput"
                                    value={grades}
                                    onChange={(e) => setGrades(e.target.value)}
                                >
                                    {
                                        Array.from({ length: 6 }, (_, i) => i + 7).map((grade) => (
                                            <option value={grade}>{grade}th Grade</option>
                                        ))
                                    }
                                </select>
                            </div>
                            {
                                Array.from({ length: numberOfPeriods }, (_, i) => i + 1).map((period) => (
                                    <span className="PersonalPeriodSelection">
                                        <h1 className="PeriodNum">P{period}</h1>
                                        <select
                                            id={`Period${period}`}
                                            className="PeriodInput"
                                            title='Select Teacher'
                                        >
                                            <option value="">Select a subject</option>
                                            {
                                                renderTeacherOptions(period)
                                            }
                                        </select>
                                    </span>
                                ))
                            }
                            <span className="PersonalPeriodSelection">
                                <h1 className="PeriodNum">00 </h1>
                                <input type="submit" id="Save" className="PeriodInput" value="Press to Save" onClick={() => savePeriods()} />
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