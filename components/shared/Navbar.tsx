"use client";
import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import ButtonReuseable from "../reusable/ButtonReuseable";
import { useState, useEffect } from "react";
import ResuseableModal from "../reusable/ResuseableModal";
import RegisterForm from "./RegisterForm";
import { useRouter, useSearchParams } from "next/navigation";
import LoginPage from "./LoginPage";

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const registerParam = searchParams.get('register');
    const loginParam = searchParams.get('login');
    
    if (registerParam === 'true') {
      setIsRegisterModalOpen(true);
      setIsLoginModalOpen(false);
    } else if (loginParam === 'true') {
      setIsLoginModalOpen(true);
      setIsRegisterModalOpen(false);
    } else {
      setIsRegisterModalOpen(false);
      setIsLoginModalOpen(false);
    }
  }, [searchParams]);

  const handleRegisterClick = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
    router.push('?register=true');
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
    router.push('?login=true');
  };

  const handleModalClose = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
    router.push('/');
  };

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="flex justify-between items-center container px-4 py-4">
        {/* Logo */}
        <Link href="/" className="text-white text-3xl font-semibold tracking-wide">
          <Image
            src="/image/logo/homelogo.png"
            alt="logo"
            width={274}
            height={72}
            className="w-48 md:w-[150px] lg:w-[200px]"
          />
        </Link>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-3 items-center">
          <ButtonReuseable
            title="Login"
            className="border text-[#1D1F2C] border-[#1D1F2C] text-sm md:text-lg cursor-pointer px-10 hover:bg-[#FAD33E] transform duration-300 font-medium"
            onClick={handleLoginClick}
          />
          <ButtonReuseable
            title="Get Started"
            className="bg-[#FAD33E] text-[#1D1F2C] border border-[#FAD33E] hover:bg-white transform duration-300 px-7 py-2 text-sm md:text-lg cursor-pointer font-medium"
            onClick={handleRegisterClick}
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
                  src="/image/logo/homelogo.png"
                  alt="logo"
                  width={200}
                  height={52}
                  className="w-40 sm:w-48"
                />
              </div>

              <div className="flex flex-col space-y-6 px-5">
                <div className="flex flex-col space-y-4 mt-8">
                  <ButtonReuseable
                    title="Login"
                    className="border py-3 border-[#1D1F2C] font-semibold text-md cursor-pointer px-10 hover:bg-[#FAD33E] transform duration-300"
                    onClick={handleLoginClick}
                  />
                  <ButtonReuseable
                    title="Get Started"
                    className="bg-[#FAD33E] border border-[#FAD33E] hover:bg-white transform duration-300 px-7 py-3 text-md cursor-pointer font-semibold"
                    onClick={handleRegisterClick}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>


        {/* Register Modal */}
        <ResuseableModal
          isOpen={isRegisterModalOpen}
          onClose={handleModalClose}
          title=""
        >
          <RegisterForm onLoginClick={handleLoginClick} />
        </ResuseableModal>

        {/* Login Modal */}
        <ResuseableModal
          isOpen={isLoginModalOpen}
          onClose={handleModalClose}
          title=""
        >
          <LoginPage />
        </ResuseableModal>
      </div>
    </div>
  );
}
