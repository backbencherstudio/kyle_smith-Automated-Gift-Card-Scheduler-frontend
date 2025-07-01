"use client"

import { userGiftData } from "@/demoData/userGiftData";
import Link from "next/link";
import { useState } from "react";
import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import DynamicTableTwo from "../../_component/common/DynamicTableTwo";
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
        <div className="flex gap-4  items-center">
          <Link href="/dashboard/user-management/view-all-information">
            <FiEye className="text-[17px] hover:text-primaryColor transition-all" />
          </Link>
          <button title="Delete" className=" cursor-pointer">
            <RiDeleteBin6Line className="text-[17px] hover:text-redColor transition-all" />
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
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </section>
  )
}

export default Booking
