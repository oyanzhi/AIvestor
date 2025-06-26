    import { useState } from 'react';
    import { useRouter } from "next/navigation";

    export default function StockSearchBar() {
        const router = useRouter();

        const [tickerlist, setTickerList] = useState<string[]>([]);
        const [input, setInput] = useState("");

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInput(e.target.value);
        };

        const addTicker = () => {
            const trimticker = input.trim();
            if (!tickerlist.includes(trimticker)) {
                setTickerList((prev) => [...prev, trimticker])
            }
        }

        const removeTicker = () => {
            const trimticker = input.trim();
            if (tickerlist.includes(trimticker)) {
                setTickerList((prev) => prev.filter(x => x !== trimticker));
            }
        }

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            if (input.length === 0) {
                alert("Input is Empty")
                return;
            }
        }

        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900">
                <form onSubmit={handleSubmit} className="flex items-center space-x-4">
                    <input placeholder="Enter Ticker" required value={input} name="ticker" className="w-64 px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none" type="text" onChange={handleChange} />
                    <button className="bg-buttonblue hover:bg-buttonhoverblue text-white px-4 py-2 rounded-xl font-semibold transition" type="submit">Add</button>
                    <button className="bg-buttonblue hover:bg-buttonhoverblue text-white px-4 py-2 rounded-xl font-semibold transition" type="submit">Remove</button> 
                </form>
            </div>
        )
}