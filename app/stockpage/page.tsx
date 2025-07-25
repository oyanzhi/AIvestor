"use client"

import MainNavBar from '../../components/sidebar/mainnavbar';
import Footer from '../../components/sidebar/footer';
import StockDisplay from '../../components/stockDisplay';

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation"

export default function StockPage() {
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
        <div className="flex flex-col min-h-screen bg-deepblue text-white">
            <MainNavBar />
            <StockDisplay token = {sessionStorage.getItem("token")}/>
            <Footer />
        </div>
    );
}
