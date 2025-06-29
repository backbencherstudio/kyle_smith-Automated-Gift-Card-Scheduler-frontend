"use client";

import DynamicTableTwo from '@/app/(admin)/_component/common/DynamicTableTwo'
import React, { useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa';
import { getContacts } from '@/apis/userDashboardApis';

export default function UpcomingBirthday() {
    const [upcomingBirthdays, setUpcomingBirthdays] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { label: "Name", width: "20%", accessor: "name" },
        { label: "Email", width: "25%", accessor: "email" },
        { label: "Birthday Date", width: "20%", accessor: "birthdayDate" },
        { label: "Days Until", width: "15%", accessor: "daysUntil" },
        { label: "Status", width: "20%", accessor: "status" },
    ];

    useEffect(() => {
        fetchUpcomingBirthdays();
    }, []);

    const fetchUpcomingBirthdays = async () => {
        try {
            setLoading(true);
            console.log('UpcomingBirthday: Fetching contacts...');
            const response = await getContacts();
            console.log('UpcomingBirthday: API Response:', response);
            
            if (response.success && response.data) {
                console.log('UpcomingBirthday: Contacts data:', response.data);
                const contacts = response.data;
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Reset time to start of day
                
                // Filter contacts with birthdays and calculate upcoming ones
                const contactsWithBirthdays = contacts.filter((contact: any) => contact.birthday_date);
                console.log('UpcomingBirthday: Contacts with birthdays:', contactsWithBirthdays);
                
                const upcoming = contactsWithBirthdays.map((contact: any) => {
                    // Use the original birthday date directly
                    const birthday = new Date(contact.birthday_date);
                    const formattedDate = birthday.toISOString().split('T')[0];
                    
                    // Calculate days until birthday
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const birthdayDate = new Date(formattedDate);
                    birthdayDate.setHours(0, 0, 0, 0);
                    
                    const daysUntil = Math.ceil((birthdayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    
                    const result = {
                        ...contact,
                        birthdayDate: birthday.toLocaleDateString('en-US', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                        }),
                        daysUntil: daysUntil,
                        status: daysUntil <= 7 ? 'Upcoming' : 'Scheduled'
                    };
                    console.log('UpcomingBirthday: Processed contact:', result);
                    return result;
                });
                
                // Show all upcoming birthdays (no 30-day filter for now)
                const sortedUpcoming = upcoming.sort((a: any, b: any) => a.daysUntil - b.daysUntil);
                console.log('UpcomingBirthday: Final sorted upcoming:', sortedUpcoming);
                
                setUpcomingBirthdays(sortedUpcoming);
            } else {
                console.log('UpcomingBirthday: API response not successful or no data');
            }
        } catch (error) {
            console.error('UpcomingBirthday: Error fetching upcoming birthdays:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg p-4 mt-10">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold text-[#232323]">Upcoming Birthday</h1>
                    <button className="text-[#1E1E1E] border px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
                        <span>View all</span>
                        <FaChevronDown />
                    </button>
                </div>
                <div className="flex items-center justify-center h-32">
                    <div className="text-lg">Loading upcoming birthdays...</div>
                </div>
            </div>
        );
    }

    console.log('UpcomingBirthday: Rendering with data:', upcomingBirthdays);

    return (
        <div className="bg-white rounded-lg p-4 mt-10">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-[#232323]">Upcoming Birthday</h1>
                <button className="text-[#1E1E1E] border  px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
                    <span>View all</span>
                    <FaChevronDown />
                </button>
            </div>
            {upcomingBirthdays.length > 0 ? (
                <DynamicTableTwo
                    columns={columns}
                    data={upcomingBirthdays}
                    currentPage={1}
                    itemsPerPage={10}
                    onPageChange={(page) => console.log(page)}
                />
            ) : (
                <div className="text-center py-8 text-gray-500">
                    No upcoming birthdays in the next 30 days
                </div>
            )}
        </div>
    )
}
