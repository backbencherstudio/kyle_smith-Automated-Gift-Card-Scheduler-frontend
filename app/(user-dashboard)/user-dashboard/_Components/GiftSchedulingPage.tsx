"use client"
import React, { useEffect, useState } from 'react'
import GiftSchedulingCalender from './GiftSchedulingCalender';
import { getContacts } from '@/apis/userDashboardApis';

interface Contact {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    birthday_date?: string;
    address: string;
    created_at: string;
    updated_at: string;
}

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    extendedProps: {
        name: string;
        type: string;
        avatar: string;
        color: string;
        birthday: string;
    };
}

export default function GiftSchedulingPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await getContacts();
            if (response.success && response.data) {
                const contactsWithBirthdays = response.data.filter((contact: any) => contact.birthday_date);
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
                const calendarEvents = contactsWithBirthdays.map((contact: any) => {
                    const birthday = new Date(contact.birthday_date);
                    const formattedDate = birthday.toISOString().split('T')[0];
                    const colorIndex = contact.name.length % colors.length;
                    const eventColor = colors[colorIndex];
                    const avatar = contact.avatar || '';
                    return {
                        id: contact.id,
                        title: `${contact.name} - Birthday`,
                        start: formattedDate,
                        extendedProps: {
                            name: contact.name,
                            type: "Birthday",
                            avatar: avatar,
                            color: eventColor,
                            birthday: formattedDate
                        },
                    };
                });
                setEvents(calendarEvents);
            }
        } catch (error) {
            // Optionally handle error
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
                <div className="text-lg">Loading contacts...</div>
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
                        No birthday events found. Please add contacts with birthday dates.
                    </div>
                )}
            </div>
        </>
    )
}
