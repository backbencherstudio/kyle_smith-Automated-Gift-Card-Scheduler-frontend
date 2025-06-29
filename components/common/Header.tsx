"use client";
import avatar from "@/public/profile.png";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import UserAvatar from "../ui/UserAvatar";

interface HeaderProps {
  onNotificationClick?: () => void;
  adminName?: string;
  sidebarOpen: boolean;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
}: HeaderProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [profilePopoverOpen, setProfilePopoverOpen] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const { user, logoutUser } = useAuth();
  const router = useRouter();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "3 gifts scheduled for delivery tomorrow.",
      timeAgo: "5 min ago",
      img: "/image/notification/n1.png",
    },
    {
      id: 2,
      message: "Today is Emma Watson's birthday. User has not confirmed gift send.",
      timeAgo: "7 min ago",
      img: "/image/notification/n3.png",
    },
    {
      id: 3,
      message: "New user james@example.com signed up at 10:35 AM.",
      timeAgo: "10 min ago",
      img: "/image/notification/n1.png",
    },
    {
      id: 4,
      message: "Your order has been complete now.",
      timeAgo: "15 min ago",
      img: "/image/notification/n2.png",
    },
    {
      id: 5,
      message: "System backup completed successfully.",
      timeAgo: "30 min ago",
      img: "/image/notification/n4.png",
    },
    {
      id: 6,
      message: "Reminder: Update your profile information.",
      timeAgo: "1 hour ago",
      img: "/image/notification/n3.png",
    },
    {
      id: 7,
      message: "Esther Howard has scheduled a call.",
      timeAgo: "1 hour ago",
      img: "/image/notification/n1.png",
    },
    {
      id: 8,
      message: "Server rebooted due to scheduled maintenance.",
      timeAgo: "2 hours ago",
      img: "/image/notification/n4.png",
    },
    {
      id: 9,
      message: "New comment on your last update.",
      timeAgo: "3 hours ago",
      img: "/image/notification/n2.png",
    },
    {
      id: 10,
      message: "User michael@example.com has upgraded plan.",
      timeAgo: "4 hours ago",
      img: "/image/notification/n1.png",
    },
  ]);

  const displayedNotifications = showAllNotifications
    ? notifications
    : notifications.slice(0, 5);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleLogout = () => {
    logoutUser(true);
    setProfilePopoverOpen(false);
    
    setTimeout(() => {
      router.push('/?login=true');
    }, 100);
  };

  return (
    <nav className="text-blackColor shadow !w-full py-3">
      <div className="px-5 relative flex justify-end mb-1">
        {/* Mobile menu button */}
        <div className="xl:hidden absolute left-5 top-1/2 -translate-y-1/2">
          <button
            onClick={onMenuClick}
            className="pr-2 py-2 text-[#4A4C56]"
          >
            <Menu />
          </button>
        </div>

        {/* Notification and Profile */}
        <div className="flex items-center gap-2 lg:gap-5">
          {/* Search */}
          <div className="relative w-[140px] md:w-[221px]">
            <input type="text" className="w-full py-1.5 text-sm sm:text-base focus-visible:border-0 md:py-2.5 border md:rounded-[12px] rounded-md pl-7 pr-2" placeholder="Search" />
            <IoSearch className="text-borderColor text-base absolute left-2 top-1/2 -translate-y-1/2" />
          </div>

          {/* Notification Popover */}
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger
              className="cursor-pointer relative flex justify-center items-center lg:p-3 p-2 rounded-full"
              style={{ boxShadow: "2px 2px 7px 2px rgba(0, 0, 0, 0.08)" }}
              onClick={() => setPopoverOpen(!popoverOpen)}
            >
              {notifications.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex justify-center items-center text-sm w-6 h-6 text-whiteColor rounded-full bg-redColor" >
                  {notifications.length}
                </span>

              )}
              <Image src="/icon/notification.svg" alt="notification" width={18} height={18} />
            </PopoverTrigger>

            <PopoverContent className="w-80 md:w-[467px] mt-4 p-0 max-h-[550px] flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                <h4 className="text-base font-bold md:text-lg text-headerColor">Notifications</h4>
                {notifications.length > 0 && (
                  <button onClick={clearNotifications} className="text-base font-semibold underline cursor-pointer text-headerColor">
                    Clear All
                  </button>
                )}
              </div>

              {/* Scrollable Notification Body */}
              <div className="overflow-y-auto px-4 py-3 flex-1">
                {notifications.length > 0 ? (
                  <div className="flex flex-col space-y-6">
                    {displayedNotifications.map((notification) => (
                      <div key={notification.id} className="flex items-center space-x-3">
                        <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-full">
                          <Image src={notification.img} alt="notification" width={50} height={50} className="w-8 h-8 lg:w-12 lg:h-12 rounded-full" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-base text-headerColor">Carl Steadham</p>
                          <p className="text-sm font-normal text-descriptionColor mt-1">{notification.message}</p>
                        </div>
                        <div className="flex items-start">
                          <p className="text-xs text-gray-500">{notification.timeAgo}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-sm text-gray-500 py-6">No notifications available</p>
                )}
              </div>

              {/* Sticky Footer */}
              {notifications.length > 5 && !showAllNotifications && (
                <div className="border-t p-4 sticky bottom-0 bg-white z-10">
                  <button
                    onClick={() => setShowAllNotifications(true)}
                    className="text-headerColor font-bold flex gap-2 cursor-pointer items-center justify-center w-full"
                  >
                    View All <FaArrowRightLong />
                  </button>
                </div>
              )}
            </PopoverContent>


          </Popover>

          {/* Profile Popover */}
          <div className="relative sm:ml-0">
            <div className="flex items-center md:gap-3 gap-2 p-1.5 sm:p-2 rounded-md">
              <Popover open={profilePopoverOpen} onOpenChange={setProfilePopoverOpen}>
                <PopoverTrigger onClick={() => setProfilePopoverOpen(!profilePopoverOpen)}>
                  <div className="flex justify-start items-center gap-1 sm:gap-2 cursor-pointer hover:opacity-90">
                    <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-full overflow-hidden">
                      <Image 
                        src={user?.avatar_url || "/image/profile.png"} 
                        alt="profile" 
                        width={40} 
                        height={40} 
                        className="border-2 border-white"
                      />
                    </div>
                    <div className="whitespace-nowrap">
                      <h4 className="sm:text-sm text-[13px] font-medium text-blackColor">
                        {user?.name || 'User'}
                      </h4>
                    </div>
                    <IoIosArrowDown size={16} className="text-grayColor1" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[150px] space-y-6 mt-6" style={{ boxShadow: "2px 2px 7px 2px rgba(0, 0, 0, 0.08)" }}>
                  <Link href="/user-dashboard/settings" onClick={() => setProfilePopoverOpen(false)} className="flex items-center gap-3">
                    <Image src="/icon/setting.svg" alt="setting" width={17} height={17} />
                    <p className="text-base font-medium text-descriptionColor">Settings</p>
                  </Link>
                  <button onClick={handleLogout} className="cursor-pointer flex items-center gap-3">
                    <Image src="/icon/logout.svg" alt="logout" width={17} height={17} />
                    <p className="text-base font-medium text-descriptionColor">Log Out</p>
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

