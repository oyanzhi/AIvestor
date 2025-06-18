import "../../styles/globals.css"
import "../../styles/sidebarcss/loginnavbar.css";
import { NavButton, HomeButton } from "../navbutton";

export default function LoginNavBar() {
    const custom: string = "bg-[#4A6CF7] font-bold text-white px-[3%] py-[1%] rounded-[15px] hover:bg-[#3b5ad8] transition duration-500";
    return (
        <aside id="loginsidebar">
            <div id="loginsidebar-title-container" className="loginsidebar-header-containers">
                <HomeButton todashboard={false}/>
            </div>
        
            <nav id="loginsidebar-button-container" className="loginsidebar-header-containers">
                <NavButton href="/" label="About" customdesign={custom}></NavButton>
                <NavButton href="/login" label="Login" customdesign={custom}></NavButton>
            </nav>
        </aside>
    );
};