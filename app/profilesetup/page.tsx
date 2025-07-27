"use client"

import MainSideBar from "../../components/sidebar/mainnavbar";
import ProfileSetupForm from "../../components/forms/profilesetupform";
import Footer from "../../components/sidebar/footer";

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";

function ProfileSetupPage() {
    const router = useRouter();
    const [authCheck, setAuthCheck] = useState(false);

    useEffect(() => {
        const authToken = sessionStorage.getItem("token");
        if (!authToken) {
            router.replace("/login");
        } else {
            setAuthCheck(true);
        }
    }, [router]);

    if (!authCheck) {
        return; //empty waiting - maybe can add a temp
    }

    const hidden: string[] = [];

    return (
        <div className="flex flex-col min-h-screen bg-deepblue">
            <MainSideBar noshow={hidden} />
            <ProfileSetupForm token={sessionStorage.getItem("token")} />
            <Footer />
        </div>
    );
}

export default ProfileSetupPage;
