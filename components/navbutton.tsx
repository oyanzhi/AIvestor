"use client"

import Link from "next/link";
import { SVGProps } from "react";
import { QuestionMarkCircleIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/outline";

type NavButtonProps = {
  href: string;
  Icon?: React.FC<SVGProps<SVGSVGElement>>;
  label: string;
  side?: () => void;
  iconposition?: "left" | "right";
  customdesign?: string;
}

function NavButton({ href, Icon, label, side = () => {}, iconposition = "left",
  customdesign = "flex items-center gap-2 text-white hover:text-cyan-400 transition"}: NavButtonProps) {
  return (
    <Link href={href} className={customdesign} onNavigate={side}>
      {Icon && iconposition === "left" && <Icon className="h-5 w-5" />}
      <span className="hidden md:inline font-bold">{label}</span>
      {Icon && iconposition === "right" && <Icon className="h-5 w-5" />}
    </Link>
  );
}

function AboutButton() {
  return <NavButton href="/" label="About" Icon={QuestionMarkCircleIcon} iconposition="right"/>
}

function LoginButton() {
  return <NavButton href="/login" label="Login" Icon={ChevronDoubleRightIcon} iconposition="right"/>
}

type HomeButtonProps = {
  todashboard: boolean;
}

function HomeButton({todashboard}: HomeButtonProps) {
    const custom: string = "text-white font-bold text-[25px] px-[10px] py-[1px] rounded-[15px] hover:bg-blue-600 transition duration-500";
    const routeto = todashboard ? "/dashboard" : "/";
    return (
      <Link href={routeto} className={custom}>AI<span className="text-[#4A6CF7]">vestor</span></Link>
    );
}

export { NavButton, AboutButton, LoginButton, HomeButton };
