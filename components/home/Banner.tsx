import bannerImg from '@/public/image/hero-img.jpg';
import leftImg from '@/public/image/hero-image.png';
import Image from 'next/image';

function Banner() {
  return (
    <section
      className="min-h-[680px] lg:h-[680px] bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bannerImg.src})` }}
    >

      {/* Content inside the banner */}
      <div className="relative z-10 container mx-auto px-4 py-8 h-full">
        <div className="flex flex-col lg:flex-row justify-between items-center h-full min-h-[600px] gap-8 lg:gap-4">

          {/* Left Image */}
          <div className="w-full lg:w-[45%] h-[300px] lg:h-full flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative w-full h-full mt-8 max-w-[350px] lg:max-w-[500px]">
              <Image
                src={leftImg}
                alt="Gift Cards and Presents"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-[50%] max-w-[500px] text-center lg:text-left order-1 lg:order-2 flex-shrink-0">
            <h1 className="text-4xl sm:text-4xl lg:text-5xl font-bold mb-4 text-[#1D1F2C] leading-tight">
              Never Miss a Birthday Again – Let's Take Care of Your Gift Cards,
              <span > Effortlessly</span>
            </h1>

            <p className="text-lg sm:text-[18px] mb-8 text-[#4A4C56] leading-relaxed">
              Send Thoughtful Gifts in Seconds to Automate your Gifts
            </p>

            <button className="bg-white text-gray-800 hover:bg-gray-100  duration-300 py-3 px-8 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;