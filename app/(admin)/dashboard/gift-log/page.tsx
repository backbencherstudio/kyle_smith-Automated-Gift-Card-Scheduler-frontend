"use client"

import { giftInfoData } from "@/demoData/giftInfoData";
import { useToken } from "@/hooks/useToken";
import { UserService } from "@/service/user.service";
import { useEffect, useState } from "react";
import DynamicTableTwo from "../../_component/common/DynamicTableTwo";

function GiftLogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState<"All" | "FAILED" | "COMPLETED">("All");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const { token } = useToken()

  const columns = [
    {
      label: "Sender Name",
      accessor: "recipientName",
      width: "200px",
    },
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
    },
    {
      label: "Additional Message",
      accessor: "message",
      width: "280px",
    },
    {
      label: "Amount",
      accessor: "amount",
      width: "100px",
    },
  ];
  
  const Issucolumns = [
    {
      label: "Sender Name",
      accessor: "recipientName",
      width: "200px",
    },
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
    },
    {
      label: "Amount",
      accessor: "amount",
      width: "100px",
    },
    {
      label: "Issue",
      accessor: "issue",
      width: "200px",
      
    },
  ];
  
  const Completecolumns = [
    {
      label: "Sender Name",
      accessor: "recipientName",
      width: "180px",
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
      label: "Status",
      accessor: "status",
      width: "120px",
      formatter: (value: string) => {
        const baseClass = "text-sm px-2 py-1 text-center rounded-md";
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
  

  const fetcUserData = async () => {
    setIsLoading(true);
    try {
      let endpoint = "";
      if(selectedRole === "All"){   // All is not a status, it's a role 
        endpoint = `/admin/gift-log?page=${currentPage}&limit=${itemsPerPage}`;
      }else{
        endpoint = `/admin/gift-log?page=${currentPage}&limit=${itemsPerPage}&status=${selectedRole}`;
      }
      
      const res = await UserService.getData(token, endpoint);
      console.log("----------------",res?.data);
      
      const result = res;
      setUserData(result?.data || []);
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
}, [currentPage, selectedRole])

   

const filteredUsers = giftInfoData.filter((user) => {
  const roleMatch = selectedRole === "All" || user.status === selectedRole;
  return roleMatch;
});
return (
  <section>
    <div className=" bg-whiteColor p-5 rounded-md">
      
      <div className="flex justify-between md:justify-start gap-2 whitespace-nowrap md:gap-4 pb-5">
        {["All", "FAILED", "COMPLETED"].map((role) => (
          <button
            key={role}
            onClick={() =>
              setSelectedRole(role as "All" | "FAILED" | "COMPLETED")
            }
            className={`md:px-4 px-1.5 cursor-pointer border font-semibold rounded-md text-sm md:text-base py-2 ${
              selectedRole === role
                ? "  text-headerColor  bg-primaryColor"
                : " text-headerColor border-1.5"
            }`}
          >
            {role === "All"
              ? "Gift Log"
              : role == "FAILED"
              ? "Failed Order "
              : role === "COMPLETED"
              ? "Complete Order"
              :role}
          </button>
        ))}
      </div>
      {selectedRole == "All" && <DynamicTableTwo
        columns={columns}
        data={userData}
        currentPage={currentPage}
        itemsPerPage={10}
        onPageChange={(page) => setCurrentPage(page)}
        totalPages={totalPages}
      />}
      {selectedRole == "FAILED" && <DynamicTableTwo
        columns={Issucolumns}
        data={userData}
        currentPage={currentPage}
        itemsPerPage={10}
        onPageChange={(page) => setCurrentPage(page)}
        totalPages={totalPages}
      />}
      {selectedRole == "COMPLETED" && <DynamicTableTwo
        columns={Completecolumns}
        data={userData}
        currentPage={currentPage}
        itemsPerPage={10}
        onPageChange={(page) => setCurrentPage(page)}
        totalPages={totalPages}
        />}
    </div>
  </section>
);
}

export default GiftLogPage
