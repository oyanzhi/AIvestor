"use client";
import { useState, useEffect } from 'react';

export default function StockWatchList({ token }: { token: string | null }) {
    const [tickerlist, setTickerList] = useState<{ ticker: string, expected_percentage_change_in_price: any }[]>([]);
    const [recommendations, setRecommendations] = useState<{ ticker: string, expected_percentage_change_in_price: any }[]>([]);
    const [input, setInput] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const fetchWatchlist = async () => {
        if (!token) {
            alert("Invalid Login Credentials.");
            return;
        }

        try {
            const response = await fetch("https://aivestor-wnxv.onrender.com/aipicks/fetchwatchlist/", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                alert("Failed to fetch Watchlist.");
                return;
            }

            const data = await response.json();

            setTickerList(data.map((item: any) => ({
                ticker: item.stock.ticker,
                expected_percentage_change_in_price: item.stock.expected_percentage_change_in_price

            })));
            fetchRecommendations();
        } catch (error) {
            alert("Error fetching Watchlist");
        }
    }


    const fetchRecommendations = async () => {
        if (!token) {
            alert("Invalid Login Credentials.");
            return;
        }

        try {
            const response = await fetch("https://aivestor-wnxv.onrender.com/aipicks/fetchairecommendations/", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                alert("Failed to fetch AI Recommendations.");
                return;
            }

            const data = await response.json();

            setRecommendations(data.map((stock: any) => ({
                ticker: stock.ticker,
                expected_percentage_change_in_price: stock.expected_percentage_change_in_price

            })));
        } catch (error) {
            alert("Error fetching Recommendations");
        }
    }

    useEffect(() => {
        fetchWatchlist();
        fetchRecommendations();
    }, [token])

    const addTicker = async () => {
        const trimticker = input.trim().toUpperCase();

        if (!token) {
            alert("You're not loggined in. Feature Only Available on Login.");
            return;
        }

        try {
            const response = await fetch("https://aivestor-wnxv.onrender.com/aipicks/addwatchlist/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ tickersymbol: trimticker })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                setInput("");
                return;
            };

            setInput("");
            fetchWatchlist();
            console.log(tickerlist)
            return;

        } catch (error) {
            console.error(error);
            alert("Failed to Fetch Stock");
            setInput("");
            return;
        }
    };

    const removeTicker = async () => {
        const trimticker = input.trim().toUpperCase();

        if (!token) {
            alert("You're not loggined in. Feature Only Available on Login.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/aipicks/removewatchlist/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ tickersymbol: trimticker })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                setInput("");
                return;
            };

            alert("Ticker Removed.");
            setInput("");
            fetchWatchlist();
            return;
        } catch (error) {
            alert("Failed to Remove from Watchlist.");
            setInput("");
            return;
        }

    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.length === 0) {
            alert("Input is Empty")
            return;
        }
        return await addTicker();
    }

    return (
        <div className="w-full min-h-screen mt-16">
            {/* SearchBar */}
            <div className="flex justify-center items-center h-16">
                <form onSubmit={handleSubmit} className="flex items-center space-x-4">
                    <input placeholder="Enter Ticker" required value={input} name="ticker" className="w-64 px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none" type="text" onChange={handleChange} />
                    <button className="bg-buttonblue hover:bg-buttonhoverblue text-white px-4 py-2 rounded-xl font-semibold transition" type="submit">Add</button>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold transition" type="button" onClick={removeTicker}>Remove</button>
                </form>
            </div>

            {/* Disclaimer */}
            <div className='w-full h-6 flex justify-center'>
                <p className="text-xs text-white">
                    Disclaimer: The following predictions are for informational purposes only. Please conduct your own research and make investment decisions responsibly.
                </p>
            </div>

            {/* Watchlist */}
            <h2 className="text-white text-xl font-bold mt-8 mb-2 text-center">AI Recommends</h2>
            <div className="w-full flex justify-center">
                <table className="table-auto border-separate border-spacing-y-2">
                    <thead>
                        <tr className="text-gray-400">
                            <th scope="col" className="px-25 py-3 border-b text-center">Ticker</th>
                            <th scope="col" className="px-25 py-3 border-b text-center">Expected Percentage Change In Price (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recommendations.map(({ ticker, expected_percentage_change_in_price }) => (
                            <tr key={ticker} className="text-white">
                                <td className="px-25 py-3 border-t border-b text-center">{ticker}</td>
                                <td className="px-25 py-5 border-t border-b text-center">{expected_percentage_change_in_price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Recommendations */}
            <h2 className="text-white text-xl font-bold mt-8 mb-2 text-center">Your Watchlist</h2>
            <div className="w-full flex justify-center">
                <table className="table-auto border-separate border-spacing-y-2">
                    <thead>
                        <tr className="text-gray-400">
                            <th scope="col" className="px-25 py-3 border-b text-center">Ticker</th>
                            <th scope="col" className="px-25 py-3 border-b text-center">Expected Percentage Change In Price (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickerlist.map(({ ticker, expected_percentage_change_in_price }, index) => (
                            <tr key={ticker + index} className="text-white">
                                <td className="px-25 py-3 border-t border-b text-center">{ticker}</td>
                                <td className="px-25 py-5 border-t border-b text-center">{expected_percentage_change_in_price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}