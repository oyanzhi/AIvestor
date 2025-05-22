import "../componentscss/buttoncontainercss/navigationbuttons.css";
import "../componentscss/buttoncontainercss/loginbutton.css";
import "../componentscss/buttoncontainercss/centerloginbutton.css";
import "../componentscss/buttoncontainercss/logoutbutton.css";
import "../componentscss/buttoncontainercss/homebutton.css";
import "../componentscss/buttoncontainercss/dashboardbutton.css";
import "../routing/routing.js";
import Routings from "../routing/routing.js";

function HomeButton() {
    return (
        <div id="home-button-container">
            <button id="home-button" className="navbuttons" onClick={Routings.ToLandingPage()}><span id="colorsplit">AI</span>vestor</button>
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
            <button id="login-button" className="navbuttons" onClick={Routings.ToLoginPage()}>Login</button>
        </div>
    );
}

function CenterLoginButton() {
    return (
        <div id="center-login-button-container">
            <button id="center-login-button" className="navbuttons" onClick={Routings.ToLoginPage()}>Get Started</button>
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
    return (
        <div id="logout-button-container">
            <button id="logout-button" className="navbuttons" onClick={Routings.ToLandingPage()}>Logout</button>
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
