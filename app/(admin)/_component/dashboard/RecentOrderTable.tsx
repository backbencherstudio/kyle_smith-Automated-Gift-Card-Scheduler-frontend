"use client"

import { giftData } from '@/demoData/giftData';
import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import DynamicTableTwo from '../common/DynamicTableTwo';

function RecentOrderTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const columns = [
      {
        label: "Sender Name",
        accessor: "senderName",
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
        width: "200px",
      },
      {
        label: "Event Date",
        accessor: "eventDate",
        width: "120px",
      },
      {
        label: "Gift Send Date",
        accessor: "giftSendDate",
        width: "120px",
      },
      {
        label: "Amount",
        accessor: "amount",
        width: "100px",
      },
      {
        label: "Status",
        accessor: "status",
        width: "100px",
        formatter: (value) => {
          return (
            <div
              className={`${
                value === "Completed" ? "bg-greenColor/10 text-greenColor" : "bg-redColor/10 text-redColor"
              } px-2 py-1 rounded-md w-full text-center text-sm`}
            >
              {value}
            </div>
          );
        },
      },
    ];
    
  return (
    <section>
      <div className='bg-whiteColor p-5 rounded-md'>
          <div className=' flex justify-between items-center pb-4'> 
         <h4 className='text-lg font-bold text-headerColor '>Recent Activity</h4> 
         <div>
          <button className='cursor-pointer text-headerColor border rounded-md text-sm flex items-center gap-2 px-[14px] py-2'>
            View All <IoIosArrowDown /></button>
         </div>
          </div>
      <DynamicTableTwo

      
      columns={columns}
              data={giftData}
              currentPage={currentPage}
              itemsPerPage={7}
              onPageChange={(page) => setCurrentPage(page)}/>
      </div>
    </section>
  )
}

export default RecentOrderTable
