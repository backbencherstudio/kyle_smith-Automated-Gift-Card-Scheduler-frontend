
"use client";

import DynamicTableTwo from '@/app/(admin)/_component/common/DynamicTableTwo'
import React, { useEffect, useState } from 'react'

import { getSchedulesUserData } from '@/apis/userDashboardApis';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Function to format birthday date from MM-DD to "D Month" format
const formatBirthdayDate = (dateString: string) => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const [month, day] = dateString.split('-');
    const monthIndex = parseInt(month) - 1;
    const dayNumber = parseInt(day);

    return `${dayNumber} ${months[monthIndex]}`;
};

export default function MyGifts() {
    const [upcomingBirthdays, setUpcomingBirthdays] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { label: "Name", width: "25%", accessor: "name" },
        { label: "Email", width: "30%", accessor: "email" },
        { label: "Birthday Date", width: "25%", accessor: "birthdayDate" },
        { label: "Status", width: "20%", accessor: "delivery_status" },
    ];

    useEffect(() => {
        fetchUpcomingBirthdays();
    }, []);

    const fetchUpcomingBirthdays = async () => {
        try {
            setLoading(true);
            const response = await getSchedulesUserData();
            if (response.success && response.data) {
                const schedules = response.data;
                const processedData = schedules
                    .filter((schedule: any) => schedule.isUpcoming === true)
                    .map((schedule: any) => {
                        return {
                            ...schedule,
                            birthdayDate: formatBirthdayDate(schedule.birthday_display),
                            delivery_status: schedule.delivery_status === 'none' ? 'Upcoming' : schedule.delivery_status
                        };
                    })
                    .slice(0, 5);
                setUpcomingBirthdays(processedData);
            } else {
            }
        } catch (error) {
            console.error('UpcomingBirthday: Error fetching schedules user data:', error);
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
                    </button>
                </div>
                <div className="flex items-center justify-center h-32">
                    <div className="text-lg">Loading upcoming birthdays...</div>
                </div>
            </div>
        );
    }



    return (
        <div className="bg-white rounded-lg p-4 mt-10">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-[#232323]">My Gifts</h1>
                <div className="w-[300px] relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="text"
                        placeholder="Search..."
                        className="pl-9 w-full bg-gray-50"
                    // value={searchTerm}
                    // onChange={handleSearchChange}
                    />
                </div>
            </div>
            {upcomingBirthdays.length > 0 ? (
                <DynamicTableTwo
                    columns={columns}
                    data={upcomingBirthdays}
                    currentPage={1}
                    itemsPerPage={5}
                    onPageChange={(page) => console.log(page)}
                />
            ) : (
                <div className="text-center py-8 text-gray-500">
                    No upcoming birthdays found
                </div>
            )}
        </div>
    )
}
