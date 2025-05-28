"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { giftData } from "@/demoData/giftData";
import { useState } from "react";
import DynamicTable from "../common/DynamicTable";

export default function UpcomingGift() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOption, setFilterOption] = useState("");

  const columns = [
    {
      label: "Name",
      accessor: "senderName",
      width: "164px",
    },
    {
      label: "Email",
      accessor: "recipientEmail",
      width: "164px",
    },
    {
      label: "Birthday",
      accessor: "giftSendDate",
      width: "164px",
    },
  ];

  const isWeekend = (date: string) => {
    const day = new Date(date).getDay(); 
    return day === 0 || day === 6;
  };

  const filteredData = giftData.filter((item) => {
    if (filterOption === "weekends") {
      return isWeekend(item.giftSendDate);
    }
    if (filterOption === "all") {
      return true;
    }
    return true; // Default case
  });

  return (
    <div className=" p-5 bg-whiteColor rounded-md">
      <div className="flex justify-between items-center pb-4">
        <h4 className="text-lg text-headerColor font-bold">Upcoming Gift</h4>
        <div>
          <Select onValueChange={setFilterOption} value={filterOption}>
            <SelectTrigger className="cursor-pointer  !text-headerColor border font-medium rounded-md text-sm px-[14px] py-2">
              <SelectValue placeholder="weekly" className="!text-blackColor"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">all</SelectItem>
              <SelectItem value="weekends">All Weekends</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DynamicTable
        range="min-w-[485px]"
        columns={columns}
        data={filteredData} // Use the filtered data here
        currentPage={currentPage}
        itemsPerPage={6}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
