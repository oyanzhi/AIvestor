import "../../app/(globals)/globals.css"
import { NavButton, AboutButton, LoginButton, HomeButton } from "../navbutton";

export default function LoginNavBar() {
    const custom: string = "bg-[#4A6CF7] font-bold text-white px-10 py-[1%] rounded-[10px] hover:bg-[#3b5ad8] transition duration-500";
    return (
        <aside className="fixed top-0 w-full h-16 bg-contrastdeepblue border-b border-[#000635] flex items-center justify-between px-6 z-50 shadow">
            <HomeButton todashboard={false}/>
        
            <nav className="flex items-center gap-[25px] px-[25px]">
                <AboutButton />
                <LoginButton />
            </nav>
        </aside>
    );
};