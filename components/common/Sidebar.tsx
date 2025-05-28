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
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems: NavItem[] = [
  {
    icon: "/icon/grid-alt.svg", // Replace this with the actual image path
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: "/icon/note.svg", // Replace this with the actual image path
    label: "User Management",
    href: "/dashboard/user-management",
  },
  {
    icon: "/icon/giftlog.svg", // Replace this with the actual image path
    label: "Gift Log",
    href: "/dashboard/gift-log",
  },
  {
    icon: "/icon/payment.svg", // Replace this with the actual image path
    label: "Payment Settings",
    href: "/dashboard/payment-settings",
  },
  {
    icon: "/icon/setting.svg", // Replace this with the actual image path
    label: "Settings",
    href: "/dashboard/settings",
  },
  {
    icon: "/icon/logout.svg", // Replace this with the actual image path
    label: "Log Out",
    href: "/login",
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };
  return (
    <div className="h-screen  ">
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="absolute top-0 left-0 w-full h-full z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <div
        className={`
          ${
            isOpen
              ? "z-50 h-full overflow-hidden absolute top-0 left-0"
              : "h-full"
          }
          flex flex-col
          min-h-[calc(100vh-100px)] 
          bg-white 
         
          shadow-[0px_-0.3px_5.5px_0px_rgba(0,0,0,0.02)]
          lg:rounded-[12px] 
          p-5 w-full overflow-y-auto
        `}
      >
        <div className="flex justify-end xl:hidden cursor-pointer">
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Account Section */}
        <div className="my-4 ">
          <Link
            href={"/"}
            className="text-white flex justify-center pb-5 text-xl lg:text-3xl font-semibold tracking-wide"
          >
            <Image
              src="/logo/Logo.png"
              alt="main logo "
              width={138}
              height={29}
            />
          </Link>
          <div className=" space-y-2"> 

          {navItems.map((item, idx) => {
            const active = isActive(item.href);
            return (
              <Link
                key={idx}
                href={item.href}
                onClick={onClose}
                className={` 
        flex items-center justify-between group gap-3 px-3 py-2.5 lg:py-3 rounded-lg  hover:bg-primaryColor/10
        transition-colors duration-200
        ${active ? "bg-[#FDCB48]" : ""}
      `}
                >
                  <div className="flex gap-2 items-center">
                    <div
                      className={`
            w-[30px] h-[30px] flex justify-center items-center flex-shrink-0 rounded-full
            text-xl font-medium
            ${active ? "text-primaryColor" : "text-descriptionColor "}
          `}
                    >
                      <div>
                        <Image
                          src={item?.icon}
                          alt={item?.label}
                          width={18}
                          height={18}
                        />
                      </div>
                    </div>
                    <span
                      className={`
            text-base font-semibold  whitespace-nowrap
            ${active ? "text-descriptionColor" : "text-descriptionColor "}
          `}
                    >
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
