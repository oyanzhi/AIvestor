"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

function ProfileSetupForm() {
    const router = useRouter();

    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        setToken(sessionStorage.getItem("token"));
    })

    const [formData, setFormData] = useState(
        { displayName: "", username: "", password: "", confirmPassword: "", risktolerance: undefined, alertThreshold: undefined }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); //prevents cancelling of form
        //additional front end password validation

        if (!token) {
            alert("You're not loggined in. Feature Only Available on Login.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        // Perform registration logic here
        try {
            const response = await fetch("https://aivestor-wnxv.onrender.com/profileUpdateRequest/update/", {
                method: "POST",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {   displayName: formData.displayName,
                        username: formData.username,
                        password: formData.password,
                        confirm_password: formData.confirmPassword,
                        risktolerance: formData.risktolerance,
                        alertThreshold: formData.alertThreshold
                    }
                ),
            });

            if (response.ok) {
                router.push("/dashboard?successfulUpdate=true");
            } else {
                const error = await response.json();
                let errorMessage = "Update Particulars failed";
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


    const labelStyle = "block text-white font-bold ml-1 mb-1";
    const inputStyle = "w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none";

    return (
        <div className="flex flex-col min-h-screen bg-deepblue text-white">
            <main className="flex-grow flex items-center justify-center pt-20">
                <div className="bg-bluebox p-8 rounded-2xl shadow-lg w-full max-w-xl">
                    <h1 className="text-3xl font-bold text-cyan-400 text-center mb-6">Profile Settings</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Display name */}
                        <div>
                            <label className="block mb-1">Display Name</label>
                            <input
                                type="text"
                                name="displayName"
                                placeholder="Displayed Name"
                                value={formData.displayName}
                                onChange={handleChange}
                                className= {inputStyle}
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block mb-1">Change Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="New Username"
                                value={formData.username}
                                onChange={handleChange}
                                className= {inputStyle}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block mb-1">Change Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="New Password"
                                value={formData.password}
                                onChange={handleChange}
                                className= {inputStyle}
                            />
                        </div>

                        {/* confirm Password */}
                        <div>
                            <label className="block mb-1">Confirm new Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className= {inputStyle}
                            />
                        </div>

                        {/* Risk Tolerance */}
                        <div>
                            <label className="block mb-1">Risk Tolerance</label>
                            <select
                                name="riskAppetite"
                                value={formData.risktolerance}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        
                        {/* Alert Threshold */}
                        <div>
                            <label className="block mb-1">Alert Threshold (%)</label>
                            <input
                                type="number"
                                name="alertThreshold"
                                placeholder="10"
                                value={formData.alertThreshold}
                                onChange={handleChange}
                                min={1}
                                className= {inputStyle}
                            />
                            <p className="text-sm text-gray-300 mt-1">
                                You’ll receive alerts if a stock changes more than this amount.
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-buttonblue hover:bg-buttonhoverblue text-white py-2 rounded-xl font-semibold transition"
                        >
                            Save Changes
                        </button>
                    </form>
                </div>
            </main >
        </div >
    );
}

export default ProfileSetupForm;