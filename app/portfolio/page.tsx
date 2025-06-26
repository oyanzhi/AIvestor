import React, { useState, useEffect } from "react";
import MainNavBar from '../../components/sidebar/mainnavbar';
import Footer from '../../components/sidebar/footer';

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    // to be replaced with the actual API call
    const fetchHoldings = async () => {
      const response = await fetch("http://localhost:8000/api/portfolio/", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setHoldings(data);
    };
    fetchHoldings();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-deepblue text-white">
      <MainNavBar />

      <main className="flex-grow p-8">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">Your Portfolio</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-bluebox rounded-2xl">
            <thead>
              <tr className="text-left text-cyan-300">
                <th className="py-2 px-4">Stock</th>
                <th className="py-2 px-4">Shares</th>
                <th className="py-2 px-4">Buy Price</th>
                <th className="py-2 px-4">Current Price</th>
                <th className="py-2 px-4">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((stock, index) => (
                <tr key={index} className="border-t border-[#1a1a3d]">
                  <td className="py-2 px-4">stock.symbol</td>
                  <td className="py-2 px-4">stock.shares</td>
                  <td className="py-2 px-4">$stock.buy_price.toFixed(2)</td>
                  <td className="py-2 px-4">$stock.current_price.toFixed(2)</td>
                  <td className="py-2 px-4">
                    <span
                      className={
                        //stock.risk_score 
                            50 > 70
                          ? "text-red-400"
                          :  50 > 40  //stock.risk_score
                          ? "text-yellow-400"
                          : "text-green-400"
                      }
                    >
                      stock.risk_score%
                    </span>
                  </td>
                </tr>
              ))}
              {holdings.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 px-4 text-center text-gray-400">
                    No holdings found. Add stocks to your portfolio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
