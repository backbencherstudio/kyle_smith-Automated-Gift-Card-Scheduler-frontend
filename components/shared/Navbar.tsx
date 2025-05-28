"use client";
import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import ButtonReuseable from "../reusable/ButtonReuseable";


export default function Navbar() {
  return (
    <div className="container p-4 flex justify-between items-center">
      {/* Logo */}
      <Link href="/" className="text-white text-3xl font-semibold tracking-wide">
        <Image
          src="/logo/homelogo.png"
          alt="logo"
          width={274}
          height={72}
          className="w-48 md:w-[150px] lg:w-[200px]"
        />
      </Link>

      {/* Desktop Buttons */}
      <div className="hidden md:flex gap-3 items-center">
        <ButtonReuseable
          title="Log In"
          className="border text-[#1D1F2C] border-[#1D1F2C] text-sm md:text-lg cursor-pointer px-10 hover:bg-[#FAD33E] transform duration-300 font-medium"
          onClick={() => console.log('Login clicked')}
        />
        <ButtonReuseable
          title="Get Started"
          className="bg-[#FAD33E] text-[#1D1F2C] border border-[#FAD33E] hover:bg-white transform duration-300 px-7 py-2 text-sm md:text-lg cursor-pointer font-medium"
          onClick={() => console.log('Get Started clicked')}
        />
      </div>

      {/* Mobile Menu */}
      <div className="flex md:hidden items-center">
        <Sheet>
          <SheetTrigger className="ml-4">
            <Menu className="h-8 w-8" />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            {/* Logo in Sidebar */}
            <div className="flex justify-start mb-8  py-2 px-4">
              <Image
                src="/logo/homelogo.png"
                alt="logo"
                width={200}
                height={52}
                className="w-40 sm:w-48"
              />
            </div>

            <div className="flex flex-col space-y-6 px-5">
              <div className="flex flex-col space-y-4 mt-8">
                <ButtonReuseable
                  title="Log In"
                  className="border py-3 border-[#1D1F2C] font-semibold text-md cursor-pointer px-10 hover:bg-[#FAD33E] transform duration-300"
                  onClick={() => console.log('Login clicked')}
                />
                <ButtonReuseable
                  title="Get Started"
                  className="bg-[#FAD33E] border border-[#FAD33E] hover:bg-white transform duration-300 px-7 py-3 text-md cursor-pointer font-semibold"
                  onClick={() => console.log('Get Started clicked')}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
