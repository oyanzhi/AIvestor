"use client";

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation"

import MainNavBar from '../../components/sidebar/mainnavbar';
import StockWatchList from '../../components/stockwatchlist';

function AIPicks() {
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
            {/* NavBar */}
            <MainNavBar/>

            {/* Content */}
            <StockWatchList/>

        </div>
    )
}

export default AIPicks
