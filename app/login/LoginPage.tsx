'use client';

import LoginNavBar from "../../components/sidebar/loginnavbar";
import LoginForm from "../../components/forms/loginform";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Footer from "../../components/sidebar/footer";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

function LoginPage() {
    const searchParams = useSearchParams();
    const successfulRegistration = searchParams.get('successfulRegistration') === 'true';

    const handleSuccess = (credentialResponse: CredentialResponse) => {
        console.log(credentialResponse.credential);
        //testing
    }

    const handleFailure = () => {
        alert("Google Login Failed.");
        //testing
    }

    return (
        <div className="flex flex-col min-h-screen bg-deepblue">
            <LoginNavBar />

            <main className="flex-grow flex items-center justify-center pt-2">
                <div className="bg-bluebox p-8 rounded-2xl shadow-lg w-96">
                    {successfulRegistration && (<div className="text-1xl font-bold text-center text-cyan-400 mb-6">Successful Registration. Please Login.</div>)}
                    
                    <h1 className="text-3xl font-bold text-center text-cyan-400 mb-6">Login to AIvestor</h1>

                    <div><LoginForm /></div>

                    <p className="text-sm text-center text-gray-300 mt-4">
                        Don’t have an account? <Link href="/register" className="text-cyan-400 hover:underline">Register here</Link>
                    </p>

                    <div className="flex justify-center mt-4">
                        <GoogleLogin onSuccess={handleSuccess} onError={handleFailure}/>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}

export default LoginPage;
