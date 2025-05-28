'use client'
import React from 'react'
import image from '@/public/image/celebrations_bg1.png'
import CelebrationIcon from '../Icon/CelebrationIcon'
import ButtonReuseable from '../reusable/ButtonReuseable'

export default function Celebration() {
    return (
        <section
            className="min-h-[400px] lg:h-[400px] bg-cover bg-center bg-no-repeat relative flex items-center justify-center px-4 text-center my-10"
            style={{ backgroundImage: `url(${image.src})` }}
        >
            <div className=" text-white w-full">
                <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
                    <h2 className="text-2xl md:text-4xl font-bold text-[#1D1F2C]">
                        Stay Connected, Never Miss a Celebration!
                    </h2>
                    <div className='-mt-10 hidden sm:block'>
                        <CelebrationIcon />
                    </div>
                </div>

                {/* Subtitle */}
                <p className="text-sm md:text-base text-[#4A4C56] mb-6 max-w-2xl mx-auto">
                    Join Cardfelt today and ensure every special moment is cherished. Sign up now to start spreading
                    love, one heartfelt card at a time.
                </p>

                <div>
                    <ButtonReuseable
                        title="Get Started"
                        className="bg-white cursor-pointer hover:bg-gray-100 text-black px-7 py-2 rounded font-medium transition"
                    />
                </div>
            </div>
        </section>
    )
}
