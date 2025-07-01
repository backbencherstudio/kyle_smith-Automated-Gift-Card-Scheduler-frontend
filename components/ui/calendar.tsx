"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { DayPicker, CaptionProps, useNavigation } from "react-day-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// Custom Caption component with dropdown functionality
function CustomCaption(props: CaptionProps) {
  const { displayMonth } = props
  const { goToMonth } = useNavigation()
  const [isYearOpen, setIsYearOpen] = React.useState(false)
  const [isMonthOpen, setIsMonthOpen] = React.useState(false)

  const currentYear = displayMonth.getFullYear()
  const currentMonth = displayMonth.getMonth()

  // Generate years (from 1900 to current year + 10)
  const years = Array.from({ length: new Date().getFullYear() - 1899 + 10 }, (_, i) => 1900 + i)
  
  // Generate months
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  return (
    <div className="flex justify-center pt-1 relative items-center w-full">
      <div className="flex items-center gap-2">
        {/* Month Dropdown */}
        <Select
          open={isMonthOpen}
          onOpenChange={setIsMonthOpen}
          value={currentMonth.toString()}
          onValueChange={(value) => {
            const newMonth = new Date(displayMonth)
            newMonth.setMonth(parseInt(value))
            goToMonth(newMonth)
            setIsMonthOpen(false)
          }}
        >
          <SelectTrigger className="w-[100px] h-8 text-sm font-medium border-none bg-transparent hover:bg-gray-100 px-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={index} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year Dropdown */}
        <Select
          open={isYearOpen}
          onOpenChange={setIsYearOpen}
          value={currentYear.toString()}
          onValueChange={(value) => {
            const newYear = new Date(displayMonth)
            newYear.setFullYear(parseInt(value))
            goToMonth(newYear)
            setIsYearOpen(false)
          }}
        >
          <SelectTrigger className="w-[80px] h-8 text-sm font-medium border-none bg-transparent hover:bg-gray-100 px-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
        Caption: CustomCaption,
      }}
      {...props}
    />
  )
}

export { Calendar }
