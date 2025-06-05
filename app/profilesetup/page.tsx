"use client"

import "../../styles/componentcss/formcss/profilesetupform.css"
import MainSideBar from "../../components/sidebar/mainnavbar";
import ProfileSetupForm from "../../components/forms/profilesetupform";
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
    }, []);

    if (!authCheck) {
        return; //empty waiting - maybe can add a temp
    }

    const hidden: string[] = ["dashboard", "market", "settings"];

    return (
        <div className="profilesetup-page">
            <div><MainSideBar noshow={hidden} /></div>

            <div className="profile-container">
                <div className="profile-form">
                    <h1 id="profile-text">Setup Profile</h1>
                    <div><ProfileSetupForm /></div>
                </div>
            </div>
        </div>
    );
}

export default ProfileSetupPage;
