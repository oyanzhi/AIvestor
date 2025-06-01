"use client"

import LoginSideBar from "../../components/sidebar/loginsidebar.js";
import LoginForm from "../../components/forms/loginform.js";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function LoginPage() {
    const searchParams = useSearchParams();
    const successfulRegistration = searchParams.get('successfulRegistration') === 'true';
    return (
        <div className="login-page">
            <div><LoginSideBar /></div>

            <div className="login-container">
                {successfulRegistration && (<div id="successfulregistration">Successful Registration. Please Login.</div>)}

                <div className="login-form">
                    <h1 id="login-text">Login</h1>
                    <div><LoginForm /></div>
                    <p id="register">Don't have an account? <Link href="/register">Register here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
