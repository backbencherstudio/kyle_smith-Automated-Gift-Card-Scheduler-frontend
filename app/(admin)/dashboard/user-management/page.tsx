"use client"

import { useToken } from "@/hooks/useToken";
import { UserService } from "@/service/user.service";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import DynamicTableTwo from "../../_component/common/DynamicTableTwo";
function Booking() {
  const [currentPage, setCurrentPage] = useState(1);
  const { token } = useToken()
  const [userData, setUserData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const columns = [
    {
      label: "User Name",
      accessor: "name",
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
  const fetcUserData = async () => {
    setIsLoading(true);
    try {
      const endpoint = `/admin/user-management?page=${currentPage}&limit=${itemsPerPage}`;


      const res = await UserService.getData(token, endpoint);

      const result = res;


      setUserData(result?.users || []);
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
  console.log(currentPage);
  return (
    <section>
      <div className='bg-whiteColor p-5 rounded-md'>
        <h4 className='text-lg font-bold text-headerColor pb-5 '>User Management</h4>
        <DynamicTableTwo
          columns={columns}
          data={userData}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={10}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </section>
  )
}

export default Booking
