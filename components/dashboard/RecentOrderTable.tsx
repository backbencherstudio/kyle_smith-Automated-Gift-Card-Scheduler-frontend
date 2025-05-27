"use client"
import { serviceRequests } from '@/demoData/serviceRequests';
import Image from 'next/image';
import { useState } from 'react';
import DynamicTableTwo from '../common/DynamicTableTwo';

function RecentOrderTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const columns = [
        {
          label: "No",
          accessor: "id",
          width: "50px",
         
        },
        {
          label: "Order Id",
          accessor: "orderId",
          width: "100px",
       
        },
        {
          label: "Consumer Name",
          accessor: "consumerName",
          width: "200px",
         
        },
        {
          label: "Service Name",
          accessor: "serviceName",
          width: "160px",
         
        },
        {
          label: "Service Type",
          accessor: "serviceType",
          width: "160px",
          
        },
        {
          label: "Location",
          accessor: "location",
          width: "150px",
        
        },
        {
          label: "Service Date",
          accessor: "serviceDate",
          width: "120px",
          
        },
        {
          label: "Action",
          accessor: "action",
          width: "120px",
          formatter: (value) => <span className="flex gap-2"><button className=' text-base border border-primaryColor rounded-md px-5 py-2 text-primaryColor cursor-pointer'>Accept</button> <button className=' text-base  bg-primaryColor  rounded-md px-5 py-2 text-whiteColor cursor-pointer'>Reject</button></span>,
        },
      ];
  return (
    <section>
      <div className='border p-5 rounded-md'>
          <div className=' flex justify-between items-center pb-4'> 
         <h4 className='text-xl lg:text-2xl font-medium text-headerColor '>Our Recent Orders</h4> 
         <div>
          <button className='cursor-pointer text-headerColor border rounded-md text-sm flex items-center gap-2 px-[14px] py-2'>
            <Image src="/icon/filter.svg" alt='filter' width={16} height={16} className=''/>
            Filter</button>
         </div>
          </div>
      <DynamicTableTwo 
      columns={columns}
              data={serviceRequests}
              currentPage={currentPage}
              itemsPerPage={5}
              onPageChange={(page) => setCurrentPage(page)}/>
      </div>
    </section>
  )
}

export default RecentOrderTable
