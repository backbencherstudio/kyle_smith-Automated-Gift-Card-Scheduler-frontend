"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CustomHeader({
  calendarRef,
  currentView,
  setCurrentView,
  currentDate,
  setCurrentDate,
}) {
  const handlePrev = () => {
    const cal = calendarRef.current?.getApi();
    if (!cal) return;
    cal.prev();
    setTimeout(() => setCurrentDate(cal.getDate()), 0);
  };

  const handleNext = () => {
    const cal = calendarRef.current?.getApi();
    if (!cal) return;
    cal.next();
    setTimeout(() => setCurrentDate(cal.getDate()), 0);
  };

  const handleViewChange = (view) => {
    const cal = calendarRef.current?.getApi();
    if (!cal) return;
  
    cal.changeView(view);
    setCurrentView(view);
    setTimeout(() => setCurrentDate(cal.getDate()), 0);
  };

  const formattedDate =
    currentDate instanceof Date
      ? currentDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "Loading...";

  const getWeekRange = (date) => {
    const start = new Date(date);
   

    const format = (d) =>
      d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    return `${format(start)}`;
  };

  return (
    <div className=" px-4 pb-4 ">
      <div className="text-base font-medium text-blackColor pb-2 ">All Schedule</div>
      <div className="flex items-center justify-between ">
      <div className="flex items-center gap-2">
        <button onClick={handlePrev} className="py-1 px-1.5 border rounded-md">
          <ChevronLeft size={17} />
        </button>
        <div className="text-sm px-4 font-semibold">
          {currentView === "timeGridWeek"
            ? getWeekRange(currentDate)
            : formattedDate}
        </div>
        <button onClick={handleNext} className="py-1 px-1.5 border rounded-md">
          <ChevronRight size={17} />
        </button>
      </div>
      <Select value={currentView} onValueChange={handleViewChange}>
  <SelectTrigger className="w-[180px]  focus-visible:ring-0">
    <SelectValue placeholder="Select view" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="timeGridWeek">Weekly</SelectItem>
    <SelectItem value="timeGridDay">Daily</SelectItem>
    <SelectItem value="dayGridMonth">Monthly</SelectItem>
  </SelectContent>
</Select>
      </div>
      
    </div>
  );
}
