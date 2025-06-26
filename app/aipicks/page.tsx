"use client";

import { useEffect } from 'react';

import MainNavBar from '../../components/sidebar/mainnavbar';
import StockWatchList from '../../components/stockwatchlist';

function AIPicks() {

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
