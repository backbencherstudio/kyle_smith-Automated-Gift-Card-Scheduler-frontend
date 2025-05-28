"use client"

import DynamicTableTwo from "@/app/(admin)/component/common/DynamicTableTwo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { paymentHistoryData } from "@/demoData/paymnetHistoryData";
import { useState } from "react";

function PaymentHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const columns = [
    {
      label: "Payment ID",
      accessor: "paymentId",
      width: "120px",
    },
    {
      label: "User Name",
      accessor: "userName",
      width: "180px",
    },
    {
      label: "Method",
      accessor: "method",
      width: "140px",
    },
    {
      label: "Date",
      accessor: "date",
      width: "140px",
    },
    {
      label: "Amount",
      accessor: "amount",
      width: "100px",
    },
    {
      label: "Status",
      accessor: "status",
      width: "120px",
      formatter: (value: string) => {
        const baseClass = "text-sm px-2 py-1 text-center font-medium rounded-md";
        return (
          <div
            className={
              value === "Completed"
                ? `${baseClass} bg-greenColor/10 text-greenColor`
                : `${baseClass} bg-gray-100 text-gray-700`
            }
          >
            {value}
          </div>
        );
      },
    },
  ];
  

  // ✅ Month-wise filtered data
  const filteredData = paymentHistoryData.filter((item) => {
    if (selectedMonth === "all") return true;

    const month = new Date(item.date).toLocaleString("en-US", { month: "long" }).toLowerCase();
    return month === selectedMonth.toLowerCase();
  });

  return (
    <section>
      <div className="bg-whiteColor p-5 rounded-md">
        <div className="flex justify-between items-center pb-5">
          <h4 className="text-lg font-bold  text-headerColor">Payment History</h4>
          <div className="flex items-center gap-3">
            <Select onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Month" className="!text-blackColor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Month</SelectItem>
                <SelectItem value="january">January</SelectItem>
                <SelectItem value="february">February</SelectItem>
                <SelectItem value="march">March</SelectItem>
                <SelectItem value="april">April</SelectItem>
                <SelectItem value="may">May</SelectItem>
                <SelectItem value="june">June</SelectItem>
                <SelectItem value="july">July</SelectItem>
                <SelectItem value="august">August</SelectItem>
                <SelectItem value="september">September</SelectItem>
                <SelectItem value="october">October</SelectItem>
                <SelectItem value="november">November</SelectItem>
                <SelectItem value="december">December</SelectItem>
              </SelectContent>
            </Select>

           
          </div>
        </div>

        <DynamicTableTwo
          columns={columns}
          data={filteredData}
          currentPage={currentPage}
          itemsPerPage={10}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </section>
  );
}

export default PaymentHistoryPage;
