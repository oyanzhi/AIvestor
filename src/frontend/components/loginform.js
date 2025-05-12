import React, { useState } from 'react';
import "../componentscss/formcss/loginform.css";
import { useNavigate } from "react-router-dom";

function LoginForm() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); //prevents empty submission of form

        setErrorMessage(''); //no error by default
        
        try {
            const response = await fetch("http://127.0.0.1:8000/loginaccountapp/loginpage/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        username: formData.username,
                        password: formData.password
                    }
                ),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                navigate("/profilesetuppage"); //add implementation for skipping displayName after once done before 
            } else {
                const errorData = await response.json(); //error data
                if (errorData.non_field_errors) {
                    alert("Invalid Username or Password. Please try again.");
                } else {
                    alert("Unknown Error Occured. Please try again.");
                };
            };
        } catch (error) {
            console.error("Fetch Error:", error); //network or fetch error
            alert("A network error has occured during login.");
        };
    };

    return (
        <form className="entryfields" onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required />
            <button type="submit">Login</button>
        </form>
    );
}

export default LoginForm;