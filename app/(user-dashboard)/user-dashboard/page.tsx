
import React from "react";
import { FaChevronDown } from "react-icons/fa";
import ContactList from "./_Components/ContactList";
import GiftSchedulingDashboard from "./_Components/GiftSchedulingDashboard";

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
                <div className="p-4 bg-white rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Gift Scheduling</h2>
                        </div>

                        <button className="text-[#1E1E1E] border  px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
                            <span>View all</span>
                            <FaChevronDown />
                        </button>
                    </div>
                    <GiftSchedulingDashboard />
                </div>
            </div>
            <ContactList />
        </div>
    );
}
