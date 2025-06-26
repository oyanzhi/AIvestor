'use client';

import MainSidebar from '../../components/sidebar/mainnavbar';
import Footer from '../../components/sidebar/footer';
import Link from "next/link";

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";

function DashboardPage() {
const router = useRouter();
    const [authCheck, setAuthCheck] = useState(false);

    useEffect(() => {
        const authToken = sessionStorage.getItem("token");
        if (!authToken) {
            router.replace("/login");
        } else {
            setAuthCheck(true);
        }
    }, [router]);

    if (!authCheck) {
        return; //empty waiting - maybe can add a temp
    }

    const hidden: string[] = [];

    return (
    <div className="flex flex-col min-h-screen bg-deepblue text-white">
      {/* Header */}
      <header className="bg-bluebox p-6 shadow-md">
        <h1 className="text-3xl font-bold text-cyan-400">Welcome back to AIvestor</h1>
        <p className="text-gray-300 mt-1">Your smart investing companion</p>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-grow p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Overview */}
        <div className="bg-bluebox p-6 rounded-2xl shadow-lg col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-cyan-300">Portfolio Summary</h2>
          <p>Total Invested: <span className="text-green-400">$10,500</span></p>
          <p>Portfolio Risk Level: <span className="text-yellow-400">Moderate (67%)</span></p>
          <Link href="/portfolio" className="text-cyan-400 hover:underline mt-2 inline-block">View Portfolio Details →</Link>
        </div>

        {/* Alerts Preview */}
        <div className="bg-bluebox p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-cyan-300">Recent Alerts</h2>
          <ul className="space-y-2 text-sm">
            <li className="text-red-400">📉 TSLA dropped by 8% today</li>
            <li className="text-green-400">📈 AAPL rose 4% above your target</li>
            <li className="text-yellow-300">⚠️ Your alert condition was triggered</li>
          </ul>
          <Link href="/alerts" className="text-cyan-400 hover:underline mt-2 inline-block">Manage Alerts →</Link>
        </div>

        {/* AI Recommendations */}
        <div className="bg-bluebox p-6 rounded-2xl shadow-lg col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-cyan-300">AI Recommendations</h2>
          <p className="mb-2">📊 Based on your risk profile, we suggest:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Increase holdings in MSFT</li>
            <li>Watch GOOGL closely over the next week</li>
            <li>Reduce exposure to volatile assets</li>
          </ul>
          <Link href="/insights" className="text-cyan-400 hover:underline mt-2 inline-block">See Full AI Insights →</Link>
        </div>

        {/* Quick Links */}
        <div className="bg-bluebox p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-cyan-300">Quick Access</h2>
          <div className="space-y-3">
            <Link href="/stockinput" className="block text-cyan-400 hover:underline">+ Add Stock Holdings</Link>
            <Link href="/profile" className="block text-cyan-400 hover:underline">Edit Profile & Alerts</Link>
            <Link href="/forum" className="block text-cyan-400 hover:underline">Visit Investment Forum</Link>
            <Link href="/exportdata" className="block text-cyan-400 hover:underline">Download Reports</Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default DashboardPage;
