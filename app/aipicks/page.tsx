"use client";

import { useEffect } from 'react';

import MainNavBar from '../../components/sidebar/mainnavbar';
import StockSearchBar from '../../components/stocksearchbar';

function AIPicks() {

    return (
        <div className="flex flex-col min-h-screen bg-deepblue">
            {/* NavBar */}
            <MainNavBar/>

            {/* Content */}
            <StockSearchBar/>

        </div>
    )
}

export default AIPicks
