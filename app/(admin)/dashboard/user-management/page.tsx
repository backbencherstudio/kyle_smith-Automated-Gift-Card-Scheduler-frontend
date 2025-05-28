"use client"

import { userGiftData } from "@/demoData/userGiftData";
import { useState } from "react";
import DynamicTableTwo from "../../component/common/DynamicTableTwo";

function Booking() {
      const [currentPage, setCurrentPage] = useState(1);
      const columns = [
        {
          label: "User Name",
          accessor: "userName",
          width: "200px",
        },
        {
          label: "Email",
          accessor: "email",
          width: "250px",
        },
        {
          label: "Total Gift Send",
          accessor: "totalGiftSend",
          width: "150px",
        },
        {
          label: "Birthday Contact",
          accessor: "birthdayContact",
          width: "150px",
        },
        {
          label: "Total Gift Amount",
          accessor: "totalGiftAmount",
          width: "150px",
        },
        {
          label: "Actions",
          accessor: "actions",
          width: "120px",
          formatter: (_value, row) => (
            <div className="flex gap-2 justify-center items-center">
              <button title="View">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-700 hover:text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
              <button title="Delete">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-red-600 hover:text-red-800"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-2 14H7L5 6m5 0V4a2 2 0 012-2h0a2 2 0 012 2v2" />
                </svg>
              </button>
            </div>
          ),
        },
      ];
      
      
  return (
     <section>
         <div className='bg-whiteColor p-5 rounded-md'>
            <h4 className='text-lg font-bold text-headerColor pb-5 '>User Management</h4> 
         <DynamicTableTwo
        
         columns={columns}
                 data={userGiftData}
                 currentPage={currentPage}
                 itemsPerPage={10}
                 onPageChange={(page) => setCurrentPage(page)}/>
         </div>
       </section>
  )
}

export default Booking
