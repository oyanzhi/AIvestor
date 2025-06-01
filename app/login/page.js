'use client';

import "../../styles/pagecss/loginpage.css";
import LoginSideBar from "../../components/sidebar/loginsidebar.js";
import footer from "../../components/sidebar/footer.jsx";
import LoginForm from "../../components/forms/loginform.js";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Footer from "../../components/sidebar/footer.jsx";

function LoginPage() {
    const searchParams = useSearchParams();
    const successfulRegistration = searchParams.get('successfulRegistration') === 'true';
    return (
        <div className="flex flex-col min-h-screen bg-deepblue">
            <LoginSideBar />

            <main className="flex-grow flex items-center justify-center pt-2">
                <div className="bg-bluebox p-8 rounded-2xl shadow-lg w-96">
                    {successfulRegistration && (<div id="successfulregistration">Successful Registration. Please Login.</div>)}
                    <h1 className="text-3xl font-bold text-center text-cyan-400 mb-6">Login to AIvestor</h1>
                    <div><LoginForm /></div>
                    <p className="text-sm text-center text-gray-300 mt-4">
                        Don’t have an account? <a href="/register" className="text-cyan-400 hover:underline">Register here</a>
                    </p>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}

export default LoginPage;
