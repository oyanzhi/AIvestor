"use client"

import "../../styles/componentcss/formcss/registerform.css";
import LoginSideBar from "../../components/sidebar/loginsidebar.js";
import RegisterForm from "../../components/forms/registerform.js";
import Link from "next/link";

function RegisterPage() {
    return (
        <div className="register-page">
            <div><LoginSideBar/></div>
            
            <div className="register-container">
                <div className="register-form">
                    <h1 id="register-text">Register</h1>
                    <div><RegisterForm/></div>
                    <p id="register">Already have an account? <Link href="/login">Login here</Link> </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;