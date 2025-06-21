"use client"

import { useState } from 'react';

function ProfileSetupForm() {

    const [formData, setFormData] = useState(
        { displayName: "", username: "", password: "", confirmpassword: "", risktolerance: undefined, alertThreshold: undefined }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); //prevents empty submission of form
        console.log('Profile Details:', formData);
    };

    const labelStyle = "block text-white font-bold ml-1 mb-1";
    const inputStyle = "px-5 py-2 mb-10 w-full rounded-lg bg-gray-800 text-white focus:outline-none";

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
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
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
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
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
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
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
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
                            />
                        </div>

                        {/* Risk Tolerance */}
                        <div>
                            <label className="block mb-1">Risk Tolerance: {formData.risktolerance} (%)</label>
                            <input
                                type="range"
                                name="risktolerance"
                                min="0"
                                max="100"
                                value={formData.risktolerance}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
                                required />

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
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
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