'use client'
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const mockEvents = [
    {
        id: "1",
        title: "Eleanor Pena - Birthday",
        start: "2025-05-02",
        extendedProps: {
            name: "Eleanor Pena",
            type: "Birthday",
            avatar: "https://i.pravatar.cc/150?u=eleanor",
            color: "#FEE2E2",
        },
    },
    {
        id: "2",
        title: "Jenny Wilson - Birthday",
        start: "2025-05-02",
        extendedProps: {
            name: "Jenny Wilson",
            type: "Birthday",
            avatar: "https://i.pravatar.cc/150?u=jenny",
            color: "#FEE2E2",
        },
    },
    {
        id: "3",
        title: "Esther Howard - Christmas",
        start: "2025-05-08",
        extendedProps: {
            name: "Esther Howard",
            type: "Christmas",
            avatar: "https://i.pravatar.cc/150?u=esther",
            color: "#DCFCE7",
        },
    },
    {
        id: "4",
        title: "Wade Warren - Marriage Ceremony",
        start: "2025-05-10",
        extendedProps: {
            name: "Wade Warren",
            type: "Marriage Ceremony",
            avatar: "https://i.pravatar.cc/150?u=wade",
            color: "#EDE9FE",
        },
    },
    {
        id: "5",
        title: "Marvin McKinney - Birthday",
        start: "2025-05-10",
        extendedProps: {
            name: "Marvin McKinney",
            type: "Birthday",
            avatar: "https://i.pravatar.cc/150?u=marvin",
            color: "#FEE2E2",
        },
    },
];

export default function WeeklyGiftCalendar() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [userListModal, setUserListModal] = useState(null);
    const [dateRange, setDateRange] = useState("");

    // Group events by date
    const eventsByDate = mockEvents.reduce((acc, event) => {
        const date = event.start;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(event);
        return acc;
    }, {});

    // Create events for calendar (one per date with multiple users)
    const calendarEvents = Object.keys(eventsByDate).map(date => {
        const eventsForDate = eventsByDate[date];
        const firstEvent = eventsForDate[0];

        return {
            id: `date-${date}`,
            title: eventsForDate.length > 1
                ? `${eventsForDate.length} Events`
                : `${firstEvent.extendedProps.name} - ${firstEvent.extendedProps.type}`,
            start: date,
            extendedProps: {
                events: eventsForDate,
                date: date,
                isMultiple: eventsForDate.length > 1
            }
        };
    });

    const handleEventClick = (clickInfo) => {
        const { events, isMultiple } = clickInfo.event.extendedProps;

        if (isMultiple) {
            setUserListModal({ date: clickInfo.event.start, events });
        } else {
            setSelectedUser(events[0].extendedProps);
        }
    };

    const handleUserSelect = (user) => {
        setUserListModal(null);
        setSelectedUser(user);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSelectedUser(null);
    };

    const handleDatesSet = (dateInfo) => {
        const startDate = new Date(dateInfo.start);
        const endDate = new Date(dateInfo.end);

        endDate.setDate(endDate.getDate() - 1);

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = date.toLocaleDateString('en-US', { month: 'short' });
            return `${day} ${month}`;
        };

        const startFormatted = formatDate(startDate);
        const endFormatted = formatDate(endDate);
        const year = endDate.getFullYear();

        setDateRange(`Showing ${startFormatted} - ${endFormatted} ${year}`);

        // Handle event styling
        const eventDates = Object.keys(eventsByDate);
        setTimeout(() => {
            eventDates.forEach(dateStr => {
                const dateEl = document.querySelector(`[data-date="${dateStr}"]`);
                if (dateEl) {
                    const dayOfWeek = new Date(dateStr).getDay();
                    dateEl.classList.add('has-events');
                    dateEl.classList.add(`day-${dayOfWeek}`);
                }
            });
        }, 100);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Gift Scheduling</h2>
                {dateRange && <span className="text-sm text-gray-600">{dateRange}</span>}
            </div>
            <div className="overflow-x-auto">
                <div className="calendar-container w-full">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={calendarEvents.map((event) => ({
                            ...event,
                            display: 'block',
                            backgroundColor: event.extendedProps.isMultiple ? '#F3F4F6' : event.extendedProps.events[0].extendedProps.color,
                            borderColor: event.extendedProps.isMultiple ? '#9CA3AF' : event.extendedProps.events[0].extendedProps.color,
                            textColor: '#000',
                        }))}
                        eventContent={renderEventContent}
                        eventClick={handleEventClick}
                        height="auto"
                        headerToolbar={{
                            left: "prev title next",
                            center: "",
                            right: "",
                        }}
                        datesSet={handleDatesSet}
                    />
                </div>
            </div>

            {/* User List Modal */}
            {userListModal && (
                <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Select User for Gift ({new Date(userListModal.date).toLocaleDateString()})</h3>
                        </div>
                        <div className="space-y-3">
                            {userListModal.events.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleUserSelect(event.extendedProps)}
                                >
                                    <img
                                        src={event.extendedProps.avatar}
                                        alt={event.extendedProps.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900">{event.extendedProps.name}</p>
                                        <p className="text-sm text-gray-500">{event.extendedProps.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setUserListModal(null)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Gift Setting Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Set Gift for {selectedUser.name}</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <input disabled value={selectedUser.name} className="border p-2 rounded bg-gray-50" />
                                <input placeholder="Address" className="border p-2 rounded" />
                                <input type="email" placeholder="Email" className="border p-2 rounded" />
                                <input type="date" className="border p-2 rounded" />
                            </div>
                            <select className="w-full border p-2 rounded">
                                <option>Amazon Gift Card - $50</option>
                                <option>Steam Wallet - $25</option>
                            </select>
                            <textarea placeholder="Message (Optional)" className="w-full border p-2 rounded" rows={3} />
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="notify" />
                                <label htmlFor="notify">Notify me on delivery</label>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Set Gift
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
.calendar-container :global(.fc-toolbar) {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    margin-bottom: 1rem !important;
    width: 100% !important;
}
.calendar-container :global(.fc-toolbar-title) {
    font-size: 1.125rem !important;
    font-weight: 500 !important;
    color: #374151 !important;
    margin: 0 !important;
}
.calendar-container :global(.fc-toolbar-chunk) {
    display: flex !important;
    align-items: center !important;
    gap: 15px !important;
}

.calendar-container :global(.fc-button) {
    background: none !important;
    border: none !important;
    color: #374151 !important;
    font-size: 18px !important;
    padding: 8px !important;
    cursor: pointer !important;
    border-radius: 4px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 32px !important;
    height: 32px !important;
}

.calendar-container :global(.fc-button:hover) {
    background-color: #f3f4f6 !important;
    color: #111827 !important;
}

.calendar-container :global(.fc-button-primary) {
    background: none !important;
    border: none !important;
    box-shadow: none !important;
}

.calendar-container :global(.fc-prev-button):before {
    content: "‹" !important;
    font-size: 30px !important;
    font-weight: bold !important;
}

.calendar-container :global(.fc-next-button):before {
    content: "›" !important;
    font-size: 30px !important;
    font-weight: bold !important;
}

.calendar-container :global(.fc-button .fc-icon) {
    display: none !important;
}

.calendar-container :global(.fc-daygrid-day) {
    border: 1px solid #e5e7eb !important;
    background-color: white !important;
    position: relative;
}

.calendar-container :global(.fc-daygrid-day.has-events.day-0) {
    background-color: #fef2f2 !important;
    border: 2px solid #fecaca !important;
}

.calendar-container :global(.fc-daygrid-day.has-events.day-1) {
    background-color: #eff6ff !important;
    border: 2px solid #bfdbfe !important;
}

.calendar-container :global(.fc-daygrid-day.has-events.day-2) {
    background-color: #f0fdf4 !important;
    border: 2px solid #bbf7d0 !important;
}

.calendar-container :global(.fc-daygrid-day.has-events.day-3) {
    background-color: #fefce8 !important;
    border: 2px solid #fde047 !important;
}

.calendar-container :global(.fc-daygrid-day.has-events.day-4) {
    background-color: #faf5ff !important;
    border: 2px solid #d8b4fe !important;
}

.calendar-container :global(.fc-daygrid-day.has-events.day-5) {
    background-color: #fdf2f8 !important;
    border: 2px solid #f9a8d4 !important;
}

.calendar-container :global(.fc-daygrid-day.has-events.day-6) {
    background-color: #fff7ed !important;
    border: 2px solid #fed7aa !important;
}

.calendar-container :global(.fc-daygrid-day-number) {
    color: #374151 !important;
    font-weight: 600 !important;
    padding: 4px 8px !important;
}

.calendar-container :global(.fc-col-header-cell) {
    background-color: #f9fafb !important;
    border: 2px solid #e5e7eb !important;
    font-weight: 600 !important;
    color: #374151 !important;
}

.calendar-container :global(.fc-event) {
    border-radius: 6px !important;
    margin: 2px !important;
}

.calendar-container :global(.fc-daygrid-day-frame) {
    min-height: 80px !important;
}

.calendar-container :global(.fc) {
    width: 100% !important;
    min-width: 600px !important;
}

.calendar-container :global(.fc-view-harness) {
    width: 100% !important;
}

@media (max-width: 1024px) {
    .calendar-container :global(.fc) {
        min-width: 500px !important;
    }
}
`}</style>
        </div>
    );
}

function renderEventContent(eventInfo) {
    const { events, isMultiple } = eventInfo.event.extendedProps;

    if (isMultiple) {
        const visibleEvents = events.slice(0, 2);
        const remainingCount = events.length - 2;

        return (
            <div className="flex items-center space-x-1 p-1 cursor-pointer">
                <div className="flex -space-x-1">
                    {visibleEvents.map((event, index) => (
                        <img
                            key={event.id}
                            src={event.extendedProps.avatar}
                            alt={event.extendedProps.name}
                            className="w-6 h-6 rounded-full border-2 border-white"
                            style={{ zIndex: visibleEvents.length - index }}
                        />
                    ))}
                    {remainingCount > 0 && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                            +{remainingCount}
                        </div>
                    )}
                </div>
                <div className="text-xs">
                    <p className="font-medium leading-4">{events.length} Events</p>
                </div>
            </div>
        );
    } else {
        const event = events[0];
        const { name, type, avatar } = event.extendedProps;

        return (
            <div className="flex items-center space-x-2 p-4 cursor-pointer">
                <img src={avatar} alt={name} className="w-6 h-6 rounded-full" />
                <div className="text-xs">
                    <p className="font-medium leading-4">{name}</p>
                    <p className="text-gray-500 leading-4">{type}</p>
                </div>
            </div>
        );
    }
}