"use client"
import { giftInfoData } from "@/demoData/giftInfoData";
import { useState } from "react";
import DynamicTableTwo from "../../_component/common/DynamicTableTwo";
import VendorAddForm from "../../_component/vendor/VenderAddForm";

function page() {
    const [currentPage, setCurrentPage] = useState(1);
     const [isOpen, setIsOpen] = useState(false)
   

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
  return (
    <div>
        <div className="flex justify-end mb-5">
            <button onClick={()=>setIsOpen(true)} className="text-base cursor-pointer shadow-sm hover:scale-105 transition-all duration-200 font-medium text-descriptionColor px-4 py-2 rounded-sm bg-primaryColor  ">Add Vendor</button>
        </div>
      <DynamicTableTwo
        columns={columns}
        data={giftInfoData}
        currentPage={currentPage}
        itemsPerPage={10}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {isOpen && <VendorAddForm open={isOpen} onClose={setIsOpen} />}
    </div>
  )
}

export default page
