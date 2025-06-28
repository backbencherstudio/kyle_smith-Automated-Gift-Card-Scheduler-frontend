"use client";

import React from "react";
import ContactList from "./_Components/ContactList";
import GiftSchedulingDashboard from "./_Components/GiftSchedulingDashboard";
import UpcomingBirthday from "./upcoming-birthday/page";
import { useAuth } from "@/contexts/AuthContext";

const stats = [
    { title: "Total contact", value: 100 },
    { title: "Upcoming Event", value: 10 },
    { title: "Gift card Send", value: 5 },
];

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-[#232323] mb-2">Dashboard</h1>
                {user && (
                    <p className="text-lg text-[#4A4C56]">
                        Welcome back, <span className="font-semibold text-[#1D1F2C]">{user.name}</span>! 👋
                    </p>
                )}
            </div>
            
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

                    {/* Gift Scheduling */}
                    <GiftSchedulingDashboard />
                </div>
                <ContactList /> 
            </div>
            <UpcomingBirthday />
        </>
    );
}
