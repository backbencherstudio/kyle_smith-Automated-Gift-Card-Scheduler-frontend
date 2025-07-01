"use client"

import Link from 'next/link';
import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import DynamicTableTwo from '../common/DynamicTableTwo';

function RecentOrderTable({ userData }: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const columns = [
    {
      label: "Sender Name",
      accessor: "sender_name",
      width: "200px",
    },
    {
      label: "Recipient Name",
      accessor: "recipient_name",
      width: "200px",
    },
    {
      label: "Recipient Email",
      accessor: "recipient_email",
      width: "200px",
    },
    {
      label: "Event Date",
      accessor: "event_date",
      width: "120px",
    },
    {
      label: "Gift Send Date",
      accessor: "gift_send_date",
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
            className={`${value === "Completed" ? "bg-greenColor/10 text-greenColor" : "bg-redColor/10 text-redColor"
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
            <Link href="/dashboard/user-management" className='cursor-pointer text-headerColor border rounded-md text-sm flex items-center gap-2 px-[14px] py-2'>
              View All <IoIosArrowDown /></Link>
          </div>
        </div>
        <DynamicTableTwo
          columns={columns}
          data={userData}
          currentPage={currentPage}
          itemsPerPage={10}
          onPageChange={(page) => setCurrentPage(page)} />
      </div>
    </section>
  )
}

export default RecentOrderTable
