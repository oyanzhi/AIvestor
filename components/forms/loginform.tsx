"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingIndicator from '../loadingIndicator';

function LoginForm() {
    const [formData, setFormData] = useState({ username: '', password: '' });

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); //prevents cancelling of form

        setLoading(true)
        try {
            const response = await fetch("https://aivestor-wnxv.onrender.com/loginaccountapp/loginpage/", {
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
                const { message, access } = data;
                console.log(message)
                console.log(data)
                sessionStorage.setItem("token", access);
                router.replace("/dashboard");
                alert("You have successfully log in!");
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
        } finally {
            setLoading(false)
        };
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="block text-white mb-1">Username</label>
                <input
                    type="text"
                    name="username"
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
                    placeholder="Username"
                    value={formData.username}
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-buttonblue hover:bg-buttonhoverblue text-white py-2 rounded-xl font-semibold transition"
            >
                {loading ? <LoadingIndicator text="Login..." /> : "Login"}
            </button>
        </form>



    );
}

export default LoginForm;