'use client'
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Image from "next/image";
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useForm } from "react-hook-form";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import UserListModal from "./UserListModal";
import GiftModal from "./GiftModal";

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    extendedProps: {
        name: string;
        type: string;
        avatar: string;
        color?: string;
        birthday?: string;
    };
}

interface CalendarConfig {
    visibleWeeks?: number;
    eventDisplay?: {
        showAvatar?: boolean;
        showEventType?: boolean;
        compactView?: boolean;
    };
    height?: string | number;
    contentHeight?: number;
    dayMaxEvents?: number;
    view?: {
        type: string;
        duration: { weeks: number }
    };
    visibleRange?: (currentDate: Date) => { start: Date; end: Date };
}

interface GiftSchedulingCalenderProps {
    config?: CalendarConfig;
    events: CalendarEvent[];
}

const EVENT_TYPE_COLORS = {
    'Sunday': {
        background: '#fef2f2',
        border: '#fca5a5'
    },
    'Monday': {
        background: '#f0fdf4',
        border: '#86efac'
    },
    'Tuesday': {
        background: '#f5f3ff',
        border: '#c4b5fd'
    },
    'Wednesday': {
        background: '#fff7ed',
        border: '#fdba74'
    },
    'Thursday': {
        background: '#fdf2f8',
        border: '#f9a8d4'
    },
    'Friday': {
        background: '#f0f9ff',
        border: '#7dd3fc'
    },
    'Saturday': {
        background: '#fefce8',
        border: '#fde047'
    }
};

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function GiftSchedulingCalender({ config = {}, events }: GiftSchedulingCalenderProps) {
    const {
        visibleWeeks = 6,
        eventDisplay = {
            showAvatar: true,
            showEventType: true,
            compactView: false
        },
        height = "auto",
        contentHeight = 800,
        dayMaxEvents = 3,
        view = {
            type: "dayGridMonth",
            duration: { weeks: 6 }
        },
        visibleRange
    } = config;

    const [selectedUser, setSelectedUser] = useState(null);
    const [userListModal, setUserListModal] = useState(null);
    const [dateRange, setDateRange] = useState("");
    const [calendarApi, setCalendarApi] = useState(null);
    const [currentViewDate, setCurrentViewDate] = useState(new Date());
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const {
        control,
        formState: { errors },
    } = useForm();

    // Group events by date
    const eventsByDate = events.reduce((acc, event) => {
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
                isMultiple: eventsForDate.length > 1,
                eventColor: firstEvent.extendedProps.color
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

    const handleUserSelect = (user, event) => {
        setUserListModal(null);
        setSelectedUser({
            ...user,
            start: event.start,
            birthday: user.birthday || event.start
        });
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
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

        // Update currentViewDate to reflect the current calendar view
        setCurrentViewDate(startDate);

        // Handle event styling
        const eventDates = Object.keys(eventsByDate);
        setTimeout(() => {
            eventDates.forEach(dateStr => {
                const dateEl = document.querySelector(`[data-date="${dateStr}"]`);
                if (dateEl) {
                    const date = new Date(dateStr);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                    dateEl.classList.add('has-events');
                    dateEl.setAttribute('data-day-name', dayName);
                }
            });
        }, 100);

        // Limit visible weeks if specified
        if (visibleWeeks < 6) {
            const calendarEl = document.querySelector('.fc-view-harness');
            if (calendarEl) {
                const rows = calendarEl.querySelectorAll('.fc-row');
                rows.forEach((row, index) => {
                    if (index >= visibleWeeks) {
                        (row as HTMLElement).style.display = 'none';
                    }
                });
            }
        }
    };

    const customRenderEventContent = (eventInfo) => {
        const { events, isMultiple } = eventInfo.event.extendedProps;

        if (isMultiple) {
            const visibleEvents = events.slice(0, 2);
            const remainingCount = events.length - 2;

            return (
                <div className="flex flex-col items-center 2xl:flex-row space-x-1 p-1 cursor-pointer">
                    <div className="flex -space-x-1">
                        {visibleEvents.map((event, index) => (
                            event.extendedProps.avatar && event.extendedProps.avatar.trim() !== '' ? (
                                <Image
                                    width={24}
                                    height={24}
                                    key={event.id}
                                    src={event.extendedProps.avatar}
                                    alt={event.extendedProps.name}
                                    className="w-6 h-6 rounded-full border-2 border-white"
                                    style={{ zIndex: visibleEvents.length - index }}
                                />
                            ) : (
                                <div
                                    key={event.id}
                                    className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-gray-700"
                                    style={{ 
                                        zIndex: visibleEvents.length - index,
                                        backgroundColor: event.extendedProps.color || '#6b7280'
                                    }}
                                >
                                    {event.extendedProps.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                            )
                        ))}
                        {remainingCount > 0 && (
                            <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                                +{remainingCount}
                            </div>
                        )}
                    </div>
                    <div className="text-xs">
                        <p className="font-medium leading-4 text-gray-700">{events.length} Events</p>
                    </div>
                </div>
            );
        }

        const event = events[0];
        const { name, type, avatar, color } = event.extendedProps;

        return (
            <div className={`flex ${eventDisplay.compactView ? 'flex-row' : 'flex-col 2xl:flex-row'} items-center space-x-2 p-1 cursor-pointer`}>
                {avatar && avatar.trim() !== '' ? (
                    <Image width={24} height={24} src={avatar} alt={name} className="w-6 h-6 rounded-full" />
                ) : (
                    <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 border-2 border-white"
                        style={{ backgroundColor: color || '#6b7280' }}
                    >
                        {name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                )}
                <div className="text-xs text-wrap">
                    <p className="font-bold leading-4 text-gray-700">{name}</p>
                    {eventDisplay.showEventType && (
                        <p className="leading-4 text-gray-500 font-medium">{type}</p>
                    )}
                </div>
            </div>
        );
    };

    const handlePrevClick = () => {
        if (calendarApi) {
            // Move to previous month
            const currentDate = calendarApi.getDate();
            const newDate = new Date(currentDate);
            newDate.setMonth(currentDate.getMonth() - 1);
            calendarApi.gotoDate(newDate);
            setCurrentViewDate(newDate);
        }
    };

    const handleNextClick = () => {
        if (calendarApi) {
            // Move to next month
            const currentDate = calendarApi.getDate();
            const newDate = new Date(currentDate);
            newDate.setMonth(currentDate.getMonth() + 1);
            calendarApi.gotoDate(newDate);
            setCurrentViewDate(newDate);
        }
    };

    const handleMonthYearSelect = () => {
        if (calendarApi) {
            const newDate = new Date(selectedYear, selectedMonth, 1);
            calendarApi.gotoDate(newDate);
            setIsDatePickerOpen(false);
        }
    };

    // Generate years (current year - 10 to current year + 10)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

    // Apply colors to events after calendar renders
    useEffect(() => {
        if (calendarEvents.length > 0) {
            setTimeout(() => {
                calendarEvents.forEach((event) => {
                    const eventElement = document.querySelector(`[data-event-id="${event.id}"]`);
                    if (eventElement) {
                        const eventColor = event.extendedProps.eventColor || '#fef2f2';
                        (eventElement as HTMLElement).style.backgroundColor = eventColor;
                        (eventElement as HTMLElement).style.borderColor = eventColor;
                    }
                });
            }, 100);
        }
    }, [calendarEvents]);

    return (
        <div >

            <div className="overflow-x-auto">
                <div className="calendar-container w-full">
                    <div className="flex justify-between items-center mb-4">
                        <div className="inline-flex items-center gap-4 px-4 py-2 rounded-lg">
                            <button
                                onClick={handlePrevClick}
                                className="text-gray-600 hover:text-gray-900 border px-2 py-1 rounded-lg"
                            >
                                <FaChevronLeft className="text-lg" />
                            </button>

                            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                                <PopoverTrigger asChild>
                                    <button className="text-sm font-medium hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">
                                        {currentViewDate.toLocaleDateString('en-US', {
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-4" align="center">
                                    <div className="space-y-4">
                                        <div className="text-sm font-medium text-gray-700">Select Month & Year</div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs text-gray-600">Month</label>
                                                <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {MONTHS.map((month, index) => (
                                                            <SelectItem key={index} value={index.toString()}>
                                                                {month}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-gray-600">Year</label>
                                                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {years.map((year) => (
                                                            <SelectItem key={year} value={year.toString()}>
                                                                {year}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsDatePickerOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={handleMonthYearSelect}
                                            >
                                                Go
                                            </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <button
                                onClick={handleNextClick}
                                className="text-gray-600 hover:text-gray-900 border px-2 py-1 rounded-lg"
                            >
                                <FaChevronRight className="text-lg" />
                            </button>
                        </div>
                        {dateRange && <span className="text-sm text-gray-600">{dateRange}</span>}
                    </div>
                    <FullCalendar
                        ref={(el) => setCalendarApi(el?.getApi())}
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView={view.type}
                        views={{
                            customThreeWeeks: {
                                type: "dayGrid",
                                duration: view.duration,
                                buttonText: `${view.duration.weeks} Weeks`
                            }
                        }}
                        visibleRange={visibleRange}
                        events={calendarEvents}
                        eventContent={customRenderEventContent}
                        eventClick={handleEventClick}
                        height={height}
                        contentHeight={contentHeight}
                        headerToolbar={false}
                        datesSet={handleDatesSet}
                        dayMaxEvents={dayMaxEvents}
                    />
                </div>
            </div>

            {/* User List Modal */}
            <UserListModal
                isOpen={!!userListModal}
                onClose={() => setUserListModal(null)}
                date={userListModal?.date || ''}
                events={userListModal?.events || []}
                onUserSelect={handleUserSelect}
            />

            {/* Gift Setting Modal */}
            <GiftModal
                isOpen={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                selectedUser={selectedUser}
                onSubmit={handleSubmit}
            />

            <style jsx>{`
.calendar-container button {
    font-size: 24px;
    padding: 0 8px;
    cursor: pointer;
    background: none;
    border: none;
    outline: none;
}

.calendar-container button:hover {
    color: #000;
}

.calendar-container .fc-button {
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

.calendar-container .fc-button:hover {
    background-color: #f3f4f6 !important;
    color: #111827 !important;
}

.calendar-container .fc-prev-button .fc-icon {
    font-size: 30px !important;
    font-weight: bold !important;
}

.calendar-container .fc-next-button .fc-icon {
    font-size: 30px !important;
    font-weight: bold !important;
}

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

.calendar-container :global(.fc-button-primary) {
    background: none !important;
    border: none !important;
    box-shadow: none !important;
}

.calendar-container :global(.fc-daygrid-day) {
    border: 1px solid #e5e7eb !important;
    position: relative !important;
    padding: 0 !important;
}

/* Make sure these styles have higher specificity */
.calendar-container :global(.fc-daygrid-day.has-events[data-day-name="Sunday"]) {
    background-color: #fef2f2 !important;
    outline: 2px solid #fca5a5 !important;
    outline-offset: -2px !important;
    border: none !important;
}

.calendar-container :global(.fc-daygrid-day.has-events[data-day-name="Monday"]) {
    background-color: #f0fdf4 !important;
    outline: 2px solid #86efac !important;
    outline-offset: -2px !important;
    border: none !important;
}

.calendar-container :global(.fc-daygrid-day.has-events[data-day-name="Tuesday"]) {
    background-color: #f5f3ff !important;
    outline: 2px solid #c4b5fd !important;
    outline-offset: -2px !important;
    border: none !important;
}

.calendar-container :global(.fc-daygrid-day.has-events[data-day-name="Wednesday"]) {
    background-color: #fff7ed !important;
    outline: 2px solid #fdba74 !important;
    outline-offset: -2px !important;
    border: none !important;
}

.calendar-container :global(.fc-daygrid-day.has-events[data-day-name="Thursday"]) {
    background-color: #fdf2f8 !important;
    outline: 2px solid #f9a8d4 !important;
    outline-offset: -2px !important;
    border: none !important;
}

.calendar-container :global(.fc-daygrid-day.has-events[data-day-name="Friday"]) {
    background-color: #f0f9ff !important;
    outline: 2px solid #7dd3fc !important;
    outline-offset: -2px !important;
    border: none !important;
}

.calendar-container :global(.fc-daygrid-day.has-events[data-day-name="Saturday"]) {
    background-color: #fefce8 !important;
    outline: 2px solid #fde047 !important;
    outline-offset: -2px !important;
    border: none !important;
}

/* Add z-index to ensure proper layering */
.calendar-container :global(.fc-daygrid-day-frame) {
    position: relative !important;
    z-index: 1 !important;
}

.calendar-container :global(.fc-daygrid-day-events) {
    position: relative !important;
    z-index: 2 !important;
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

.calendar-container :global(.fc-event),
.calendar-container :global(.fc-event-main),
.calendar-container :global(.fc-event-title),
.calendar-container :global(.fc-daygrid-event) {
    cursor: pointer !important;
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

${Object.entries(EVENT_TYPE_COLORS).map(([day, colors]) => `
.calendar-container :global(.fc-daygrid-day.has-events[data-day-name="${day}"]) {
    background-color: ${colors.background} !important;
    outline: 2px solid ${colors.border} !important;
    outline-offset: -2px !important;
    border: none !important;
    z-index: 2 !important;
}
`).join('\n')}

.custom-event {
    background-color: var(--event-bg-color) !important;
    border-color: var(--event-border-color) !important;
    color: #000 !important;
}

.fc-event, .fc-event-main, .fc-event-main-frame, .fc-event-title {
    background-color: #fff !important;
}

/* Apply colors to specific event classes */
.event-color-cmchav17f0011ua4s3inlqq3r {
    background-color: #fef2f2 !important;
    border-color: #fef2f2 !important;
}

.event-color-cmchaun9b000zua4spuj1on6p {
    background-color: #f0fdf4 !important;
    border-color: #f0fdf4 !important;
}

.event-color-cmchag9it000hua4scmwadhcq {
    background-color: #f5f3ff !important;
    border-color: #f5f3ff !important;
}
`}</style>
        </div>
    );
}