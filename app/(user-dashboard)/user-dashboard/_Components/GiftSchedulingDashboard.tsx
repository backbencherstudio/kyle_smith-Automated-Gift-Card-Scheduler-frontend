import React from 'react'
import GiftSchedulingCalender from './GiftSchedulingCalender';
import { FaChevronDown } from 'react-icons/fa';
const mockEvents = [
    {
        id: "1",
        title: "Eleanor Pena - Birthday",
        start: "2025-05-29",
        extendedProps: {
            name: "Eleanor Pena",
            type: "Birthday",
            avatar: "https://i.pravatar.cc/150?u=eleanor",
            color: "#fef2f2"
        },
    },
    {
        id: "2",
        title: "Jenny Wilson - Birthday",
        start: "2025-05-29",
        extendedProps: {
            name: "Jenny Wilson",
            type: "Birthday",
            avatar: "https://i.pravatar.cc/150?u=jenny",

        },
    },
    {
        id: "3",
        title: "Jenny Wilson - Birthday",
        start: "2025-05-25",
        extendedProps: {
            name: "John Doe",
            type: "Birthday",
            avatar: "https://i.pravatar.cc/150?u=jenny",

        },
    },
    {
        id: "4",
        title: "Jenny Wilson - Birthday",
        start: "2025-06-03",
        extendedProps: {
            name: "John Doe",
            type: "Birthday",
            avatar: "https://i.pravatar.cc/150?u=jenny",

        },
    },
    {
        id: "3",
        title: "Jenny Wilson - Birthday",
        start: "2025-06-09",
        extendedProps: {
            name: "John Doe",
            type: "Birthday",
            avatar: "https://i.pravatar.cc/150?u=jenny",

        },
    },
];
export default function GiftSchedulingDashboard() {

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

    return (
        <div className="bg-white rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Gift Scheduling</h2>
                </div>

                <button className="text-[#1E1E1E] border  px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
                    <span>View all</span>
                    <FaChevronDown />
                </button>
            </div>
            <GiftSchedulingCalender
                config={calendarConfig}
                events={mockEvents}
            />
        </div>
    )
}
