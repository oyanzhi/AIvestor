import "../../app/(globals)/globals.css"
import { NavButton, HomeButton } from "../navbutton";
import { useRouter } from "next/navigation";

import { HomeIcon, ChartBarIcon, Cog6ToothIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';

interface MainNavBarProps {
  noshow?: string[];
}

function Logout() {
  const router = useRouter();
  return () => {
    sessionStorage.removeItem("token");
    router.replace("/");
  }
}

function MainNavBar({noshow = []}: MainNavBarProps) {
    return (
    <aside className="fixed w-full h-16 bg-contrastdeepblue border-b border-[#000635] flex items-center justify-between px-6 shadow">
      {/* Left: Brand */}
      <HomeButton todashboard={true} />

      {/* Right: Nav Buttons */}
      <nav className="flex items-center gap-6">
        {!noshow.includes('dashboard') && (
          <NavButton href="/dashboard" Icon={HomeIcon} label="Dashboard" />
        )}
        {!noshow.includes('market') && (
          <NavButton href="/market" Icon={ChartBarIcon} label="Market" />
        )}
        {!noshow.includes('settings') && (
          <NavButton href="/profilesetup" Icon={Cog6ToothIcon} label="Settings" />
        )}
        <NavButton href="/" Icon={ArrowRightEndOnRectangleIcon} label="Logout" side={Logout()} />
      </nav>
    </aside>
  );
}

export default MainNavBar;

