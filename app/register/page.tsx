'use client';

import LoginNavBar from "../../components/sidebar/loginnavbar";
import RegisterForm from "../../components/forms/registerform";
import Link from "next/link";
import Footer from "../../components/sidebar/footer";

function RegisterPage() {
    return (
        <div>
            <LoginNavBar />

            <div className="flex flex-col min-h-screen bg-deepblue">
                {/* Page Content */}
                <main className="flex-grow flex items-center justify-center pt-20">
                    <div className="bg-bluebox p-8 rounded-2xl shadow-lg w-96">
                        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-6">Create Your AIvestor Account</h1>
                        <div><RegisterForm /></div>
                        <p className="text-sm text-center text-gray-300 mt-4">
                            Already have an account? <Link href="/login" className="text-cyan-400 hover:underline">Login here</Link>
                        </p>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default RegisterPage;