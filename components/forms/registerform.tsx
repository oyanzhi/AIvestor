"use client"

import { useRouter } from 'next/navigation';
import { useState } from 'react';

function RegisterForm() {
    const router = useRouter();

    const [formData, setFormData] = useState(
        { username: "", email: "", password: "", confirmPassword: "" }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); //prevents cancelling of form
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
        <form className="space-y-4" onSubmit={handleSubmit} >
            <div>
                <label className="block text-white mb-1">Username</label>
                <input
                    type="text"
                    name="username"
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
                    placeholder="JaneDoe0923"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label className="block text-white mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label className="block text-white mb-1">Password</label>
                <input
                    type="password"
                    name="password"
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label className="block text-white mb-1">Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
                    placeholder="Confirm your Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-buttonblue hover:bg-buttonhoverblue text-white py-2 rounded-xl font-semibold transition"
            >
                Register
            </button>
        </form>
    );
}

export default RegisterForm;