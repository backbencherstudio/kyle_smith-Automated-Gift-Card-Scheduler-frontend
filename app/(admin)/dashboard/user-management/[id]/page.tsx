"use client"

import DynamicTableTwo from "@/app/(admin)/_component/common/DynamicTableTwo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { giftInfoData } from "@/demoData/giftInfoData";
import { useToken } from "@/hooks/useToken";
import { UserService } from "@/service/user.service";
import dayjs from "dayjs";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function ViewALlInformation() {
  const [currentPage, setCurrentPage] = useState(1);
  const { token } = useToken()
  const [userData, setUserData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const params = useParams()
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("all");
  console.log(params);

  const columns = [
    {
      label: "Recipient Name",
      accessor: "recipientName",
      width: "200px",
    },
    {
      label: "Recipient Email",
      accessor: "recipientEmail",
      width: "250px",
    },
    {
      label: "Gift Send Date",
      accessor: "giftSendDate",
      width: "140px",
      formatter: (value) => <div className="">{dayjs(value).format("DD MMM YYYY")}</div>
    },
    {
      label: "Additional Message",
      accessor: "message",
      width: "250px",
    },
    {
      label: "Amount",
      accessor: "amount",
      width: "100px",
    },
    {
      label: "Event Date",
      accessor: "eventDate",
      width: "140px",
      formatter: (value) => <div className="">{dayjs(value).format("DD MMM YYYY")}</div>
    },
    {
      label: "Status",
      accessor: "status",
      width: "120px",
      formatter: (value: string) => {
        const baseClass = "text-sm px-2 py-1 text-center rounded-md";
        if (value === "Completed")
          return <div className={`${baseClass} bg-greenColor/10 text-greenColor`}>{value}</div>;
        if (value === "Failed")
          return <div className={`${baseClass} bg-redColor/10 text-redColor`}>{value}</div>;
        return <div className={`${baseClass} bg-[#F6940A]/10 text-[#F6940A]`}>{value}</div>;
      },
    },
  ];

  const filteredData = giftInfoData.filter((item) => {
    if (selectedMonth === "all") return true;
    const month = new Date(item.giftSendDate).toLocaleString("en-US", { month: "long" }).toLowerCase();
    return month === selectedMonth.toLowerCase();
  });

  const fetcUserData = async () => {
    setIsLoading(true);
    try {
      const endpoint = `/admin/user-management/${params?.id}?page=${currentPage}&limit=${itemsPerPage}`;
      const res = await UserService.getData(token, endpoint);
      const result = res;
      setUserData(result?.gifts || []);
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
  }, [currentPage])
  console.log(userData);

  return (
    <section>
      <div className="bg-whiteColor p-5 rounded-md">
        <div className="flex justify-between items-center pb-5">
          <h4 className="text-lg font-bold text-headerColor">View Information</h4>
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

            <div className="flex justify-start items-center gap-2 cursor-pointer hover:opacity-90">
              <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-md overflow-hidden">
                <Image
                  src="/image/notification/n1.png"
                  alt="Admin Avatar"
                  width={40}
                  height={40}
                  className="rounded-md w-full h-full"
                />
              </div>
              <div className="whitespace-nowrap">
                <h4 className="sm:text-sm text-[13px] font-medium text-blackColor">Ali Eyad</h4>
                <p className="text-grayColor1 font-normal">eleanor@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
        <DynamicTableTwo
          columns={columns}
          data={userData}
          currentPage={currentPage}
          itemsPerPage={10}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </section>
  );
}

export default ViewALlInformation;
