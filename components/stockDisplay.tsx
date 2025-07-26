import { useEffect, useState } from "react";
import LoadingIndicator from "./loadingIndicator";
import MetricSection from "./metricSection";
import HistoricalChart from "./historicalChart";

type StockInfo = {
    name: string;
    ticker: string;
    sector: string;
    industry: string;
    dividend_yield: number;

    current_price: number;
    previous_close: number;
    predicted_closing_price: number;
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
    const [chartLoading, setChartLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [historyData, setHistoryData] = useState<{ date: string; close: number }[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState("6mo");

    const availablePeriods = [
        { label: "1D", value: "1d" },
        { label: "5D", value: "5d" },
        { label: "1M", value: "1mo" },
        { label: "6M", value: "6mo" },
        { label: "1Y", value: "1y" },
        { label: "5Y", value: "5y" },
        { label: "MAX", value: "max" }
    ];


    if (!token) return;

    const handleSearch = async () => {
        setError(null);
        setStock(null);
        setLoading(true);

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
            await fetchHistoricalData(resolvedTicker, selectedPeriod);
            alert("Stock search successfull!")
        } catch (e) {
            setError(e instanceof Error ? e.message : "An unknown error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const fetchHistoricalData = async (ticker: string, period: string) => {
        if (!token || !ticker) return;

        setSelectedPeriod(period);
        setHistoryData([]);
        setChartLoading(true);

        let actualPeriod = period;
        let interval = "1d"; // default

        if (period === "1d") interval = "1m";
        if (period === "5d") interval = "5m";

        try {
            const res = await fetch(`https://aivestor-wnxv.onrender.com/stocks/gethistory?symbol=${ticker}&period=${actualPeriod}&interval=${interval}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
            });
            const data = await res.json();
            setHistoryData(data.historyData || []);
        } catch (err) {
            console.error("Historical fetch failed", err);
        } finally{
            setChartLoading(false);
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
        <div className="w-full min-h-screen pt-24 px-4 sm:px-8">
        {/* Form */}
        <div className="flex justify-center mb-10 ">
            <form
                onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                className="flex flex-wrap gap-4 items-center bg-gray-800 p-4 rounded-xl shadow-md"
            >
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Stock Name" className="p-2 rounded bg-gray-900 text-white w-40 placeholder-gray-400 border border-gray-700" /> 
                <input value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="Symbol" className="p-2 rounded bg-gray-900 text-white w-28 placeholder-gray-400 border border-gray-700" />
                <button type="submit" className="bg-buttonblue hover:bg-buttonhoverblue text-white px-4 py-2 rounded-xl font-semibold transition">{loading ? <LoadingIndicator text="Searching..." /> : "Search"}</button>
            </form>
        </div>

        {stock && (
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="bg-gray-800  text-white p-6 rounded-xl shadow-md space-y-2">
                        <h1 className="text-2xl font-bold tracking-wide">{stock.name} ({stock.ticker})</h1>
                        <p className="text-sm text-gray-400">{stock.sector} / {stock.industry}</p>
                        <p className="flex items-center text-3xl mt-2 font-semibold">
                            ${stock.current_price !== undefined ? Number(stock.current_price).toFixed(2) : "N/A"}

                            {stock.current_price !== undefined && stock.previous_close !== undefined && (() => {
                                const change = stock.current_price - stock.previous_close;
                                const changePercent = (change / stock.previous_close) * 100;
                                const isPositive = change > 0;

                                return (
                                    <span className={`ml-0.5 text-sm font-medium ${isPositive ? "text-green-400" : "text-red-400"} flex items-center`}>
                                    {isPositive ? "▲" : "▼"} {Math.abs(change).toFixed(2)} ({Math.abs(changePercent).toFixed(2)}%)
                                    </span>
                                );
                            })()}

                            <span className="text-sm text-gray-400 ml-2">
                                (Prev Close: {stock.previous_close !== undefined ? `$${Number(stock.previous_close).toFixed(2)}` : "N/A"})
                            </span>

                            {stock.predicted_closing_price !== undefined && stock.current_price !== undefined && (
                                (() => {
                                    const predicted = Number(stock.predicted_closing_price);
                                    const current = Number(stock.current_price);
                                    const change = predicted - current;
                                    const percentChange = (change / current) * 100;
                                    const isUp = change > 0;
                                    const isDown = change < 0;

                                    const colorClass = isUp
                                        ? "text-green-400"
                                        : isDown
                                        ? "text-red-400"
                                        : "text-yellow-300";

                                    const arrow = isUp ? "▲" : isDown ? "▼" : "●";

                                    return (
                                        <p className={`ml-2 text-lg mt-1 ${colorClass} flex items-center gap-1`}>
                                            Predicted Next-Day Close:{" "}
                                            <strong>${predicted.toFixed(2)}</strong>
                                            <span className="text-xs font-medium">
                                                {arrow} {Math.abs(change).toFixed(2)} ({Math.abs(percentChange).toFixed(2)}%)
                                            </span>
                                        </p>
                                    );
                                })()
                            )}
                        </p>
                        <div className="flex flex-wrap gap-6 text-sm text-gray-300 mt-4">
                            <span>Market Cap: <strong>{stock.market_cap}</strong></span>
                            <span>52W High/Low: <strong>TBD</strong></span>
                            <span>Dividend Yield: <strong>{stock.dividend_yield !== undefined ? `$${Number(stock.dividend_yield).toFixed(2)}` : "N/A"}</strong></span>
                            <span className="text-gray-300">
                                Valuation:{" "}
                                <span className={`${stock.valuation === "Overvalued" ? "text-red-500" : stock.valuation === "Fairly valued" ? "text-yellow-400" : "text-green-400"}`}>
                                    {stock.valuation}
                                </span>
                            </span>
                            
                            <span className="text-gray-300">
                                Risk Level:{" "}
                                <span className={`${stock.risk_level === "High" ? "text-red-500" : stock.risk_level === "Medium" ? "text-yellow-400" : "text-green-400"}`}>
                                    {stock.risk_level}
                                </span>
                            </span>
                            
                        </div>    
                    </div>

                    <div className="flex gap-2 mb-4">
                        {availablePeriods.map((p) => (
                            <button
                                key={p.value}
                                onClick={() => fetchHistoricalData(stock?.ticker ?? "", p.value)}
                                className={`px-3 py-1 rounded text-sm font-medium ${
                                    selectedPeriod === p.value
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {chartLoading ? (
                        <div className="bg-gray-800 p-6 rounded-2xl shadow-md w-full max-w-4xl flex justify-center items-center h-[300px]">
                            <span className="text-gray-400 text-sm animate-pulse">Loading chart...</span>
                        </div>
                    ) : (
                        <HistoricalChart data={historyData} />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-15">
                        <MetricSection title="Valuation" metrics={{
                            "PE Ratio": stock.pe_ratio,
                            "Forward PE": stock.forward_pe,
                            "PEG Ratio": stock.peg_ratio,
                            "PB Ratio": stock.pb_ratio,
                            "Price to Sales": stock.price_to_sales,
                            "DCF Value": stock.dcf_intrinsic_value,
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
                </div>
            )}
        </div>
    );
}