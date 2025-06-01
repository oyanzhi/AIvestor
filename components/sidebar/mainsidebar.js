import "../../styles/globals.css"
import "../../styles/sidebarcss//mainsidebar.css";
import { HomeButton, DashboardButton, MarketButton, SettingsButton, LogoutButton } from "../buttons.js";

import { HomeIcon, ChartBarIcon, Cog6ToothIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

function NavButton({ href, icon: Icon, label }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-white hover:text-cyan-400 transition">
      <Icon className="h-5 w-5" />
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
}

function MainSidebar({ noshow = [] }) {
  return (
    <aside className="fixed top-0 w-full h-16 bg-deepblue border-b border-[#000635] flex items-center justify-between px-6 z-50 shadow">
      {/* Left: Brand */}
      <HomeButton/>

      {/* Right: Nav Buttons */}
      <nav className="flex items-center gap-6">
        {!noshow.includes('dashboard') && (
          <NavButton href="/dashboard" icon={HomeIcon} label="Dashboard" />
        )}
        {!noshow.includes('market') && (
          <NavButton href="/market" icon={ChartBarIcon} label="Market" />
        )}
        {!noshow.includes('settings') && (
          <NavButton href="/profilesetup" icon={Cog6ToothIcon} label="Settings" />
        )}
        <NavButton href="/" icon={ArrowRightEndOnRectangleIcon} label="Logout" />
      </nav>
    </aside>
  );
}

export default MainSidebar;

