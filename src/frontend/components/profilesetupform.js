import { useState } from 'react';

function ProfileSetupForm() {

    const [formData, setFormData] = useState(
        { displayname: "", email: "" }
    );
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); //prevents empty submission of form
        console.log('Profile Details:', formData); //to replace with actual register logic
    };

    return (
        <form className="entryfields" onSubmit={handleSubmit}>
            <input
                type="text"
                name="displayname"
                placeholder="Display Name"
                value={formData.displayname}
                onChange={handleChange}
                required />

            <button type="submit">Setup Profile</button>
        </form>
    );
}

export default ProfileSetupForm;