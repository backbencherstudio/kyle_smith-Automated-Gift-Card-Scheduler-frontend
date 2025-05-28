import React from 'react';
import ContactsIcon from '../Icon/ContactsIcon';
import GiftsIcon from '../Icon/ChooseIcon';
import GiftIcons from '../Icon/GiftIcons';

const HowItWorks = () => {
    const steps = [
        {
            title: 'Sign up & Add Contacts',
            description:
                'Sign up quickly using email or social accounts, then easily add contacts by entering their details or syncing birthdays from Facebook.',
            icon: (
                <ContactsIcon />
            )
        },
        {
            title: 'Choose & Schedule Gifts',
            description:
                'Sign up quickly using email or social accounts, then easily add contacts by entering their details or syncing birthdays from Facebook.',
            icon: (
                <GiftsIcon />
            )
        },
        {
            title: 'We Deliver the Gift',
            description:
                'Sign up quickly using email or social accounts, then easily add contacts by entering their details or syncing birthdays from Facebook.',
            icon: (
                <GiftIcons />
            )
        }
    ];

    const BgIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="114" height="91" viewBox="0 0 114 91" fill="none" className="absolute inset-0 w-full h-full">
            <path fillRule="evenodd" clipRule="evenodd" d="M3.2143 8.43621C-5.22991 20.2376 5.57576 37.6169 6.87748 51.6743C8.1039 64.9185 1.96882 76.5222 12.5438 84.5897C23.5218 92.9647 37.8419 91.174 51.5763 89.7519C71.6037 87.6782 96.5375 91.9944 107.29 74.9718C118.945 56.5222 114.111 23.4538 99.7622 7.01192C80.6366 -8.04516 63.2429 7.67681 44.1131 7.01189C29.8318 6.5155 13.6611 -1.31406 3.2143 8.43621Z" fill="#FAC026" />
        </svg>
    );

    return (
        <section className="py-16 px-4 bg-[#FFFCF5] text-center">
            <h2 className="text-4xl font-bold text-[#1D1F2C] mb-2">How It Works</h2>
            <p className="text-[#4A4C56] mb-16">
                Simple, automated gift scheduling that keeps you on track for every special occasion
            </p>
            <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center relative w-full h-full">
                        <div className="relative w-[114px] h-[91px] mb-6">
                            <BgIcon />
                            <div className="absolute inset-0 flex items-center justify-center">
                                {step.icon}
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
                        <p className="text-sm text-gray-600 max-w-xs">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
