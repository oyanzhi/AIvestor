"use client";

import { useState } from 'react';

function StockSearch() {
    const [formData, setFormData] = useState(
        { ticker: "" }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert("test successful")
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input required value={formData.ticker} name="ticker" className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none" type="text" onChange={handleChange} />
                <button className="w-full bg-buttonblue hover:bg-buttonhoverblue text-white py-2 rounded-xl font-semibold transition" type="submit">
                </button>
            </form>
        </div>
    )
}

export default StockSearch
