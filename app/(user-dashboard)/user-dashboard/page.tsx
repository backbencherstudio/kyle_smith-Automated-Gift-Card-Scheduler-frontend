"use client";

import React, { useEffect, useState } from "react";
import ContactList from "./_Components/ContactList";
import GiftSchedulingDashboard from "./_Components/GiftSchedulingDashboard";
import UpcomingBirthday from "./upcoming-birthday/page";
import { useAuth } from "@/contexts/AuthContext";
import { getContacts } from "@/apis/userDashboardApis";

interface StatItem {
    title: string;
    value: number;
}

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<StatItem[]>([
        { title: "Total contact", value: 0 },
        { title: "Upcoming Event", value: 0 },
        { title: "Gift card Send", value: 0 },
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await getContacts();
            
            if (response.success && response.data) {
                const contacts = response.data;
                const totalContacts = contacts.length;
                
                // Count contacts with birthdays as upcoming events
                const upcomingEvents = contacts.filter((contact: any) => contact.birthday_date).length;

                setStats([
                    { title: "Total contact", value: totalContacts },
                    { title: "Upcoming Event", value: upcomingEvents },
                    { title: "Gift card Send", value: 0 },
                ]);
            } else {
                setError("Failed to fetch dashboard data");
            }
        } catch (error) {
            setError("An error occurred while loading dashboard data");
        } finally {
            setLoading(false);
        }
    };

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
                <div className="flex-1 min-w-0 flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stats.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white py-8 rounded-lg px-4"
                            >
                                <p className="text-[#4A4C56] text-sm font-medium">{item.title}</p>
                                {loading ? (
                                    <div className="h-8 bg-gray-200 animate-pulse rounded mt-1"></div>
                                ) : (
                                    <p className="text-2xl text-[#1D1F2C] font-bold mt-1">{item.value}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <GiftSchedulingDashboard />
                </div>
                <ContactList /> 
            </div>
            <UpcomingBirthday />
        </>
    );
}
