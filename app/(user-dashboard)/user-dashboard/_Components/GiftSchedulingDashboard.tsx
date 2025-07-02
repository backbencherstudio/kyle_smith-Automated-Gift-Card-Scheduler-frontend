"use client"
import React, { useEffect, useState } from 'react'
import GiftSchedulingCalender from './GiftSchedulingCalender';
import Link from 'next/link';
import { getSchedulesUserData } from '@/apis/userDashboardApis';

interface ScheduleUserData {
    name: string;
    birthday_display: string;
    delivery_status: string;
    isUpcoming: boolean;
    email: string;
    birthday_full: string;
    address: string;
}

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    extendedProps: {
        name: string;
        email: string;
        address: string;
        type: string;
        avatar: string;
        color: string;
        birthday: string;
        birthday_full: string;
    };
}

export default function GiftSchedulingDashboard() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchScheduleData();
    }, []);

    const fetchScheduleData = async () => {
        try {
            setLoading(true);
            const response = await getSchedulesUserData();
            if (response.success && response.data) {
                const colors = [
                    '#fef2f2', // Light red
                    '#f0fdf4', // Light green
                    '#f5f3ff', // Light purple
                    '#fff7ed', // Light orange
                    '#fdf2f8', // Light pink
                    '#f0f9ff', // Light blue
                    '#fefce8', // Light yellow
                    '#f1f5f9', // Light gray
                ];

                const calendarEvents = response.data.flatMap((user: ScheduleUserData, index: number) => {
                    // Convert birthday_display (MM-DD) to dates for all years
                    const [monthStr, dayStr] = user.birthday_display.split('-');
                    const month = parseInt(monthStr) - 1;
                    const day = parseInt(dayStr);
                    const currentYear = new Date().getFullYear();

                    // Create events for past 10 years and next 10 years (total 21 years)
                    const events = [];
                    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
                        // Create date using local timezone to avoid conversion issues
                        const birthdayDate = new Date(year, month, day, 12, 0, 0); // Use noon to avoid timezone issues
                        const formattedDate = birthdayDate.toISOString().split('T')[0];
                        const colorIndex = user.name.length % colors.length;
                        const eventColor = colors[colorIndex];
                        events.push({
                            id: `schedule-${index}-${year}`,
                            title: `${user.name} - Birthday`,
                            start: formattedDate,
                            extendedProps: {
                                name: user.name,
                                email: user.email,
                                address: user.address,
                                type: "Birthday",
                                avatar: '',
                                color: eventColor,
                                birthday: formattedDate,
                                birthday_full: user.birthday_full
                            },
                        });
                    }

                    return events;
                });
                setEvents(calendarEvents);
            }
        } catch (error) {
            console.error('Error fetching schedule data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calendarConfig = {
        visibleWeeks: 3,
        eventDisplay: {
            showAvatar: true,
            showEventType: true,
            compactView: false
        },
        height: "auto",
        contentHeight: 400,
        dayMaxEvents: 2,
        view: {
            type: "customThreeWeeks",
            duration: { weeks: 3 }
        },
        useCustomRange: true
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Gift Scheduling</h2>
                    </div>
                    <Link href="/user-dashboard/gift-scheduling" className="text-[#1E1E1E] border  px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
                        <span>View all</span>
                    </Link>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading schedule data...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Gift Scheduling</h2>
                </div>

                <Link href="/user-dashboard/gift-scheduling" className="text-[#1E1E1E] border  px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
                    <span>View all</span>
                </Link>
            </div>
   
                <GiftSchedulingCalender
                    config={calendarConfig}
                    events={events}
                />
           
        </div>
    )
}
