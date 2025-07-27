import "../../app/(globals)/globals.css"
import { NavButton, HomeButton } from "../navbutton";
import { useRouter } from "next/navigation";

import {
  HomeIcon,
  Cog6ToothIcon,
  ArrowRightEndOnRectangleIcon,
  RectangleStackIcon,
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  SparklesIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline';

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

function MainNavBar({ noshow = [] }: MainNavBarProps) {
  return (
    <aside className="fixed w-full h-16 z-50 bg-contrastdeepblue border-b border-[#000635] flex items-center justify-between px-6 shadow">
      {/* Left: Brand */}
      <HomeButton todashboard={true} />

      {/* Right: Nav Buttons */}
      <nav className="flex items-center gap-6">
        {!noshow.includes('dashboard') && (
          <NavButton href="/dashboard" Icon={HomeIcon} label="Dashboard" />
        )}
        {!noshow.includes("recommendations") && (
          <NavButton href="/aipicks" Icon={SparklesIcon} label="AI Picks" />
        )}
        {!noshow.includes("stock") && (
          <NavButton href="/stockpage" Icon={NewspaperIcon} label="Stock" />
        )}
        {!noshow.includes("portfolio") && (
          <NavButton href="/portfolio" Icon={RectangleStackIcon} label="Portfolio" />
        )}
        {!noshow.includes("alerts") && (
          <NavButton href="/alerts" Icon={BellAlertIcon} label="Alerts" />
        )}
        {!noshow.includes("forum") && (
          <NavButton href="/forum" Icon={ChatBubbleLeftRightIcon} label="Forum" />
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

