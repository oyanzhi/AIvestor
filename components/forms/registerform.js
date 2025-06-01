"use client"

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import "../../styles/componentcss/formcss/registerform.css";

function RegisterForm() {
    const router = useRouter();

    const [formData, setFormData] = useState(
        { username: "", email: "", password: "", confirmPassword: "" }
    );
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); //prevents empty submission of form
        //additional front end password validation

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        // Perform registration logic here
        try {
            const response = await fetch("http://localhost:8000/registeraccountapp/registerpage/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        username: formData.username,
                        email: formData.email,
                        password: formData.password,
                        confirm_password: formData.confirmPassword
                    }
                ),
            });

            if (response.ok) {
                router.push("/login?successfulRegistration=true");
            } else {
                const error = await response.json();
                let errorMessage = "Registration failed";
                Object.keys(error).forEach((field) => {
                    const specificError = error[field];
                    if (Array.isArray(specificError)) {
                        errorMessage += `\n${specificError.join(", ")}`;
                    }
                });
                alert(errorMessage);
            };
        } catch (error) {
            console.error("Fetch Error:", error); //network or fetch error
            alert("A network error occurred during registration");
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
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required />

            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required />    
            <button type="submit">Register</button>
        </form>
    );
}

export default RegisterForm;