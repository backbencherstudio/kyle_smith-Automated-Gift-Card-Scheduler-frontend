"use client";

import Image from "next/image";
import Link from "next/link";




export default function Navbar() {
  
 
  return (
    <header className=" py-4 ">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left: Logo */}
        <Link href="/" className="text-white text-3xl font-semibold tracking-wide">
          <Image src="/logo/homelogo.png" alt="logo" width={274} height={72} className="w-36 md:w-[150px] lg:w-[274px]"/>
          <p></p>
        </Link>
         <div className=" flex gap-3 items-center">
           <button className="md:py-3 py-2 px-4 font-[Inter]  md:px-8 border border-blackColor cursor-pointer text-sm md:text-lg rounded-md">Log In</button>
           <button className="md:py-3 py-2 px-4 md:px-8 font-[Inter] bg-primaryColor cursor-pointer text-sm md:text-lg rounded-md">Get Started</button>
         </div>
      
      </div>

    
    </header>
  );
}
