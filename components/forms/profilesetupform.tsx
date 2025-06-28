"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

function ProfileSetupForm({ token }: {token: string| null}) {
    const router = useRouter();

   
    const [formData, setFormData] = useState(
        { display_name: "", username: "", password: "", confirmpassword: "", risk_tolerance: undefined, alert_threshold: undefined }
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

        //check password with confirmpassword only if either is not empty
        if (formData.password || formData.confirmpassword) {
            if (formData.password !== formData.confirmpassword) {
                alert("Passwords do not match");
                return;
            }
        }


        // Perform profile update logic here

        //adding data if user input something to be change
        const updateData: any = {};

        if (formData.display_name.trim() !== "") updateData.display_name = formData.display_name;
        if (formData.username.trim() !== "") updateData.username = formData.username;
        if (formData.risk_tolerance) updateData.risk_tolerance = formData.risk_tolerance;
        if (formData.alert_threshold !== undefined && formData.alert_threshold !== null && formData.alert_threshold !== "") updateData.alert_threshold = formData.alert_threshold;

        if (formData.password && formData.confirmpassword) {
            updateData.password = formData.password;
            updateData.confirmpassword = formData.confirmpassword;
        }
        
        try {
            const response = await fetch("https://aivestor-wnxv.onrender.com/profileUpdateRequest/update/", {
                method: "POST",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                router.push("/dashboard?successfulUpdate=true");
                alert("Your profile was updated successfully!");
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
                                name="display_name"
                                placeholder="Displayed Name"
                                value={formData.display_name}
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
                                name="confirmpassword"
                                placeholder="Confirm Password"
                                value={formData.confirmpassword}
                                onChange={handleChange}
                                className= {inputStyle}
                            />
                        </div>

                        {/* Risk Tolerance */}
                        <div>
                            <label className="block mb-1">Risk Tolerance</label>
                            <select
                                name="risk_tolerance"
                                value={formData.risk_tolerance}
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
                                name="alert_threshold"
                                placeholder="10"
                                value={formData.alert_threshold}
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