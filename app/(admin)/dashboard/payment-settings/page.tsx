"use client"

import DynamicTableTwo from "@/app/(admin)/_component/common/DynamicTableTwo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToken } from "@/hooks/useToken";
import { UserService } from "@/service/user.service";
import { useEffect, useState } from "react";

function PaymentHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentHistoryData, setPaymentHistoryData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const { token } = useToken()
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
        const baseClass = "text-base capitalize px-2 py-2  text-center font-medium rounded-md";
        return (
          <div
            className={
              value === "succeeded"
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
  
  const fetcUserData = async () => {
    setIsLoading(true);
    try {
    const endpoint = `/admin/gift-log/payment-history?page=${currentPage}&limit=${itemsPerPage}&month=${selectedMonth} `;
    console.log(endpoint);
    
      const res = await UserService.getData(token, endpoint);
      const result = res;
      console.log(result);
      
      setPaymentHistoryData(result?.data || []);
      setCurrentPage(result?.page || 1);
      setTotalPages(result?.totalPages || 1);
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching gift card data:", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetcUserData()
  }, [currentPage, selectedMonth])


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
                <SelectItem value="0">Month</SelectItem>
                <SelectItem value="1">January</SelectItem>
                <SelectItem value="2">February</SelectItem>
                <SelectItem value="3">March</SelectItem>
                <SelectItem value="4">April</SelectItem>
                <SelectItem value="5">May</SelectItem>
                <SelectItem value="6">June</SelectItem>
                <SelectItem value="7">July</SelectItem>
                <SelectItem value="8">August</SelectItem>
                <SelectItem value="9">September</SelectItem>
                <SelectItem value="10">October</SelectItem>
                <SelectItem value="11">November</SelectItem>
                <SelectItem value="12">December</SelectItem>
              </SelectContent>
            </Select>

           
          </div>
        </div>

        <DynamicTableTwo
          columns={columns}
          data={paymentHistoryData}
          currentPage={currentPage}
          itemsPerPage={10}
          onPageChange={(page) => setCurrentPage(page)}
          totalPages={totalPages}
        />
      </div>
    </section>
  );
}

export default PaymentHistoryPage;
