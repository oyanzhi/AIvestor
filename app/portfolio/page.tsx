"use client"

import React, { useState, useEffect } from "react";
import MainNavBar from '../../components/sidebar/mainnavbar';
import Footer from '../../components/sidebar/footer';
import PortfolioTable from "../../components/portfolioTable";

export default function PortfolioPage() {
    const [holdings, setHoldings] = useState([]);

    useEffect(() => {
        // to be replaced with the actual API call
        const fetchHoldings = async () => {
            const response = await fetch("http://localhost:8000/api/portfolio/", {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            setHoldings(data);
        };
        fetchHoldings();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-deepblue text-white">
            <MainNavBar />
            <PortfolioTable />
            <Footer />
        </div>
    );
}
