const LoadInStudentData = async () => {
    try {
    const fetchData = await fetch("/api/getstudentdata");
    const data = await fetchData.json();

    return data;
    } catch (err) {
        window.location.href = "/login";
    }
};

export default LoadInStudentData;