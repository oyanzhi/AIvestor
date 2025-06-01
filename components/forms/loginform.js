"use client"

import { useState } from 'react';
import "../../styles/componentcss/formcss/loginform.css";
import { useRouter } from 'next/navigation';

function LoginForm() {
    const [formData, setFormData] = useState({ username: '', password: '' });

    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); //prevents empty submission of form
        
        try {
            const response = await fetch("http://localhost:8000/loginaccountapp/loginpage/", {
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
                sessionStorage.setItem("token", data.token);
                router.push("/profilesetup"); //add implementation for skipping displayName after once done before 
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