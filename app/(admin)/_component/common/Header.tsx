"use client";
import avatar from "@/public/profile.png";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NotificationManager from "@/lib/NotificationManager/NotificationManager";
import { useToken } from "@/hooks/useToken";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onNotificationClick?: () => void;
  adminName?: string;
  sidebarOpen: boolean;
  onMenuClick: () => void;
}

// Helper to normalize avatar URL for next/image
function getAvatarUrl(avatarUrl: string | null | undefined): string {
  if (!avatarUrl) return "/image/profile.png";
  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://"))
    return avatarUrl;
  if (avatarUrl.startsWith("/")) return avatarUrl;
  // Otherwise, treat as a file in /image/profile/
  return `/image/profile/${avatarUrl}`;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }: HeaderProps) => {
  const [profilePopoverOpen, setProfilePopoverOpen] = useState(false);
  const { user, logoutUser, isLoading } = useAuth();
  const router = useRouter();

  // Get token from useToken hook (like in admin header)
  const { token } = useToken();

  const handleLogout = () => {
    logoutUser(true);
    setProfilePopoverOpen(false);

    setTimeout(() => {
      router.push("/?login=true");
    }, 100);
  };

  if (isLoading) {
    return null;
  }

  return (
    <nav className="text-blackColor shadow !w-full py-3">
      <div className="px-5 relative flex justify-end mb-1">
        {/* Mobile menu button */}
        <div className="xl:hidden absolute left-5 top-1/2 -translate-y-1/2">
          <button onClick={onMenuClick} className="pr-2 py-2 text-[#4A4C56]">
            <Menu />
          </button>
        </div>

        {/* Notification and Profile */}
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

          {/* NotificationManager */}
          {token && <NotificationManager jwt={token} />}

          {/* Profile Popover */}
          <div className="relative sm:ml-0">
            <div className="flex items-center md:gap-3 gap-2 p-1.5 sm:p-2 rounded-md">
              <Popover
                open={profilePopoverOpen}
                onOpenChange={setProfilePopoverOpen}
              >
                <PopoverTrigger
                  onClick={() => setProfilePopoverOpen(!profilePopoverOpen)}
                >
                  <div className="flex justify-start items-center gap-1 sm:gap-2 cursor-pointer hover:opacity-90">
                    <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-full overflow-hidden">
                      <Image
                        src={getAvatarUrl(user?.avatar_url)}
                        alt="profile"
                        width={40}
                        height={40}
                        className="border-2 border-white object-cover rounded-full w-full h-full"
                      />
                    </div>
                    <div className="whitespace-nowrap">
                      <h4 className="sm:text-sm text-[13px] font-medium text-blackColor">
                        {user?.name || "User"}
                      </h4>
                    </div>
                    <IoIosArrowDown size={16} className="text-grayColor1" />
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[150px] space-y-6 mt-6"
                  style={{ boxShadow: "2px 2px 7px 2px rgba(0, 0, 0, 0.08)" }}
                >
                  <Link
                    href="/user-dashboard/settings"
                    onClick={() => setProfilePopoverOpen(false)}
                    className="flex items-center gap-3"
                  >
                    <Image
                      src="/icon/setting.svg"
                      alt="setting"
                      width={17}
                      height={17}
                    />
                    <p className="text-base font-medium text-descriptionColor">
                      Settings
                    </p>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer flex items-center gap-3"
                  >
                    <Image
                      src="/icon/logout.svg"
                      alt="logout"
                      width={17}
                      height={17}
                    />
                    <p className="text-base font-medium text-descriptionColor">
                      Log Out
                    </p>
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
