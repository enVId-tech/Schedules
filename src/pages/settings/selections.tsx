import React, { useEffect, useState } from 'react';

const SelectionItems = () => {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [visible, setVisible] = useState<string>("");
    const [grade, setGrade] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    useEffect(() => {
        const loadInData = async () => {
            const data = await fetch('/api/getallusersettings');
            const dataJSON = await data.json();

            if (dataJSON.error) {
                console.error(dataJSON.error);
                throw new Error(dataJSON.error);
            }

            console.log(dataJSON);

            setFirstName(dataJSON[0].displayName.split(' ')[0]);
            setLastName(dataJSON[0].displayName.split(' ')[1]);
            setVisible(dataJSON[0].settings.visible);
            setGrade(dataJSON[0].grade);
            setUsername(`${dataJSON[0].studentID}@student.auhsd.us`);
        }

        loadInData();
    }, []);

    const saveSettings: () => void = async () => {
        const firstName = document.getElementById('FirstName') as HTMLInputElement;
        const lastName = document.getElementById('LastName') as HTMLInputElement;
        const visible = document.getElementById('Visible') as HTMLSelectElement;
        const grade = document.getElementById('Grade') as HTMLSelectElement;
        const username = document.getElementById('Username') as HTMLInputElement;
        const password = document.getElementById('Password') as HTMLInputElement;

        const data = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: firstName.value,
                lastName: lastName.value,
                visible: visible.value,
                grade: grade.value,
                username: username.value,
                password: password.value
            })
        }

        const fetchData = await fetch('/api/savesettings', data);
        const response = await fetchData.json();

        if (response.error) {
            console.error(response.error);
            throw new Error(response.error);
        }

        console.log(response);
    }


    return (
        <div id="SettingItems">
            <div className='FirstName'>
                <h1 className='SettingLabel'>First Name</h1>
                <input type='text' placeholder="Erick" id="FirstName" className="SettingItem" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className='LastName'>
                <h1 className='SettingLabel'>Last Name</h1>
                <input type='text' placeholder="Tran" id="LastName" className="SettingItem" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className='Visible'>
                <h1 className='SettingLabel'>Visibility Options</h1>
                <select id="Visible" className="SettingItem selection" value={visible} onChange={(e) => setVisible(e.target.value)}>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="friends">Friends</option>
                </select>
            </div>
            <div className='Grade'>
                <h1 className='SettingLabel'>Grade</h1>
                <select id="Grade" className="SettingItem selection" value={grade} onChange={(e) => setGrade(e.target.value)}>
                    <optgroup label="Middle School" className='optgroupSchoolFont'>
                        <option value="7">7th</option>
                        <option value="8">8th</option>
                    </optgroup>
                    <optgroup label="High School" className='optgroupSchoolFont'>
                        <option value="9">9th</option>
                        <option value="10">10th</option>
                        <option value="11">11th</option>
                        <option value="12">12th</option>
                    </optgroup>
                </select>
            </div>
            <div className='Username'>
                <h1 className='SettingLabel'>Username</h1>
                <input type='text' placeholder="" disabled id="Username" className="SettingItem" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className='Password'>
                <h1 className='SettingLabel'>Password</h1>
                <input type='password' placeholder="********" id="Password" className="SettingItem" />
            </div>
            <div id='SaveSettingsButton'>
                <button id="SaveSettings" onClick={() => saveSettings()}>Save Settings</button>
            </div>
        </div>
    )
}

export default SelectionItems;