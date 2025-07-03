"use client";

import React, { useEffect, useState } from "react";
import ContactList from "./_Components/ContactList";
import GiftSchedulingDashboard from "./_Components/GiftSchedulingDashboard";
import UpcomingBirthday from "./upcoming-birthday/page";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardData } from "@/apis/userDashboardApis";

interface DashboardData {
    totalContacts: number;
    totalUpcomingEvents: number;
    totalGiftCardsSent: number;
}

// Custom hook for dashboard data
const useDashboardData = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getDashboardData();

                if (response?.data) {
                    setData(response.data);
                } else if (response?.success === false) {
                    const errorMessage = typeof response.message === 'string'
                        ? response.message
                        : 'Failed to fetch dashboard data';
                    setError(errorMessage);
                } else {
                    setData(response as unknown as DashboardData);
                }
            } catch (err: any) {
                setError(err?.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

// Stat card component
const StatCard = ({ title, value, loading }: { title: string; value: number; loading: boolean }) => (
    <div className="bg-white py-8 rounded-lg px-6 flex flex-col gap-2">
        <p className="text-[#4A4C56] text-base font-medium">{title}</p>
        {loading ? (
            <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
        ) : (
            <h1 className="text-2xl font-bold text-[#1D1F2C]">{value}</h1>
        )}
    </div>
);

export default function Dashboard() {
    const { user } = useAuth();
    const { data: dashboardData, loading, error } = useDashboardData();

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
                        <StatCard
                            title="Total contact"
                            value={dashboardData?.totalContacts || 0}
                            loading={loading}
                        />
                        <StatCard
                            title="Upcoming Event"
                            value={dashboardData?.totalUpcomingEvents || 0}
                            loading={loading}
                        />
                        <StatCard
                            title="Gift card Send"
                            value={dashboardData?.totalGiftCardsSent || 0}
                            loading={loading}
                        />
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
