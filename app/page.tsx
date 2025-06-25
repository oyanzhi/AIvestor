import LoginNavBar from "../components/sidebar/loginnavbar";
import Link from "next/link";
import Footer from "../components/sidebar/footer";
import { FC, SVGProps } from "react";

import {
    CpuChipIcon,
    AdjustmentsHorizontalIcon,
    BellAlertIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';

interface featureObj {
    icon: FC<SVGProps<SVGSVGElement>>;
    title: string;
    description: string;
}

const features: featureObj[] = [
    {
        icon: CpuChipIcon,
        title: "AI Stock Analysis",
        description: "Predict trends & analyze stocks using our models.",
    },
    {
        icon: AdjustmentsHorizontalIcon,
        title: "Personalized Insights",
        description: "Recommendations tailored to your goals & risk appetite.",
    },
    {
        icon: BellAlertIcon,
        title: "Real-Time Alerts",
        description: "Get notified of price shifts and breaking market news.",
    },
    {
        icon: ChartBarIcon,
        title: "Risk Monitoring",
        description: "Track your portfolio risk in real-time with AI insights.",
    },
];

function LandingPage() {
    return (
        <div>
            {/* LogInsideBar */}
            <LoginNavBar/>

            {/* Introduction Section */}
            <section className="flex flex-col items-center justify-center bg-deepblue min-h-screen pt-20">
                <div className="flex flex-col items-center w-2/3 p-4 pb-16 text-center">
                    <h1
                        className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white"
                    >
                        AI-Powered Investment Intelligence
                    </h1>
                    <p className="text-lg text-gray-300 mb-8">
                        Your personal AI investment assistant.
                    </p>

                    <video controls className="w-full rounded-lg shadow-lg">
                        <source src="/introductionvideo.mp4" type="video/mp4" />
                    </video>
                </div>
            </section>

            {/* Hero Section */}
            <section className="bg-[#222254] py-20 px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                    Invest Smarter with <span className="text-cyan-400">AIvestor</span>
                </h1>
                <p className="text-lg md:text-xl mb-8 text-white">
                    AI-powered stock insights and personalized investment strategies for everyone.
                </p>
                <Link href="/register" className="bg-buttonblue text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-buttonhoverblue transition">
                    Get Started
                </Link>
            </section>



            {/* Features Section */}
            <section className="py-16 px-6 bg-deepblue">
                <h2 className="text-3xl font-bold text-center text-white mb-12">Key Features</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    {features.map((feature, index) => (
                        <div key={index} className="p-6 bg-bluebox rounded-2xl shadow-lg">
                            <feature.icon className="h-8 w-8 mx-auto mb-3 text-cyan-400" />
                            <h3 className="text-xl font-semibold mb-2 text-cyan-400">{feature.title}</h3>
                            <p className="text-white">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>



            {/* How It Works Section */}
            <section className="bg-[#2a2a55] py-16 px-6">
                <h2 className="text-3xl font-bold text-center text-white mb-12">How It Works</h2>

                <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
                    {[
                        {
                            title: "1. Create Your Profile",
                            description: "Set your investment goals and risk tolerance.",
                        },
                        {
                            title: "2. Add Your Portfolio",
                            description: "Input your stock holdings easily.",
                        },
                        {
                            title: "3. Get AI Recommendations",
                            description: "Receive smart insights tailored to your goals.",
                        },
                        {
                            title: "4. Improve Over Time",
                            description: "Use AIvestor’s tools to grow your investment strategy.",
                        },
                    ].map((step, index) => (
                        <div key={index} className="bg-bluebox p-6 rounded-xl shadow-lg">
                            <h4 className="text-xl font-semibold mb-2 text-cyan-400">{step.title}</h4>
                            <p className="text-white">{step.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-deepblue py-16 px-6 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to invest smarter with AI?</h2>
                <p className="mb-8 text-lg">Join AIvestor and start making informed decisions today.</p>
                <Link href="/register" className="bg-buttonblue px-6 py-3 rounded-xl font-semibold hover:bg-buttonhoverblue">
                    Create Your Free Account
                </Link>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default LandingPage;