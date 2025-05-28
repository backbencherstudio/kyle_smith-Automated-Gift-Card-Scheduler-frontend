"use client"

import { giftInfoData } from "@/demoData/giftInfoData";
import { useState } from "react";
import DynamicTableTwo from "../../component/common/DynamicTableTwo";

function GiftLogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState<"All" | "Failed" | "Completed">("All");


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
  


const filteredUsers = giftInfoData.filter((user) => {
  const roleMatch = selectedRole === "All" || user.status === selectedRole;
  return roleMatch;
});
return (
  <section>
    <div className=" bg-whiteColor p-5 rounded-md">
      
      <div className="flex justify-between md:justify-start gap-2 whitespace-nowrap md:gap-4 pb-5">
        {["All", "Failed", "Completed"].map((role) => (
          <button
            key={role}
            onClick={() =>
              setSelectedRole(role as "All" | "Failed" | "Completed")
            }
            className={`md:px-4 px-1.5 cursor-pointer border font-semibold rounded-md text-sm md:text-base py-2 ${
              selectedRole === role
                ? "  text-headerColor  bg-primaryColor"
                : " text-headerColor border-1.5"
            }`}
          >
            {role === "All"
              ? "Gift Log"
              : role == "Failed"
              ? "Failed Order "
              : role === "Completed"
              ? "Complete Order"
              :role}
          </button>
        ))}
      </div>
      {selectedRole == "All" && <DynamicTableTwo
        columns={columns}
        data={filteredUsers}
        currentPage={currentPage}
        itemsPerPage={10}
        onPageChange={(page) => setCurrentPage(page)}
      />}
      {selectedRole == "Failed" && <DynamicTableTwo
        columns={Issucolumns}
        data={filteredUsers}
        currentPage={currentPage}
        itemsPerPage={10}
        onPageChange={(page) => setCurrentPage(page)}
      />}
      {selectedRole == "Completed" && <DynamicTableTwo
        columns={Completecolumns}
        data={filteredUsers}
        currentPage={currentPage}
        itemsPerPage={10}
        onPageChange={(page) => setCurrentPage(page)}
      />}
    </div>
  </section>
);
}

export default GiftLogPage
