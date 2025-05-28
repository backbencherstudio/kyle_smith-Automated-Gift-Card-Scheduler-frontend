import Image from 'next/image';
import React from 'react';

interface CardProps {
    imageSrc: string;
    title: string;
    description: string;
    buttonText: string;
    imageWidth: number;
    imageHeight: number;
    imageClassName?: string;
    onClick?: () => void;
}

export default function ChoseUsCard2nd({
    imageSrc,
    title,
    description,
    buttonText,
    imageWidth,
    imageHeight,
    imageClassName,
    onClick,
}: CardProps) {
    return (
        <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-20 justify-between">
            <div className="w-full md:w-1/2 space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
                <button
                    onClick={onClick}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-7 py-2 rounded font-medium transition"
                >
                    {buttonText}
                </button>
            </div>
            <div className="relative w-full md:w-1/2 ">
                <Image
                    width={imageWidth}
                    height={imageHeight}
                    src={imageSrc}
                    alt="Card visual"
                    className={`object-cover h-auto rounded ${imageClassName ?? 'w-full'}`}
                />
            </div>
        </div>
    );
}
