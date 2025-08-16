'use client'
import bannerImg from '@/public/image/hero-img.jpg';
import leftImg from '@/public/image/banner2.png';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ButtonReuseable from '../reusable/ButtonReuseable';
import ResuseableModal from '../reusable/ResuseableModal';
import RegisterForm from '../shared/RegisterForm';

function Banner() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const bannerParam = searchParams.get('banner');
    if (bannerParam === 'register') {
      setIsRegisterModalOpen(true);
    }
  }, [searchParams]);

  const handleRegisterClick = () => {
    setIsRegisterModalOpen(true);
    router.push('?banner=register');
  };

  const handleModalClose = () => {
    setIsRegisterModalOpen(false);
    router.push('/');
  };

  return (
    <div
      className="min-h-[680px] bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url(${bannerImg.src})` }}
    >
      <div className='container mx-auto px-4 relative z-10 h-full'>
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between  min-h-[680px]  lg:gap-8">

          {/* Left side - Image */}
          <div className="w-full mt-12 lg:mt-[200px] xl:mt-[72px] xl:w-6/12 flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative w-full flex items-center justify-center">
              <Image
                src={leftImg}
                alt="Gift Card Celebration"
                width={1000}
                height={1000}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="w-full mt-10 lg:mt-0 xl:w-6/12 text-center lg:text-left order-1 lg:order-2">
            <div className="space-y-4 lg:space-y-6 max-w-lg lg:max-w-none mx-auto lg:mx-0">
              {/* Main heading */}
              <h1 className="text-xl sm:text-4xl lg:text-5xl font-bold mb-4 text-[#1D1F2C] leading-tight ">
                Never Miss a Birthday Again – Let's Take Care of Your Gift Cards,
                <span > Effortlessly</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-[18px] mb-8 text-[#4A4C56] leading-relaxed">
                Send Thoughtful Gifts in Seconds to Automate your Gifts
              </p>

              <ButtonReuseable
                title="Get Started"
                className="bg-white cursor-pointer text-gray-800 hover:bg-gray-100  duration-300 py-3 px-8 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
                onClick={handleRegisterClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      <ResuseableModal
        isOpen={isRegisterModalOpen}
        onClose={handleModalClose}
        title=""
      >
        <RegisterForm />
      </ResuseableModal>
    </div>
  );
}

export default Banner;