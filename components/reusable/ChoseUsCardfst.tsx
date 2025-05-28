import Image from 'next/image';
import React from 'react';

interface CardProps {
    imageSrc: string;
    title: string;
    description: string;
    imageWidth: number;
    imageHeight: number;
    buttonText: string;
    imageClassName?: string;
    onClick?: () => void;

}

export default function ChoseUsCardfst({
    imageSrc,
    title,
    description,
    imageWidth,
    imageHeight,
    imageClassName,
    buttonText,
    onClick,
}: CardProps) {
    return (
        <div className="flex flex-col-reverse md:flex-row items-center gap-5 justify-between w-full">
            <div className="relative w-full md:w-1/2">
                <Image
                    width={imageWidth}
                    height={imageHeight}
                    src={imageSrc}
                    alt="Card visual"
                    className={`object-cover h-auto rounded ${imageClassName ?? 'w-full'}`}
                />
            </div>

            {/* Text Content */}
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
        </div>
    );
}
