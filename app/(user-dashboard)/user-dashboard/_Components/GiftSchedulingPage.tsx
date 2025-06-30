"use client"
import React, { useEffect, useState } from 'react'
import GiftSchedulingCalender from './GiftSchedulingCalender';
import { getSchedulesUserData } from '@/apis/userDashboardApis';

interface ScheduleUserData {
    name: string;
    birthday_display: string;
    delivery_status: string;
    isUpcoming: boolean;
    email: string;
    birthday_full: string;
}

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    extendedProps: {
        name: string;
        email: string;
        type: string;
        avatar: string;
        color: string;
        birthday: string;
        birthday_full: string;
    };
}

export default function GiftSchedulingPage() {
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
                    const month = parseInt(monthStr) - 1; // JavaScript months are 0-indexed
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
                        
                        console.log(`User: ${user.name}, Birthday Display: ${user.birthday_display}, Year: ${year}, Month: ${month + 1}, Day: ${day}, Formatted Date: ${formattedDate}`);
                        
                        events.push({
                            id: `schedule-${index}-${year}`,
                            title: `${user.name} - Birthday`,
                            start: formattedDate,
                            extendedProps: {
                                name: user.name,
                                email: user.email,
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
        visibleWeeks: 6,
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
            duration: { weeks: 6 }
        },
        useCustomRange: true
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading schedule data...</div>
            </div>
        );
    }

    return (
        <>
            <h1 className='text-3xl font-bold text-[#232323]'>Gift Scheduling</h1>
            <div className="bg-white rounded-lg p-4 mt-5">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Gift Scheduling</h2>
                </div>
                {events.length > 0 ? (
                    <GiftSchedulingCalender
                        config={calendarConfig}
                        events={events}
                    />
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No birthday events found. Please add schedule data with birthday dates.
                    </div>
                )}
            </div>
        </>
    )
}
