import "../pagecss/common.css";
import "../sidebarcss/mainsidebar.css";
import { DashboardButton, MarketButton, SettingsButton, LogoutButton } from "../components/buttons.js";

function MainSidebar({ noshow = [] }) {
  const somehide = noshow.length !== 0;
  return (
    <aside id="mainbar">
        <div className="mainsidebar-header">
            <div id="mainsidebar-title-container" className="mainsidebar-header-containers">
                <h1 id="title">AIvestor</h1>
            </div>
        
            <div id="mainsidebar-button-container" className={`mainsidebar-header-containers ${somehide ? "somehide" : ""}`}>
                {!noshow.includes("dashboard") && <div><DashboardButton /></div>}
                {!noshow.includes("market") && <div><MarketButton /></div>}
                {!noshow.includes("settings") && <div><SettingsButton /></div>}
                <div><LogoutButton /></div>
            </div>
        </div>
    </aside>
  );
}

export default MainSidebar;

