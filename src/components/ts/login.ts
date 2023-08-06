async function logIn(): Promise<string> {
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
        return response.text();
    }

    return "";
}

export {
    logIn
}