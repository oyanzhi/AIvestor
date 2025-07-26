import { useEffect, useState } from "react";
import LoadingIndicator from "./loadingIndicator";
import MetricSection from "./metricSection";
import HistoricalChart from "./historicalChart";

type StockInfo = {
    name: string;
    ticker: string;
    sector: string;
    industry: string;

    current_price: number;
    previous_close: number;
    market_cap: string;

    pe_ratio: number;
    forward_pe: number;
    peg_ratio: number;
    pb_ratio: number;
    price_to_sales: number;
    dcf_intrinsic_value: number;
    valuation: string;

    roe: number;
    roa: number;
    gross_margin: number;
    operating_margin: number;
    net_margin: number;

    earnings_growth: number;
    revenue_growth: number;
    free_cash_flow_growth: number;

    beta: number;
    volatility: number;
    debt_to_asset_ratio: number;
    risk_level: string;

    free_cash_flow: number;
    operating_cash_flow: number;
    capital_expenditures: number;
    cash: number;
    total_debt: number;

    shares_outstanding: number;
    float_shares: number;
    shares_short: number;
    short_ratio: number;
};

export default function StockDisplay({ token }: {token: string| null}) {
    const [stock, setStock] = useState<StockInfo | null>(null);
    const [name, setName] = useState("");
    const [ticker, setTicker] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [historyData, setHistoryData] = useState<{ date: string; close: number }[]>([]);

    if (!token) return;

    const handleSearch = async () => {
        setError(null);
        setStock(null);

        if (!token) {
            alert("You're not loggined in. Feature Only Available on Login.");
            return;
        }

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

        setLoading(true);

        try {
            const res = await fetch(`https://aivestor-wnxv.onrender.com/stocks/getstock?symbol=${encodeURIComponent(resolvedTicker)}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!res.ok) throw new Error("Failed to fetch stock data");
            const data = await res.json();

            setName("");
            setTicker("");
            setStock(data);
            
            // Fetch historical data for the chart
            try {
                const histRes = await fetch(`https://aivestor-wnxv.onrender.com/stocks/gethistory?symbol=${encodeURIComponent(resolvedTicker)}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!histRes.ok) throw new Error("Failed to fetch historical data");
                const histData = await histRes.json();
                setHistoryData(histData.historyData);  // e.g. [{ date: "2024-01-01", close: 180.25 }, ...]
            } catch (histErr) {
                console.error("Error fetching history data", histErr);
                setHistoryData([]); // fallback to empty
            }

            alert("Stock search successfull!")
        } catch (e) {
            setError(e instanceof Error ? e.message : "An unknown error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const getSymbolFromName = async (stockName: string): Promise<string | null> => {
        const res = await fetch(`https://aivestor-wnxv.onrender.com/portfolio/search-symbol?name=${encodeURIComponent(stockName)}`);
        if (!res.ok) return null;
        const result = await res.json();

        if (!result.symbol) {
            alert("No symbol found. Try being more specific.");
            return null;
        }
        return result.symbol || null;
    };

    const getNameFromTicker = async (stockSymbol: string): Promise<string | null> => {
        const res = await fetch(`https://aivestor-wnxv.onrender.com/portfolio/search-name?symbol=${encodeURIComponent(stockSymbol)}`);
        if (!res.ok) return null;
        const result = await res.json();
        return result.name || null;
    };

    return (
        <div className="w-full min-h-screen mt-16 px-6">
        {/* Form */}
        <div className="flex justify-center items-center mb-6 mt-3">
            <form
                onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                className="flex flex-wrap gap-4 items-end"
            >
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Stock Name" className="p-2 rounded bg-gray-800 text-white w-40" /> 
                <input value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="Symbol" className="p-2 rounded bg-gray-800 text-white w-28" />
                <button type="submit" className="bg-buttonblue hover:bg-buttonhoverblue text-white px-4 py-2 rounded-xl font-semibold transition">{loading ? <LoadingIndicator text="Searching..." /> : "Search"}</button>
            </form>
        </div>

        {stock && (
                <div className="p-6 space-y-8">
                    <div className="bg-white text-black p-4 rounded-xl shadow">
                        <h1 className="text-2xl font-bold">{stock.name} ({stock.ticker})</h1>
                        <p className="text-sm text-gray-500">{stock.sector} / {stock.industry}</p>
                        <p className="text-xl mt-2">
                            ${stock.current_price !== undefined ? Number(stock.current_price).toFixed(2) : "N/A"}
                            <span className="text-sm text-gray-500">
                                (Prev Close: {stock.previous_close !== undefined ? `$${Number(stock.previous_close).toFixed(2)}` : "N/A"})
                            </span>
                        </p>
                        <p className="text-sm text-gray-600">Market Cap: {stock.market_cap}</p>
                        <p className="text-sm text-gray-600">52W High/Low: TBD</p>
                        <p className="text-sm text-gray-600">Dividend Yield: TBD</p>
                    </div>

                    <HistoricalChart data={historyData} />

                    <MetricSection title="Valuation" metrics={{
                        "PE Ratio": stock.pe_ratio,
                        "Forward PE": stock.forward_pe,
                        "PEG Ratio": stock.peg_ratio,
                        "PB Ratio": stock.pb_ratio,
                        "Price to Sales": stock.price_to_sales,
                        "DCF Value": stock.dcf_intrinsic_value,
                        "Valuation Label": stock.valuation,
                    }} />

                    <MetricSection title="Profitability" metrics={{
                        "ROE": stock.roe,
                        "ROA": stock.roa,
                        "Gross Margin": stock.gross_margin,
                        "Operating Margin": stock.operating_margin,
                        "Net Margin": stock.net_margin,
                    }} />

                    <MetricSection title="Growth" metrics={{
                        "Earnings Growth": stock.earnings_growth,
                        "Revenue Growth": stock.revenue_growth,
                        "Free Cash Flow Growth": stock.free_cash_flow_growth,
                    }} />

                    <MetricSection title="Risk" metrics={{
                        "Beta": stock.beta,
                        "Volatility": stock.volatility,
                        "Debt/Asset Ratio": stock.debt_to_asset_ratio,
                        "Risk Level": stock.risk_level,
                    }} />

                    <MetricSection title="Cash Flow" metrics={{
                        "Free Cash Flow": stock.free_cash_flow,
                        "Operating Cash Flow": stock.operating_cash_flow,
                        "CapEx": stock.capital_expenditures,
                        "Cash on Hand": stock.cash,
                        "Total Debt": stock.total_debt,
                    }} />

                    <MetricSection title="Shares Info" metrics={{
                        "Shares Outstanding": stock.shares_outstanding,
                        "Float Shares": stock.float_shares,
                        "Short Interest": stock.shares_short,
                        "Short Ratio": stock.short_ratio,
                    }} />
                </div>
            )}
        </div>
    );
}