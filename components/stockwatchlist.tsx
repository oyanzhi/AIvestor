    "use client";
    
    import { useState, useEffect } from 'react';

    type Stock = {
        ticker: string;
        predictedclosing: number;
    }

    export default function StockWatchList({ token }: {token: string | null}) {
        const [tickerlist, setTickerList] = useState<Stock[]>([]);
        const [input, setInput] = useState("");
        
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInput(e.target.value);
        };

        const addTicker = async () => {
            const trimticker = input.trim().toUpperCase();
            if (!token) {
                alert("You're not loggined in. Feature Only Available on Login.");
                return;
            }
            if (!tickerlist.some((s) => s.ticker === trimticker)) {
                try {
                    const response = await fetch("https://aivestor-wnxv.onrender.com/stockmodelrequest/predictstocklist/", {
                        method: "POST",
                        headers: { 
                            "Authorization": `Token ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ tickersymbol : [trimticker]})
                    })

                    if (!response.ok) {
                        alert("Invalid Ticker");
                        setInput("");
                        return;
                    }

                    const result = await response.json();
                    const price = result[trimticker];
                        
                    if (price === undefined) {
                        alert("No Result");
                        setInput("");
                        return;
                    }

                    setTickerList(prev => [...prev, { ticker: trimticker, predictedclosing: price}]);
                    setInput("");
                    return;
                } catch (error) {
                    alert("Failed to Fetch Prediction");
                    setInput("");
                    return;
                }
            }
            alert("Ticker Already Added.");
            setInput("");
            return;
        }

        const removeTicker = () => {
            const trimticker = input.trim().toUpperCase();
            if (tickerlist.some((s) => s.ticker === trimticker)) {
                setTickerList((prev) => prev.filter(x => x.ticker !== trimticker));
                setInput("");
                return;
            }
            alert("Not In Watchlist")
            setInput("");
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
                        <button className="bg-buttonblue hover:bg-buttonhoverblue text-white px-4 py-2 rounded-xl font-semibold transition" type="button" onClick={removeTicker}>Remove</button> 
                    </form>
                </div>

                {/* Disclaimer */}
                <div className='w-full h-6 flex justify-center'>
                    <p className="text-xs text-white">
                        Disclaimer: The following predictions are for informational purposes only. Please conduct your own research and make investment decisions responsibly.
                    </p>
                </div>

                {/* Table */}
                <div className="w-full flex justify-center">
                    <table className="table-auto border-separate border-spacing-y-2">
                        <thead>
                            <tr className="text-gray-400">
                                <th scope="col" className="px-25 py-3 border-b">Ticker</th>
                                <th scope="col" className="px-25 py-3 border-b">Predicted Next-Day Closing Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickerlist.map(({ticker, predictedclosing}) => (
                                <tr key={ticker} className="text-gray-400">
                                    <td className="px-25 py-3 border-t border-b">{ticker}</td>
                                    <td className="px-25 py-5 border-t border-b">{predictedclosing}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        )
}