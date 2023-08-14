/* eslint-disable jsx-a11y/heading-has-content */
import React, { useRef, useEffect } from 'react';

const LoginForm: React.FC = () => {
    const error = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ifEnterKey = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                logIn();
            }
        }
        document.addEventListener("keydown", ifEnterKey);
        return () => {
            document.removeEventListener("keydown", ifEnterKey);
        }
    }, []);

    const logIn = async (): Promise<string> => {
        const username: string = (document.getElementById("username") as HTMLInputElement).value;
        const password: string = (document.getElementById("password") as HTMLInputElement).value;

        const response: Response = await fetch("/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        if (response.status === 200) {
            window.location.href = "/home";
        } else {
            error.current!.innerHTML = "Invalid username or password";
            setTimeout(() => {
                error.current!.innerHTML = "";
            }, 2000);
        }
        return "";
    }

    return (
        <div id="MainLogin">
            <input type="text" autoComplete="username" placeholder="Username" id="username" spellCheck="false" />
            <br /><br />
            <input type="password" autoComplete="current-password" placeholder="Password" id="password"
                spellCheck="false" />
            <br /><br />
            <h1 id="Error" ref={error}></h1>
            <button type="submit" id="LoginButton" onClick={() => logIn()}>Login</button>

            <br /><br /><br />

            <a href="http://localhost:3001/auth/google" className="googlesignin">
                <span className="fa fa-google"></span>Register/Sign In with Google
            </a>
        </div>
    )
}

export default LoginForm;