'use client'

import MainNavBar from '../../components/sidebar/mainnavbar';
import NotificationList from '../../components/notifications';
import Footer from '../../components/sidebar/footer';
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";

export default function AlertsPage() {
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
    
    return (
        <div className="flex flex-col min-h-screen bg-deepblue">
            <MainNavBar/>
            <NotificationList token = {sessionStorage.getItem("token")}/>
            <Footer/>
        </div>
    )
}

