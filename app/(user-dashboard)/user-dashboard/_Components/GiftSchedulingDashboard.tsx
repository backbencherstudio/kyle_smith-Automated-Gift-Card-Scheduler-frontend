import React from 'react'
import GiftSchedulingCalender from './GiftSchedulingCalender';
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
        <div>
            <GiftSchedulingCalender
                config={calendarConfig}
                events={mockEvents}
            />
        </div>
    )
}
