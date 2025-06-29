import React from 'react'
import GiftSchedulingCalender from './GiftSchedulingCalender';
const mockEvents = [
    {
        id: "1",
        title: "Eleanor Pena - Birthday",
        start: "2025-06-29",
        extendedProps: {
            name: "Eleanor Pena",
            type: "Birthday",
            avatar: "https://i.pravatar.cc/150?u=eleanor",
            color: "#fef2f2",
            birthday: "2025-06-29"
        },
    },
    {
        id: "2",
        title: "Jenny Wilson - Birthday",
        start: "2025-06-29",
        extendedProps: {
            name: "Jenny Wilson",
            type: "Birthday",
            avatar: "https://i.pravatar.cc/150?u=jenny",
            birthday: "2025-06-29"
        },
    },
    {
        id: "3",
        title: "Jenny Wilson - Birthday",
        start: "2025-06-25",
        extendedProps: {
            name: "John Doe",
            type: "Birthday",
            avatar: "https://i.pravatar.cc/150?u=jenny",
            birthday: "2025-06-25"
        },
    },
    {
        id: "4",
        title: "Jenny Wilson - Birthday",
        start: "2025-06-30",
        extendedProps: {
            name: "John Doe",
            type: "Birthday",
            avatar: "https://i.pravatar.cc/150?u=jenny",
            birthday: "2025-06-30"
        },
    },
    {
        id: "5",
        title: "Jenny Wilson - Birthday",
        start: "2025-06-09",
        extendedProps: {
            name: "John Doe",
            type: "Birthday",
            avatar: "https://i.pravatar.cc/150?u=jenny",
            birthday: "2025-06-09"
        },
    },
];
export default function GiftSchedulingPage() {

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
    return (
        <>
            <h1 className='text-3xl font-bold text-[#232323]'>Gift Scheduling</h1>
            <div className="bg-white rounded-lg p-4 mt-5">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Gift Scheduling</h2>
                </div>
                <GiftSchedulingCalender
                    config={calendarConfig}
                    events={mockEvents}
                />
            </div>
        </>

    )
}
