'use client';

import LoginNavBar from "../../components/sidebar/loginnavbar";
import LoginForm from "../../components/forms/loginform";
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Footer from "../../components/sidebar/footer";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

function LoginPage() {
    const searchParams = useSearchParams();
    const successfulRegistration = searchParams.get('successfulRegistration') === 'true';

    const router = useRouter();
    
    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            const response = await fetch("https://aivestor-wnxv.onrender.com/loginaccountapp/googlelogin/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_token: credentialResponse.credential,
                }),
            })

            if (response.ok) {
                const data = await response.json();
                const { message, access } = data;
                console.log(message)
                sessionStorage.setItem("token", access);
                router.replace("/dashboard");
                alert("You have successfully log in!");
            } else {
                const errorData = await response.json(); //error data
                if (errorData.non_field_errors) {
                    alert("Invalid Username or Password. Please try again.");
                } else {
                    alert("Unknown Error Occured. Please try again.");
                };
            };
        } catch (error) {
            console.error("Fetch Error:", error); //network or fetch error
            alert("A network error has occured during login.");
        }
    }

    const handleFailure = () => {
        alert("Google Login Failed.");
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
