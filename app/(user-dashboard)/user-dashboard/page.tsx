// app/components/Dashboard.tsx
import React from "react";
import { FaPlus } from "react-icons/fa";
import GiftSchedulingCalender from "./_Components/GiftSchedulingCalender";
import ContactList from "./_Components/ContactList";

const stats = [
    { title: "Total contact", value: 100 },
    { title: "Upcoming Event", value: 10 },
    { title: "Gift card Send", value: 5 },
];



export default function Dashboard() {
    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Left side (Stats + Calendar) */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white py-8 rounded-lg px-4"
                        >
                            <p className="text-[#4A4C56] text-sm font-medium">{item.title}</p>
                            <p className="text-2xl text-[#1D1F2C] font-bold mt-1">{item.value}</p>
                        </div>
                    ))}
                </div>
                {/* Calendar Section */}
                <GiftSchedulingCalender />
            </div>

            {/* Right side: Contact List */}
            <ContactList />
        </div>
    );
}
