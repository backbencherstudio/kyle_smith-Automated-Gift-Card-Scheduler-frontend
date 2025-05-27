"use client"
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useRef, useState } from 'react';
import { CustomHeader } from './CustomHeader';
export function createEventId() {
  return String(Date.now() + Math.random());
}

const getDateStr = (dayOffset, hour, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - date.getDay() + dayOffset); // Set to that weekday
  date.setHours(hour, minute, 0, 0);
  return date.toISOString(); // IMPORTANT: keep full ISO string with time
};
 const INITIAL_EVENTS = [
  // Sunday (5/25)
  {
    id: createEventId(),
    title: "Exterior Wash",
    start: getDateStr(0, 9),    // 9 AM
    end: getDateStr(0, 10),     // 10 AM
  },
  {
    id: createEventId(),
    title: "Tire Cleaning",
    start: getDateStr(0, 13),   // 1 PM
    end: getDateStr(0, 14),     // 2 PM
  },
  {
    id: createEventId(),
    title: "Engine wash",
    start: getDateStr(0, 16),   // 4 PM
    end: getDateStr(0, 18),     // 6 PM
  },

  // Monday (5/26)
  {
    id: createEventId(),
    title: "Hand Drying",
    start: getDateStr(1, 9),    // 9 AM
    end: getDateStr(1, 10),     // 10 AM
  },
  {
    id: createEventId(),
    title: "Exterior Wash",
    start: getDateStr(1, 11),   // 11 AM
    end: getDateStr(1, 13),     // 12 PM
  },
  {
    id: createEventId(),
    title: "Exterior Wash",
    start: getDateStr(1, 15),   // 2 PM
    end: getDateStr(1, 16),     // 3 PM
  },

  // Tuesday (5/27)
  
  {
    id: createEventId(),
    title: "Tire Cleaning",
    start: getDateStr(2, 13),   // 1 PM
    end: getDateStr(2, 15),     // 4 PM
  },

  // Wednesday (5/28)
  {
    id: createEventId(),
    title: "Hand Drying",
    start: getDateStr(3, 9),   // 10 AM
    end: getDateStr(3, 12),     // 11 AM
  },
  {
    id: createEventId(),
    title: "Exterior Wash",
    start: getDateStr(3, 13),   // 2 PM
    end: getDateStr(3, 14),     // 4 PM
  },
  {
    id: createEventId(),
    title: "Full Interior & Exterior",
    start: getDateStr(3, 15),   // 2 PM
    end: getDateStr(3, 18),     // 4 PM
  },

  // Thursday (5/29)
  {
    id: createEventId(),
    title: "Car wash",
    start: getDateStr(4, 10),    // 9 AM
    end: getDateStr(4, 11),     // 10 AM
  },
  {
    id: createEventId(),
    title: "Exterior Wash",
    start: getDateStr(4, 12),   // 1 PM
    end: getDateStr(4, 13),     // 2 PM
  },
  {
    id: createEventId(),
    title: "Tire Cleaning",
    start: getDateStr(4, 14),   // 1 PM
    end: getDateStr(4, 15),     // 2 PM
  },

  // Friday (5/30)
  {
    id: createEventId(),
    title: "Hand Drying",
    start: getDateStr(5, 9),    // 9 AM
    end: getDateStr(5, 10),     // 10 AM
  },
  {
    id: createEventId(),
    title: "Wheel fixing",
    start: getDateStr(5, 13),   // 12 PM
    end: getDateStr(5, 15),     // 2 PM
  },
  {
    id: createEventId(),
    title: "Exterior Wash",
    start: getDateStr(5, 16),   // 12 PM
    end: getDateStr(5, 17),     // 2 PM
  },
  // starday
  {
    id: createEventId(),
    title: "Tire Cleaning",
    start: getDateStr(6, 10),    // 9 AM
    end: getDateStr(6, 11),     // 10 AM
  },
  {
    id: createEventId(),
    title: "Full Interior & Exterior",
    start: getDateStr(6, 12),   // 12 PM
    end: getDateStr(6, 15),     // 2 PM
  },
  {
    id: createEventId(),
    title: "Engine wash",
    start: getDateStr(6, 16),   // 12 PM
    end: getDateStr(6, 18),     // 2 PM
  },
]


export default function DemoApp() {
  const [weekendsVisible, setWeekendsVisible] = useState(true)
  const [currentEvents, setCurrentEvents] = useState([])
  const calendarRef = useRef(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<any>("timeGridWeek");
  useEffect(() => {
    setCurrentEvents(INITIAL_EVENTS); // Initialize with initial events
  }, []);

  function handleDateSelect(selectInfo) {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }

  function handleEventClick(clickInfo) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  }
  const renderCustomDayHeader = (args) => {
    const date = args.date;
    const day = date.toLocaleDateString("en-US", { weekday: "short" }); // Mon
    const dateNum = date.getDate(); // 1, 2, 3...
  
    return {
      html: `<div class="fc-custom-header">
                <div class="fc-date-number">${dateNum}</div>
                <div class="fc-day-name">${day}</div>
             </div>`
    };
  };
  function handleEvents(events) {
    setCurrentEvents(events); // Update current events when the calendar changes
  }
  useEffect(() => {
    const cal = calendarRef.current?.getApi();
    if (cal) {
      setCurrentDate(cal.getDate());
    }
  }, []);
  return (
    <div className='w-full overflow-x-auto md:overflow-visible'>
<div className="min-w-[650px] md:min-w-full">
    <div className='demo-app p-4 border rounded-md' >
       <CustomHeader
       
        calendarRef={calendarRef}
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />

      <div className='demo-app-main rounded-md overflow-hidden   '>

      <FullCalendar
  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
  headerToolbar={false}
  ref={calendarRef} // ✅ VERY IMPORTANT
  initialView={currentView}
  allDaySlot={false}
  dayHeaderContent={renderCustomDayHeader}
  editable={true}
  selectable={true}
  selectMirror={true}
  dayMaxEvents={true}
  weekends={weekendsVisible}
  initialEvents={INITIAL_EVENTS} // Use INITIAL_EVENTS here
  select={handleDateSelect}
  eventContent={renderEventContent}
  eventClick={handleEventClick}
  eventsSet={handleEvents}
  contentHeight={700}
  
  expandRows={true}
  slotMinTime="09:00:00"
  slotMaxTime="18:00:00"
/>
      </div>
    </div>
    </div>
    </div>
  )
}

function renderEventContent(eventInfo:any) {
  const bgColor:any = getEventColor(eventInfo.event.title); // এইটা Tailwind ক্লাস return করে

 
  return (
    <div className={`event-content ${bgColor?.bg} border ${bgColor?.border} text-center rounded-md`}>
      <div className="flex flex-col justify-center   items-center  w-full h-full p-1">
        <div className='text-sm font-semibold text-headerColor'>{eventInfo.event.title}</div>
        <p className='text-grayColor1 mt-2 '>{eventInfo.timeText}</p>
      </div>
    </div>
  );
}

function getEventColor(title) {
  if (title.includes('Wash')) return {border:"border-sky-500",bg:'bg-sky-50'}
  if (title.includes('Drying')) return {border:"border-amber-500",bg:'bg-amber-50'}
  if (title.includes('Wheel fixing')) return {border:'border-amber-500',bg:'bg-amber-50'}
  if (title.includes('Cleaning')) return {border:'border-green-500',bg:'bg-green-50'} 
  if (title.includes('Interior')) return {border:'border-fuchsia-500',bg:'bg-fuchsia-50'}
  if (title.includes('Engine wash')) return {border:'border-purple-500',bg:'bg-purple-50'}
  if (title.includes('Car wash')) return {border:'border-purple-500',bg:'bg-purple-50'}
  return 'bg-white'
}
