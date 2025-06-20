"use client"

import { useState } from 'react';

function ProfileSetupForm() {

    const [formData, setFormData] = useState(
        { displayname: "", username: "", password: "", confirmpassword: "", risktolerance: undefined, notification: undefined }
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
        <form className="space-y-16 w-full mt-24 w-full flex flex-col items-center" onSubmit={handleSubmit}>
            <div className="flex py-10">
                <div className="text-white font-bold w-1/4 mr-60">Public Information</div>
                <div className="flex flex-col justify-between w-3/5 px-20">
                    <label className={labelStyle}>Displayed Name</label>
                    <input
                    className={inputStyle}
                    type="text"
                    name="displayname"
                    placeholder="Displayed Name"
                    value={formData.displayname}
                    onChange={handleChange}
                    required />
                </div>
            </div>

            <hr className="w-300 text-white s" />

            <div className="flex py-10">
                <div className="text-white font-bold w-1/3 mr-60">Personal Information</div>
                <div className="flex flex-col justify-between w-3/5 px-20">
                    <label className={labelStyle}>Username</label>
                    <input
                    className={inputStyle}
                    type="text"
                    name="username"
                    placeholder="New Username"
                    value={formData.username}
                    onChange={handleChange}
                    required />

                    <label className={labelStyle}>Change Password</label>
                    <input
                    className="px-5 py-2 mb-2 w-full rounded-lg bg-gray-800 text-white focus:outline-none"
                    type="password"
                    name="password"
                    placeholder="New Password"
                    value={formData.password}
                    onChange={handleChange}
                    required />

                    <input
                    className={inputStyle}
                    type="password"
                    name="confirmpassword"
                    placeholder="Confirm Password"
                    value={formData.confirmpassword}
                    onChange={handleChange}
                    required />

                    <label className={labelStyle}>Risk Tolerance: {formData.risktolerance} (%)</label>
                    <input
                    className="py-2 mb-10 w-full rounded-lg bg-gray-800 text-white focus:outline-none"
                    type="range"
                    name="risktolerance"
                    min="0"
                    max="100"
                    value={formData.risktolerance}
                    onChange={handleChange}
                    required />

                    <label className={labelStyle}>Notifications</label>
                    <div className="flex mt-1 ml-1 gap-15">
                        <label className="text-white font-medium flex gap-3">Yes
                            <input
                            className="accent-blue-500"
                            type="radio"
                            name="notification"
                            value={formData.notification}
                            onChange={handleChange}
                            required />
                        </label>
                        <label className="text-white font-medium flex gap-3">No
                            <input
                            type="radio"
                            name="notification"
                            value={formData.notification}
                            onChange={handleChange}
                            required />
                        </label>
                    </div>

                </div>
            </div>
            

        </form>
    );
}

export default ProfileSetupForm;