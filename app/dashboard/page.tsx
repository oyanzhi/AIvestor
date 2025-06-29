'use client';

import MainNavBar from '../../components/sidebar/mainnavbar';
import Footer from '../../components/sidebar/footer';

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
    <div className="flex flex-col min-h-screen bg-deepblue">
      {/* Top Navbar */}
      <MainNavBar />

      {/* Main Content */}
      <main className="flex-1 px-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
          Welcome to your Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {[
            {
              title: '📊 Portfolio Overview',
              desc: 'Track your holdings and risk profile here.',
            },
            {
              title: '🧠 AI Recommendations',
              desc: 'Latest stock picks just for you.',
            },
            {
              title: '⚠️ Alerts',
              desc: 'Notifications based on your market triggers.',
            },
            {
              title: '🧾 Risk Assessment',
              desc: 'Real-time monitoring of your portfolio risk.',
            },
            {
              title: '💬 Community Forum',
              desc: 'Discuss strategies and ideas with others.',
            },
            {
              title: '📄 Financial Reports',
              desc: 'Download your detailed investment reports.',
            },
          ].map((card, index) => (
            <div key={index} className="bg-bluebox p-4 rounded-2xl shadow-lg">
              <h2 className="text-xl text-cyan-400 mb-2">{card.title}</h2>
              <p className="text-white text-sm">{card.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DashboardPage;
