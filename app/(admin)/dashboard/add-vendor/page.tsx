"use client"
import { useToken } from "@/hooks/useToken";
import { UserService } from "@/service/user/user.service";
import { useEffect, useState } from "react";
import DynamicTableTwo from "../../_component/common/DynamicTableTwo";
import VendorAddForm from "../../_component/vendor/VenderAddForm";

function page() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false)
    const {token}=useToken()
    const [vendorData, setVendorData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10);
    
  const columns = [
    {
      label: "Card Name",
      accessor: "name",
      width: "200px",
    },
    {
      label: "Description",
      accessor: "description",
      width: "200px",
    },
    {
      label: "Website",
      accessor: "website",
      width: "250px",
    },
    {
      label: "Current Card Stock",
      accessor: "gift_card_inventory",
      width: "140px",
       formatter: (_value, row) => row._count?.gift_card_inventory ?? 0
    },
   
  ];

 const fetchVendor = async (page = 1, limit = itemsPerPage) => {
  try {
    const endpoint = `/admin/vendor?page=${page}&limit=${limit}`; 
    const res = await UserService.getData(token, endpoint); 
    const result = res;
    setVendorData(result?.data || []);
    setCurrentPage(result?.page || 1);
    setTotalPages(result?.totalPages || 1);
  } catch (error) {
    console.log("Error fetching vendor data:", error);
  }
};

  useEffect(()=>{
      fetchVendor(currentPage, itemsPerPage)
  },[token, itemsPerPage])

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchVendor(page, itemsPerPage);
  }
  console.log("hi",vendorData);

  return (
    <div>
        <div className="flex justify-end mb-5">
            <button onClick={()=>setIsOpen(true)} className="text-base cursor-pointer shadow-sm hover:scale-105 transition-all duration-200 font-medium text-descriptionColor px-4 py-2 rounded-sm bg-primaryColor  ">Add Vendor</button>
        </div>
        
      <DynamicTableTwo
        columns={columns}
        data={vendorData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {isOpen && <VendorAddForm open={isOpen} onClose={setIsOpen} />}
    </div>
  )
}

export default page
