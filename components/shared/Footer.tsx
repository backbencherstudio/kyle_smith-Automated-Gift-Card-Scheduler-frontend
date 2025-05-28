'use client';

import React from 'react';
import Image from 'next/image';
import logo from '@/public/image/logo/mainLogo.png';
import { FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[#191401] text-white">
      <div className="container px-4 py-8 flex flex-col sm:flex-row justify-between items-center border-b border-[#26200e]">
        {/* Left: Logo */}
        <div className="mb-6 sm:mb-0">
          <Image src={logo} alt="TimelyGifts Logo" width={70} height={70} />
        </div>

        {/* Right: Links + Socials */}
        <div className="flex flex-col gap-5">
          {/* Links */}
          <div className="flex gap-10 text-sm text-white">
            <Link href="#" className="hover:underline">Pricing</Link>
            <Link href="#" className="hover:underline">Contact</Link>
            <Link href="#" className="hover:underline">Terms & Privacy</Link>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            <Link href="#" className="w-8 h-8 flex items-center justify-center border border-white rounded-full hover:bg-white hover:text-black transition">
              <FaFacebookF size={14} />
            </Link>
            <Link href="#" className="w-8 h-8 flex items-center justify-center border border-white rounded-full hover:bg-white hover:text-black transition">
              <FaLinkedinIn size={14} />
            </Link>
            <Link href="#" className="w-8 h-8 flex items-center justify-center border border-white rounded-full hover:bg-white hover:text-black transition">
              <FaInstagram size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center text-xs text-white py-4">
        Copyright © {currentYear} TimelyGifts All Rights Reserved.
      </div>
    </footer>
  );
}
