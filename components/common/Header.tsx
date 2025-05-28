"use client";
import avatar from "@/public/profile.png";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";

interface HeaderProps {
  onNotificationClick?: () => void;
  adminName?: string;
  sidebarOpen: boolean;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  sidebarOpen,
}: HeaderProps) => {
  const [isShow, seIsShow] = useState<boolean>(false);
  const router = useRouter();
  const handleLogout = () => {
    console.log("logout");
  };
  return (
    <nav className=" text-blackColor   py-3">
      <div className=" container !px-3   relative flex justify-between mb-1 z-50">
        {/* Mobile menu button */}
        <div>
          <div className=" xl:hidden flex items-center">
            <button
              onClick={onMenuClick}
              className=" pr-2 py-2  text-[#4A4C56]"
            >
              {sidebarOpen ? (
                <X className=" z-50 " />
              ) : (
                <Menu className="text-blackColor" />
              )}
            </button>
            {/* <Link
              href={"/"}
              className="text-white text-xl lg:text-3xl font-semibold tracking-wide"
            >
              <Image
                src="/logo/mainLogo.png"
                alt="main logo "
                width={100}
                height={29}
              />
            </Link> */}
          </div>
        </div>

        {/* Notification and Profile Group */}

        <div className="flex items-center gap-2 lg:gap-5 justify-end">
          <div className=" relative w-[140px] md:w-[221px]">
            <input type="text" className=" w-full py-1.5 text-sm sm:text-base focus-visible:border-0 md:py-2.5 border md:rounded-[12px] rounded-md pl-7 pr-2" placeholder="Search" />
            <IoSearch className=" text-borderColor text-base absolute left-2 top-1/2 -translate-y-1/2"/>
          </div>
            <button
              className=" cursor-pointer relative flex justify-center items-center lg:p-3 p-2 rounded-full  "
              style={{
                boxShadow: "2px 2px 7px 2px rgba(0, 0, 0, 0.08)", // uniform shadow all sides
              }}
            >
              <span className="absolute -top-0.5 right-0 w-3 h-3 rounded-full bg-redColor "></span>
              <Image
                src="/icon/notification.svg"
                alt="notification"
                width={18}
                height={18}
                className="w-[15px] md:w-[18px] md:h-[18px] h-[15px]"
              />
            </button>
         
          <div className="  relative sm:ml-0">
            <Link href="/dashboard/my-profile"
              className="flex items-center md:gap-3 gap-2 p-1.5 sm:p-2 rounded-md"
              style={{
                boxShadow: "2px 2px 7px 2px rgba(0, 0, 0, 0.1)", // uniform shadow all sides
              }}
            >
              <div
                onClick={() => seIsShow(!isShow)}
                className="flex justify-start items-center gap-1 sm:gap-2 cursor-pointer hover:opacity-90"
              >
                <div className=" w-6 h-6 lg:w-10 lg:h-10 rounded-full overflow-hidden">
                  <Image
                    src={avatar}
                    alt="Admin Avatar"
                    width={40}
                    height={40}
                    className="rounded-full w-full h-full  "
                  />
                </div>
                <div className="whitespace-nowrap">
                  <h4 className="sm:text-sm text-[13px] font-medium text-blackColor">
                  Esther Howard
                  </h4>
                </div>
                <button className=" cursor-pointer">
                  <IoIosArrowDown size={16} className="text-grayColor1" />
                </button>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
