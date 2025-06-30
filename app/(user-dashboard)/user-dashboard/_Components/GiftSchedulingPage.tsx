"use client"
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import GiftSchedulingCalender from './GiftSchedulingCalender';
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

// Constants
const EVENT_COLORS = [
    '#fef2f2', // Light red
    '#f0fdf4', // Light green
    '#f5f3ff', // Light purple
    '#fff7ed', // Light orange
    '#fdf2f8', // Light pink
    '#f0f9ff', // Light blue
    '#fefce8', // Light yellow
    '#f1f5f9', // Light gray
] as const;

const CALENDAR_CONFIG = {
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
} as const;

const YEARS_RANGE = 10; // Past and future years to generate

export default function GiftSchedulingPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Memoized function to generate calendar events
    const generateCalendarEvents = useCallback((users: ScheduleUserData[]): CalendarEvent[] => {
        const currentYear = new Date().getFullYear();
        
        return users.flatMap((user, index) => {
            // Parse birthday display (MM-DD format)
            const [monthStr, dayStr] = user.birthday_display.split('-');
            const month = parseInt(monthStr) - 1; // JavaScript months are 0-indexed
            const day = parseInt(dayStr);
            
            if (isNaN(month) || isNaN(day)) {
                console.warn(`Invalid birthday format for user ${user.name}: ${user.birthday_display}`);
                return [];
            }
            
            const events: CalendarEvent[] = [];
            const colorIndex = user.name.length % EVENT_COLORS.length;
            const eventColor = EVENT_COLORS[colorIndex];
            
            // Generate events for past and future years
            for (let year = currentYear - YEARS_RANGE; year <= currentYear + YEARS_RANGE; year++) {
                try {
                    // Create date using local timezone to avoid conversion issues
                    const birthdayDate = new Date(year, month, day, 12, 0, 0);
                    
                    // Validate the date
                    if (isNaN(birthdayDate.getTime())) {
                        console.warn(`Invalid date generated for ${user.name}: ${year}-${month + 1}-${day}`);
                        continue;
                    }
                    
                    const formattedDate = birthdayDate.toISOString().split('T')[0];
                    
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
                } catch (error) {
                    console.error(`Error generating event for ${user.name} in year ${year}:`, error);
                }
            }
            
            return events;
        });
    }, []);

    // Memoized calendar config
    const calendarConfig = useMemo(() => CALENDAR_CONFIG, []);

    const fetchScheduleData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await getSchedulesUserData();
            
            if (response.success && response.data) {
                const calendarEvents = generateCalendarEvents(response.data);
                setEvents(calendarEvents);
            } else {
                setError('Failed to fetch schedule data');
                setEvents([]);
            }
        } catch (error) {
            console.error('Error fetching schedule data:', error);
            setError('An error occurred while loading schedule data');
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, [generateCalendarEvents]);

    useEffect(() => {
        fetchScheduleData();
    }, [fetchScheduleData]);

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading schedule data...</div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <>
                <h1 className='text-3xl font-bold text-[#232323]'>Gift Scheduling</h1>
                <div className="bg-white rounded-lg p-4 mt-5">
                    <div className="text-center py-8">
                        <div className="text-red-500 mb-4">{error}</div>
                        <button 
                            onClick={fetchScheduleData}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </>
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
