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
  const [isShow, setIsShow] = useState<boolean>(false);
  const [popoverOpen, setPopoverOpen] = useState(false); // State to control popover visibility
  const router = useRouter();

  const notifications = [
    {
      id: 1,
      message: "3 gifts scheduled for delivery tomorrow.",
      timeAgo: "5 min ago",
      img:"/image/notification/n1.png"
    },
    {
      id: 2,
      message: "Today is Emma Watson's birthday. User has not confirmed gift send.",
      timeAgo: "5 min ago",
      img:"/image/notification/n3.png"
    },
    {
      id: 3,
      message: "New user james@example.com signed up at 10:35 AM.",
      timeAgo: "5 min ago",
      img:"/image/notification/n1.png"
    },
    {
      id: 4,
      message: "New user james@example.com signed up at 10:35 AM.",
      timeAgo: "5 min ago",
      img:"/image/notification/n4.png"
    },
    {
      id: 5,
      message: "Your order has been complete now.",
      timeAgo: "5 min ago",
      img:"/image/notification/n2.png"
    },
  ];


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
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger
              className="cursor-pointer relative flex justify-center items-center lg:p-3 p-2 rounded-full"
              style={{
                boxShadow: "2px 2px 7px 2px rgba(0, 0, 0, 0.08)", // uniform shadow all sides
              }}
              onClick={() => setPopoverOpen(!popoverOpen)} // Toggle popover visibility
            >
              <span className="absolute -top-0.5 right-0 w-3 h-3 rounded-full bg-redColor"></span>
              <Image
                src="/icon/notification.svg"
                alt="notification"
                width={18}
                height={18}
                className="w-[15px] md:w-[18px] md:h-[18px] h-[15px]"
              />
            </PopoverTrigger>

            {/* Popover Content */}
            <PopoverContent className="w-80 md:w-[467px] mt-4 p-4">
              <div className=" flex justify-between items-center pb-5 border-b">
               <h4 className="text-base font-bold md:text-lg text-headerColor">Notifications</h4>
               <button className="text-base font-semibold underline cursor-pointer text-headerColor">
               Clear All
               </button>
              </div>
              <div className="flex flex-col space-y-6 mt-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8  lg:w-12 lg:h-12 rounded-full  flex items-center justify-center">
                      {/* Icon Placeholder */}
                     <Image src={notification?.img} alt="notification" width={50} height={50} className="w-8 h-8  lg:w-12 lg:h-12 rounded-full"/>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-base text-headerColor">Carl Steadham</p>
                      <p className="text-sm font-normal text-descriptionColor mt-1">{notification.message}</p>
                     
        
           </div>
           <div className=" flex items-start">
           <p className="text-xs text-gray-500">{notification.timeAgo}</p>
           </div>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <button className="text-headerColor font-bold flex gap-2 items-center justify-center cursor-pointer pt-4 border-t text-center  w-full">View All <FaArrowRightLong /></button>
              </div>
            </PopoverContent>
          </Popover>
         
          <div className="  relative sm:ml-0">
            <Link href="/dashboard/my-profile"
              className="flex items-center md:gap-3 gap-2 p-1.5 sm:p-2 rounded-md"
              style={{
                boxShadow: "2px 2px 7px 2px rgba(0, 0, 0, 0.1)", // uniform shadow all sides
              }}
            >
              <div
            
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
