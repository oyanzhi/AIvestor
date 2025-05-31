import "../pagecss/common.css";
import "../pagecss/landingpage.css";
import "../componentscss/buttoncontainercss/navigationbuttons.css";
import LogInsideBar from "../sidebar/loginsidebar.js";
import { CenterLoginButton } from "../components/buttons.js";
import IntroductionVideo from "../components/video.js";

function LandingPage() {
    return (
        <div>
            <div><LogInsideBar /></div>

            <section id="introsection">
                <div className="lefttext-container">
                    <div id="lefttext">
                        <h1 id="welcome">AI-Powered Investment Intelligence</h1>
                        <p id="description">
                            Smart portfolio guidance tailored to your risk profile. Harness the power of machine learning for smarter investments.
                        </p>
                    </div>

                    <div><CenterLoginButton /></div>
                </div>

                <div className="rightpicture-container">
                    <IntroductionVideo />
                </div>
            </section>
            <div className="min-h-screen bg-white text-gray-900">
                {/* Hero Section */}
                <section className="bg-blue-50 py-20 px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Invest Smarter with <span className="text-blue-600">AIvestor</span>
                    </h1>
                    <p className="text-lg md:text-xl mb-8">
                        AI-powered stock insights and personalized investment strategies for everyone.
                    </p>
                    <a href="/signup" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-blue-700 transition">
                        Get Started
                    </a>
                </section>

                {/* Features Section */}
                <section className="py-16 px-6 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div className="p-6 bg-gray-100 rounded-2xl shadow">
                            <h3 className="text-xl font-semibold mb-2">🧠 AI Stock Analysis</h3>
                            <p>Predict trends & analyze stocks using advanced models.</p>
                        </div>
                        <div className="p-6 bg-gray-100 rounded-2xl shadow">
                            <h3 className="text-xl font-semibold mb-2">🎯 Personalized Insights</h3>
                            <p>Recommendations tailored to your goals & risk appetite.</p>
                        </div>
                        <div className="p-6 bg-gray-100 rounded-2xl shadow">
                            <h3 className="text-xl font-semibold mb-2">⚠️ Real-Time Alerts</h3>
                            <p>Get notified of price shifts and breaking market news.</p>
                        </div>
                        <div className="p-6 bg-gray-100 rounded-2xl shadow">
                            <h3 className="text-xl font-semibold mb-2">🧾 Risk Monitoring</h3>
                            <p>Track your portfolio risk in real-time with AI insights.</p>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="bg-gray-50 py-16 px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                    <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
                        <div className="bg-white p-6 rounded-xl shadow">
                            <h4 className="text-xl font-semibold mb-2">1. Create Your Profile</h4>
                            <p>Set your investment goals and risk tolerance.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow">
                            <h4 className="text-xl font-semibold mb-2">2. Add Your Portfolio</h4>
                            <p>Input or sync your stock holdings easily.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow">
                            <h4 className="text-xl font-semibold mb-2">3. Get AI Recommendations</h4>
                            <p>Receive smart insights tailored to your goals.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow">
                            <h4 className="text-xl font-semibold mb-2">4. Improve Over Time</h4>
                            <p>Use AIvestor’s tools to grow your investment strategy.</p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-blue-600 text-white py-16 px-6 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to invest smarter with AI?</h2>
                    <p className="mb-8 text-lg">Join AIvestor and start making informed decisions today.</p>
                    <a href="/signup" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold shadow hover:bg-gray-100 transition">
                        Create Your Free Account
                    </a>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-8 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} AIvestor. All rights reserved.</p>
                    <div className="mt-2 space-x-4">
                        <a href="/about" className="hover:underline">About</a>
                        <a href="/terms" className="hover:underline">Terms</a>
                        <a href="/privacy" className="hover:underline">Privacy</a>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default LandingPage;