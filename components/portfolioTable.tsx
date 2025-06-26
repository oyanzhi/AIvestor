import { useState } from "react";

type PortfolioStock = {
  name: string;
  symbol: string;
  shares: number;
  boughtPrice: number;
  currentPrice: number;
  valuation: number;
  riskLevel: "Low" | "Medium" | "High";
};

export default function PortfolioTable() {
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([]);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState<number>(0);
  const [boughtPrice, setBoughtPrice] = useState<number>(0);

  const fetchCurrentPrice = async (symbol: string): Promise<number | null> => {
    try {
      const response = await fetch("https://aivestor-wnxv.onrender.com/stockmodelrequest/predictstocklist/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickersymbol: [symbol] }),
      });
      if (!response.ok) return null;
      const result = await response.json();
      return result[symbol] ?? null;
    } catch {
      return null;
    }
  };

  const determineRiskLevel = (bought: number, current: number): "Low" | "Medium" | "High" => {
    const drop = ((bought - current) / bought) * 100;
    if (drop > 20) return "High";
    if (drop > 10) return "Medium";
    return "Low";
  };

  const handleAdd = async () => {
    const trimmed = symbol.trim().toUpperCase();
    if (portfolio.some((s) => s.symbol === trimmed)) {
      alert("Stock already in portfolio.");
      return;
    }
    const current = await fetchCurrentPrice(trimmed);
    if (current === null) {
      alert("Failed to fetch current price.");
      return;
    }
    const valuation = current * shares;
    const risk = determineRiskLevel(boughtPrice, current);
    const newStock: PortfolioStock = {
      name,
      symbol: trimmed,
      shares,
      boughtPrice,
      currentPrice: current,
      valuation,
      riskLevel: risk,
    };
    setPortfolio((prev) => [...prev, newStock]);
    setName(""); setSymbol(""); setShares(0); setBoughtPrice(0);
  };

  const handleRemove = () => {
    const trimmed = symbol.trim().toUpperCase();
    if (!portfolio.some((s) => s.symbol === trimmed)) {
      alert("Stock not found.");
      return;
    }
    setPortfolio((prev) => prev.filter((s) => s.symbol !== trimmed));
    setName(""); setSymbol(""); setShares(0); setBoughtPrice(0);
  };

  return (
    <div className="w-full min-h-screen mt-16 px-6">
      {/* Form */}
      <div className="mb-6">
        <form
          onSubmit={(e) => { e.preventDefault(); handleAdd(); }}
          className="flex flex-wrap gap-4 items-end"
        >
          <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Stock Name" className="p-2 rounded bg-gray-800 text-white w-40" />
          <input value={symbol} onChange={(e) => setSymbol(e.target.value)} required placeholder="Symbol" className="p-2 rounded bg-gray-800 text-white w-28" />
          <input type="number" value={shares} onChange={(e) => setShares(Number(e.target.value))} required placeholder="Shares" className="p-2 rounded bg-gray-800 text-white w-24" />
          <input type="number" step="0.01" value={boughtPrice} onChange={(e) => setBoughtPrice(Number(e.target.value))} required placeholder="Bought Price" className="p-2 rounded bg-gray-800 text-white w-32" />
          <button type="submit" className="bg-buttonblue hover:bg-buttonhoverblue text-white px-4 py-2 rounded-xl">Add</button>
          <button type="button" onClick={handleRemove} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl">Remove</button>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
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
              <tr key={stock.symbol} className="text-white border-t border-gray-600">
                <td className="px-4 py-2">{stock.name}</td>
                <td className="px-4 py-2">{stock.symbol}</td>
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
