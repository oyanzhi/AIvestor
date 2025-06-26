    import { useState } from 'react';
    import { useRouter } from "next/navigation";

    export default function StockWatchList() {
        const router = useRouter();

        const [tickerlist, setTickerList] = useState<string[]>([]);
        const [input, setInput] = useState("");

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInput(e.target.value);
        };

        const addTicker = () => {
            const trimticker = input.trim();
            if (!tickerlist.includes(trimticker)) {
                setTickerList((prev) => [...prev, trimticker]);
                setInput("");
            }
        }

        const removeTicker = () => {
            const trimticker = input.trim();
            if (tickerlist.includes(trimticker)) {
                setTickerList((prev) => prev.filter(x => x !== trimticker));
                setInput("");
            }
        }

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            if (input.length === 0) {
                alert("Input is Empty")
                return;
            }
            addTicker();
        }

        return (
            <div className="w-full min-h-screen mt-16">
                {/* SearchBar */}
                <div className="flex justify-center items-center h-16">
                    <form onSubmit={handleSubmit} className="flex items-center space-x-4">
                        <input placeholder="Enter Ticker" required value={input} name="ticker" className="w-64 px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none" type="text" onChange={handleChange} />
                        <button className="bg-buttonblue hover:bg-buttonhoverblue text-white px-4 py-2 rounded-xl font-semibold transition" type="submit" onClick={addTicker} >Add</button>
                        <button className="bg-buttonblue hover:bg-buttonhoverblue text-white px-4 py-2 rounded-xl font-semibold transition" onClick={removeTicker}>Remove</button> 
                    </form>
                </div>

                {/* Table */}
                <div className="w-full flex justify-center">
                    <table className="divide-y divide-gray-600 border-spacing-x-5 border-spacing-y-2">
                        <thead>
                            <tr className="text-gray-400">
                                <th scope="col" className="px-6 py-3">Ticker</th>
                                <th scope="col">Predicted Next-Day Closing Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>test</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        )
}