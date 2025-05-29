"use client";

import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavItem {
  icon: any;
  label: string;
  href: string;
  role: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems: NavItem[] = [
  // Admin routes
  { icon: "/icon/grid-alt.svg", label: "Dashboard", href: "/dashboard", role: "admin" },
  { icon: "/icon/note.svg", label: "User Management", href: "/dashboard/user-management", role: "admin" },
  { icon: "/icon/giftlog.svg", label: "Gift Log", href: "/dashboard/gift-log", role: "admin" },
  { icon: "/icon/payment.svg", label: "Payment Settings", href: "/dashboard/payment-settings", role: "admin" },
  { icon: "/icon/setting.svg", label: "Settings", href: "/dashboard/settings", role: "admin" },
  { icon: "/icon/logout.svg", label: "Log Out", href: "/login", role: "admin" },

  // User routes
  { icon: "/icon/grid-alt.svg", label: "Dashboard", href: "/user-dashboard", role: "user" },
  { icon: "/icon/note.svg", label: "Contacts", href: "/user-dashboard/contacts", role: "user" },
  { icon: "/icon/giftlog.svg", label: "Gift Scheduling", href: "/user-dashboard/gift-scheduling", role: "user" },
  { icon: "/icon/payment.svg", label: "Payment Settings", href: "/user-dashboard/payment-settings", role: "user" },
  { icon: "/icon/setting.svg", label: "Settings", href: "/user-dashboard/settings", role: "user" },
  { icon: "/icon/logout.svg", label: "Log Out", href: "/login", role: "user" }
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  // Demo user (static)
  const user = {
    name: "John Doe",
    email: "test@gmail.com",
    role: "admin"
  };

  const isActive = (href: string): boolean => {
    if (href === "/user-dashboard" || href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="h-screen">
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-white z-50
          w-[280px] lg:w-full lg:relative
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col min-h-[calc(100vh-100px)]
          shadow-[0px_-0.3px_5.5px_0px_rgba(0,0,0,0.02)]
          lg:rounded-[12px] p-5 overflow-y-auto
        `}
      >
        <div className="flex justify-end lg:hidden cursor-pointer">
          <button onClick={onClose}><X /></button>
        </div>

        <div className="my-4">
          <Link href="/" className="text-white flex justify-center pb-5 text-xl lg:text-3xl font-semibold tracking-wide">
            <Image src="/logo/Logo.png" alt="main logo" width={138} height={29} />
          </Link>

          <div className="space-y-2">
            {navItems
              .filter((item) => item.role === user.role)
              .map((item, idx) => {
                const active = isActive(item.href);
                const isLogout = item.label.toLowerCase() === "log out";

                return isLogout ? (
                  <button
                    key={idx}
                    onClick={() => {
                      console.log("🔒 Logging out...");
                      alert("This is a demo logout. Replace with real logic later.");
                    }}
                    className={`
                      w-full text-left
                      flex items-center cursor-pointer justify-between group gap-3 px-3 py-2.5 lg:py-3 rounded-lg hover:bg-primaryColor/10
                      transition-colors duration-200
                      ${active ? "bg-[#FDCB48]" : ""}
                    `}
                  >
                    <div className="flex gap-2 items-center">
                      <div className="w-[30px] h-[30px] flex justify-center items-center flex-shrink-0 rounded-full text-descriptionColor">
                        <Image src={item.icon} alt={item.label} width={18} height={18} />
                      </div>
                      <span className="text-base font-semibold whitespace-nowrap text-descriptionColor">
                        {item.label}
                      </span>
                    </div>
                  </button>
                ) : (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center justify-between group gap-3 px-3 py-2.5 lg:py-3 rounded-lg hover:bg-primaryColor/10
                      transition-colors duration-200
                      ${active ? "bg-[#FDCB48]" : ""}
                    `}
                  >
                    <div className="flex gap-2 items-center">
                      <div className={`w-[30px] h-[30px] flex justify-center items-center flex-shrink-0 rounded-full ${active ? "text-primaryColor" : "text-descriptionColor"}`}>
                        <Image src={item.icon} alt={item.label} width={18} height={18} />
                      </div>
                      <span className="text-base font-semibold whitespace-nowrap text-descriptionColor">
                        {item.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
