import React, { useState, useEffect } from 'react';
import '../scss/home.scss'
import Sidebar from './sidebar.tsx';

const HomeContent: React.FC = () => {
    const [periods, setPeriods] = useState([]);
    const [grades, setGrades] = useState("7");

    useEffect(() => {
        getPeriods();
    }, []);

    const savePeriods: () => void = async () => {
        let periods = [];

        periods.push((document.getElementById("Period1") as HTMLInputElement).value);
        periods.push((document.getElementById("Period2") as HTMLInputElement).value);
        periods.push((document.getElementById("Period3") as HTMLInputElement).value);
        periods.push((document.getElementById("Period4") as HTMLInputElement).value);
        periods.push((document.getElementById("Period5") as HTMLInputElement).value);
        periods.push((document.getElementById("Period6") as HTMLInputElement).value);
        periods.push((document.getElementById("Period7") as HTMLInputElement).value);
        periods.push((document.getElementById("Period8") as HTMLInputElement).value);

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
                                <select id="Grades" title='Select Grade' className="PeriodInput" onChange={(e) => setGrades(e.target.value)}>
                                    <option value="7">7th Grade</option>
                                    <option value="8">8th Grade</option>
                                    <option value="9">9th Grade</option>
                                    <option value="10">10th Grade</option>
                                    <option value="11">11th Grade</option>
                                    <option value="12">12th Grade</option>
                                </select>
                            </div>
                            <span className="PersonalPeriodSelection">
                                <h1 className="PeriodNum">P1</h1>
                                <select id="Period1" className="PeriodInput" title='Select Teacher'>
                                    {
                                    Object.keys(grades).map((grade: any) => {
                                        console.log(periods[0])
                                    return (
                                        <option value={grade}>{grade}</option>
                                    )
                                    })}
                                </select>
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