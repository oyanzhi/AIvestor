import { useEffect, useState } from "react";
import LoadingIndicator from "./loadingIndicator";

type PortfolioStock = {
  name: string;
  ticker: string;
  shares: number;
  boughtPrice: number;
  currentPrice: number;
  valuation: number;
  riskLevel: "Low" | "Medium" | "High";
};

export default function PortfolioTable() {
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([]);
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [shares, setShares] = useState<number>(0);
  const [boughtPrice, setBoughtPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch portfolio and populate table when loaded
  useEffect(() => {
    async function fetchPortfolio() {
      setLoading(true);
      try {
        const response = await fetch("https://aivestor-wnxv.onrender.com/portfolio/populate", {
          method: "GET",
          headers: {
            // "Authorization": `Token ${token}`,
            // "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to load portfolio");
        }

        const data: PortfolioStock[] = await response.json();
        setPortfolio(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, []);

 // You will need to implement these on backend or mock them for now
  const getSymbolFromName = async (stockName: string): Promise<string | null> => {
    // Call your backend endpoint to search symbol by name
    // For example:
    const res = await fetch(`https://aivestor-wnxv.onrender.com/search-symbol?name=${encodeURIComponent(stockName)}`);
    if (!res.ok) return null;
    const result = await res.json();
    if (result.count > 1) {
      alert("Multiple stocks found. Please be more specific.");
      return null;
    }
    return result.symbol || null;
  };

  const getNameFromTicker = async (stockSymbol: string): Promise<string | null> => {
    // Call your backend to get stock name from symbol
    const res = await fetch(`https://aivestor-wnxv.onrender.com/search-name?symbol=${encodeURIComponent(stockSymbol)}`);
    if (!res.ok) return null;
    const result = await res.json();
    return result.name || null;
  };

  const handleAdd = async () => {
    setError(null);

    if (!name && !ticker) {
      alert("Please enter either a stock name or ticker symbol.");
      return;
    }

    let resolvedTicker = ticker.trim().toUpperCase();
    let resolvedName = name.trim();

     // User entered stock name only
    if (name && !ticker) {
      const tickerFromName = await getSymbolFromName(resolvedName);
      if (!tickerFromName) {
        alert("Could not find a symbol for this stock name.");
        return;
      }
      resolvedTicker = tickerFromName.trim().toUpperCase();
    }

    // User enter stock ticker only
    if (!name && ticker) {
      const nameFromTicker = await getNameFromTicker(resolvedTicker);
      if (!nameFromTicker) {
        alert("Could not find a stock name for this symbol.");
        return;
      }
      resolvedName = nameFromTicker.trim();
    }

    // Prevent duplicates
    if (portfolio.some((s) => s.ticker === resolvedTicker)) {
      alert("Stock already in portfolio.");
      return;
    }

    setLoading(true);

    try {
      // Send add request to backend
      const response = await fetch("https://aivestor-wnxv.onrender.com/portfolio/addstock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // if needed for auth
        body: JSON.stringify({
          ticker: resolvedTicker,
          shares,
          bought_price: boughtPrice,
        }),
      });
      if (!response.ok) throw new Error("Failed to add stock");

      // Backend returns updated holding or full portfolio - update state accordingly
      const addedStock: PortfolioStock = await response.json();
      setPortfolio((prev) => [...prev, addedStock]);

      // Clear form
      setName("");
      setTicker("");
      setShares(0);
      setBoughtPrice(0);
      alert("Stock added successfully!")
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const handleRemove =  async () => {
    setError(null);

    if (!portfolio.some((s) => s.ticker === ticker)) {
      alert("Stock not found.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://aivestor-wnxv.onrender.com/portfolio/${ticker}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to remove stock");

      setPortfolio((prev) => prev.filter((s) => s.ticker !== ticker));

      setName("");
      setTicker("");
      setShares(0);
      setBoughtPrice(0);
      alert("Stock removed successfully!")
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full min-h-screen mt-16 px-6">
      
      {/* Form */}
      <div className="flex justify-center items-center mb-6 mt-3">
        <form
          onSubmit={(e) => { e.preventDefault(); handleAdd(); }}
          className="flex flex-wrap gap-4 items-end"
        >
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Stock Name" className="p-2 rounded bg-gray-800 text-white w-40" />
          <input value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="Symbol" className="p-2 rounded bg-gray-800 text-white w-28" />
          <input type="number" value={shares} onChange={(e) => setShares(Number(e.target.value))} required placeholder="Shares" className="p-2 rounded bg-gray-800 text-white w-24" />
          <input type="number" step="0.01" value={boughtPrice} onChange={(e) => setBoughtPrice(Number(e.target.value))} required placeholder="Bought Price" className="p-2 rounded bg-gray-800 text-white w-32" />
          <button type="submit" className="bg-buttonblue hover:bg-buttonhoverblue text-white px-4 py-2 rounded-xl font-semibold transition">{loading ? <LoadingIndicator text="Adding..." /> : "Add"}</button>
          <button type="button" onClick={handleRemove} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold transition">{loading ? <LoadingIndicator text="Removing..." /> : "Remove"}</button>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="table-auto w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-400 text-left">
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Symbol</th>
              <th className="px-4 py-2 border-b">Shares</th>
              <th className="px-4 py-2 border-b">Bought Price</th>
              <th className="px-4 py-2 border-b">Current Price</th>
              <th className="px-4 py-2 border-b">Valuation</th>
              <th className="px-4 py-2 border-b">Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((stock) => (
              <tr key={stock.ticker} className="text-white border-t border-gray-600">
                <td className="px-4 py-2">{stock.name}</td>
                <td className="px-4 py-2">{stock.ticker}</td>
                <td className="px-4 py-2">{stock.shares}</td>
                <td className="px-4 py-2">${stock.boughtPrice.toFixed(2)}</td>
                <td className="px-4 py-2">${stock.currentPrice.toFixed(2)}</td>
                <td className="px-4 py-2">${stock.valuation.toFixed(2)}</td>
                <td className={`px-4 py-2 font-semibold ${stock.riskLevel === "High" ? "text-red-500" : stock.riskLevel === "Medium" ? "text-yellow-400" : "text-green-400"}`}>
                  {stock.riskLevel}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}