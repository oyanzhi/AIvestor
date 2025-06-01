import "../styles/componentcss/buttoncss/navigationbuttons.css";
import "../styles/componentcss/buttoncss/loginbutton.css";
import "../styles/componentcss/buttoncss/centerloginbutton.css";
import "../styles/componentcss/buttoncss/logoutbutton.css";
import "../styles/componentcss/buttoncss/homebutton.css";
import "../styles/componentcss/buttoncss/dashboardbutton.css";
import Link from "next/link";

function HomeButton() {
    return (
        <div id="home-button-container">
            <Link href="/">
                <button id="home-button" className="navbuttons"><span id="colorsplit">AI</span>vestor</button>
            </Link>
        </div>
    );
}

function AboutButton() {
    return (
        <div id="about-button-container">
            <button id="about-button" className="navbuttons">About</button>
        </div>
    );
}

function LoginButton() {
    return (
        <div id="login-button-container">
            <Link href="/login">
                <button id="login-button" className="navbuttons">Login</button>
            </Link>
        </div>
    );
}

function CenterLoginButton() {
    return (
        <div id="center-login-button-container">
            <Link href="/login">
                <button id="center-login-button" className="navbuttons">Get Started</button>
            </Link>
        </div>
    );
}

function DashboardButton() {
    return (
        <div id="dashboard-button-container">
            <button id="dashboard-button" className="navbuttons">Dashboard</button>
        </div>
    );
}

function MarketButton() {
    return (
        <div id="market-button-container">
            <button id="market-button" className="navbuttons">Market</button>
        </div>
    );
}

function SettingsButton() {
    return (
        <div id="settings-button-container">
            <button id="settings-button" className="navbuttons">Settings</button>
        </div>
    );
}

function LogoutButton() {
    const clear = () => {
        sessionStorage.removeItem("token");
    };
    return (
        <div id="logout-button-container">
            <button id="logout-button" className="navbuttons" onClick={clear}>Logout</button>
        </div>
    );
}

export {
    HomeButton,
    AboutButton,
    LoginButton,
    CenterLoginButton,
    DashboardButton,
    MarketButton,
    SettingsButton,
    LogoutButton };
