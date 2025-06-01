import "../../styles/globals.css"
import "../../styles/sidebarcss/loginsidebar.css";
import { HomeButton, AboutButton, LoginButton } from "../buttons.js";

function LoginSideBar() {
    return (
        <aside id="loginsidebar">
            <div id="loginsidebar-title-container" className="loginsidebar-header-containers">
                <div><HomeButton/></div>
            </div>
        
            <nav id="loginsidebar-button-container" className="loginsidebar-header-containers">
                <div><AboutButton/></div>
                <div><LoginButton/></div>
            </nav>
        </aside>
    );
}

export default LoginSideBar;