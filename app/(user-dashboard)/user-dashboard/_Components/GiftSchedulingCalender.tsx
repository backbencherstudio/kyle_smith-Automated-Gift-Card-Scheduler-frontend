'use client'
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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
import { useForm, Controller } from "react-hook-form";

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    extendedProps: {
        name: string;
        type: string;
        avatar: string;
        color?: string;
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
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

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

    const handleUserSelect = (user, event) => {
        setUserListModal(null);
        setSelectedUser({
            ...user,
            start: event.start
        });
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
                <div className="flex flex-col 2xl:flex-row space-x-1 p-1 cursor-pointer">
                    {eventDisplay.showAvatar && (
                        <div className="flex -space-x-1">
                            {visibleEvents.map((event, index) => (
                                <Image
                                    width={24}
                                    height={24}
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
                    )}
                    <div className="text-xs">
                        <p className="font-medium leading-4">{events.length} Events</p>
                    </div>
                </div>
            );
        }

        const event = events[0];
        const { name, type, avatar } = event.extendedProps;

        return (
            <div className={`flex ${eventDisplay.compactView ? 'flex-row' : 'flex-col 2xl:flex-row'} items-center space-x-2 p-1 cursor-pointer`}>
                {eventDisplay.showAvatar && (
                    <Image width={24} height={24} src={avatar} alt={name} className="w-6 h-6 rounded-full" />
                )}
                <div className="text-xs text-wrap">
                    <p className="font-medium leading-4">{name}</p>
                    {eventDisplay.showEventType && (
                        <p className="text-gray-500 leading-4">{type}</p>
                    )}
                </div>
            </div>
        );
    };

    const handlePrevClick = () => {
        if (calendarApi) {
            calendarApi.prev();
        }
    };

    const handleNextClick = () => {
        if (calendarApi) {
            calendarApi.next();
        }
    };

    return (
        <div >

            <div className="overflow-x-auto">
                <div className="calendar-container w-full">
                    <div className="flex justify-between items-center mb-4">
                        <div className="inline-flex items-center gap-4 px-4 py-2 rounded-lg">
                            <button
                                onClick={handlePrevClick}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ‹
                            </button>
                            <span className="text-sm font-medium">May 2025</span>
                            <button
                                onClick={handleNextClick}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ›
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
                        events={calendarEvents.map((event) => ({
                            ...event,
                            display: 'block',
                            backgroundColor: event.extendedProps.isMultiple ? '#F3F4F6' : event.extendedProps.events[0].extendedProps.color,
                            borderColor: event.extendedProps.isMultiple ? '#9CA3AF' : event.extendedProps.events[0].extendedProps.color,
                            textColor: '#000',
                        }))}
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
                                    onClick={() => handleUserSelect(event.extendedProps, event)}
                                >
                                    <Image
                                        width={48}
                                        height={48}
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
                <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
                    <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                            <DialogTitle>Set Gift</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 border-t border-gray-200 pt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600">Name</label>
                                    <Input
                                        disabled
                                        value={selectedUser.name}
                                        className="bg-gray-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600">Address</label>
                                    <Input placeholder="Enter address" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600">Email</label>
                                    <Input
                                        type="email"
                                        placeholder="Enter email"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600">Birthday</label>
                                    <Input
                                        type="date"
                                        value={selectedUser.start}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                </div>
                                <div className="space-y-2 w-full">
                                    <label className="text-sm text-gray-600">Select Gift Card</label>
                                    <Select>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a gift card" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="amazon">Amazon Gift Card - $50</SelectItem>
                                            <SelectItem value="steam">Steam Wallet - $25</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 w-full">
                                    <label className="text-sm font-medium">Gift Send Date</label>
                                    <Controller
                                        name="giftSendDate"
                                        control={control}
                                        rules={{ required: "Gift send date is required" }}
                                        render={({ field }) => (
                                            <Popover modal={true}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ?
                                                            format(typeof field.value === 'string' ? new Date(field.value) : field.value, "dd/MM/yyyy")
                                                            : "Select gift send date"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                    side="bottom"
                                                    sideOffset={4}
                                                >
                                                    <div className="calendar-wrapper" onClick={(e) => e.stopPropagation()}>
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value ?
                                                                (typeof field.value === 'string' ? new Date(field.value) : field.value)
                                                                : undefined}
                                                            onSelect={(date) => {
                                                                if (date) {
                                                                    field.onChange(date);
                                                                }
                                                            }}
                                                            disabled={(date) => {
                                                                const today = new Date();
                                                                today.setHours(0, 0, 0, 0);
                                                                return date < today;
                                                            }}
                                                            initialFocus
                                                            className="rounded-md border"
                                                            fromDate={new Date()}
                                                        />
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                    {errors.giftSendDate && (
                                        <p className="text-red-500 text-xs">{errors.giftSendDate.message as string}</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">Message (Optional)</label>
                                <Textarea
                                    placeholder="Enter your message"
                                    rows={3}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="notify" />
                                <label
                                    htmlFor="notify"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Notify me on delivery
                                </label>
                            </div>
                            <div className="flex justify-between space-x-2 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedUser(null)}
                                    className="cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    className="bg-[#FBDE6E ] cursor-pointer text-gray-900 hover:bg-yellow-500"
                                >
                                    Set Gift
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

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

.calendar-container :global(.fc-event) {
    border-radius: 6px !important;
    margin: 2px !important;
    position: relative !important;
    z-index: 1 !important;
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
`}</style>
        </div>
    );
}