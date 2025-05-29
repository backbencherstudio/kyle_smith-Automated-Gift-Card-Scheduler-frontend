"use client";

import avatar from "@/public/profile.png";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FaArrowRightLong } from "react-icons/fa6";

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
  const [popoverOpen, setPopoverOpen] = useState(false);
  const router = useRouter();

  const notifications = [
    {
      id: 1,
      message: "3 gifts scheduled for delivery tomorrow.",
      timeAgo: "5 min ago",
      img: "/image/notification/n1.png",
    },
    {
      id: 2,
      message: "Today is Emma Watson's birthday. User has not confirmed gift send.",
      timeAgo: "10 min ago",
      img: "/image/notification/n3.png",
    },
    {
      id: 3,
      message: "New user james@example.com signed up at 10:35 AM.",
      timeAgo: "15 min ago",
      img: "/image/notification/n1.png",
    },
    {
      id: 4,
      message: "Your order has been completed.",
      timeAgo: "30 min ago",
      img: "/image/notification/n4.png",
    },
    {
      id: 5,
      message: "Welcome bonus has been credited to your account.",
      timeAgo: "1 hour ago",
      img: "/image/notification/n2.png",
    },
    {
      id: 6,
      message: "This is the 6th notification, should be hidden.",
      timeAgo: "2 hours ago",
      img: "/image/notification/n1.png",
    },
  ];

  return (
    <nav className="text-blackColor py-3 bg-white">
      <div className="px-5 relative flex justify-between items-center mb-1 z-30">
        {/* Left side: menu button (keeps space on large screens) */}
        <div className="w-10">
          <button
            onClick={onMenuClick}
            className="p-2 focus:outline-none lg:invisible"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6 text-[#4A4C56]" />
            ) : (
              <Menu className="h-6 w-6 text-blackColor" />
            )}
          </button>
        </div>

        {/* Right side: search, notifications, profile */}
        <div className="flex items-center gap-2 lg:gap-5">
          {/* Search */}
          <div className="relative w-[140px] md:w-[221px]">
            <input
              type="text"
              className="w-full py-1.5 text-sm sm:text-base focus-visible:border-0 md:py-2.5 border md:rounded-[12px] rounded-md pl-7 pr-2"
              placeholder="Search"
            />
            <IoSearch className="text-borderColor text-base absolute left-2 top-1/2 -translate-y-1/2" />
          </div>

          {/* Notifications */}
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger
              className="cursor-pointer relative flex justify-center items-center lg:p-3 p-2 rounded-full"
              style={{ boxShadow: "2px 2px 7px 2px rgba(0, 0, 0, 0.08)" }}
              onClick={() => setPopoverOpen(!popoverOpen)}
            >
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {notifications.length}
                </span>
              )}
              <Image
                src="/icon/notification.svg"
                alt="notification"
                width={18}
                height={18}
                className="w-[15px] md:w-[18px] md:h-[18px] h-[15px]"
              />
            </PopoverTrigger>

            <PopoverContent className="w-80 md:w-[467px] mt-4 p-4">
              <div className="flex justify-between items-center pb-5 border-b">
                <h4 className="text-base font-bold md:text-lg text-headerColor">
                  Notifications
                </h4>
                <button className="text-base font-semibold underline cursor-pointer text-headerColor">
                  Clear All
                </button>
              </div>

              <div className="flex flex-col space-y-6 mt-3">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-full flex items-center justify-center">
                      <Image
                        src={notification.img}
                        alt="notification"
                        width={50}
                        height={50}
                        className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-base text-headerColor">Carl Steadham</p>
                      <p className="text-sm font-normal text-descriptionColor mt-1">
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <p className="text-xs text-gray-500">{notification.timeAgo}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button className="text-headerColor font-bold flex gap-2 items-center justify-center cursor-pointer pt-4 border-t text-center w-full">
                  View All <FaArrowRightLong />
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Profile */}
          <div className="relative sm:ml-0">
            <Link
              href="/dashboard/my-profile"
              className="flex items-center md:gap-3 gap-2 p-1.5 sm:p-2 rounded-md"
              style={{ boxShadow: "2px 2px 7px 2px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex justify-start items-center gap-1 sm:gap-2 hover:opacity-90">
                <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-full overflow-hidden">
                  <Image
                    src={avatar}
                    alt="Admin Avatar"
                    width={40}
                    height={40}
                    className="rounded-full w-full h-full"
                  />
                </div>
                <div className="whitespace-nowrap">
                  <h4 className="sm:text-sm text-[13px] font-medium text-blackColor">
                    Esther Howard
                  </h4>
                </div>
                <button className="cursor-pointer">
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
