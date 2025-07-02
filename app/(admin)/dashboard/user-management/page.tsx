"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToken } from "@/hooks/useToken";
import { UserService } from "@/service/user.service";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";
import DynamicTableTwo from "../../_component/common/DynamicTableTwo";

function Booking() {
  const [currentPage, setCurrentPage] = useState(1);
  const { token } = useToken()
  const [userData, setUserData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState(null);
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
          <Link href={`/dashboard/user-management/${row?.id}`}>
            <FiEye className="text-[17px] hover:text-primaryColor transition-all" />
          </Link>
          <Popover open={openPopoverId === row?.id} onOpenChange={(open) => setOpenPopoverId(open ? row?.id : null)}>
            <PopoverTrigger asChild>
              <button title="Delete" className="cursor-pointer">
                <RiDeleteBin6Line className="text-[17px] hover:text-redColor transition-all" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 flex  gap-2" align="end">
              {row?.isActive ? ( 
                <button
                  className="px-4 py-2 cursor-pointer rounded bg-green-200 text-green-700 hover:bg-green-300 transition-all"
                  onClick={async () => {
                    await handleDisable(row?.id, false);
                    setOpenPopoverId(null);
                  }}
                >
                  Disable
                </button>
              ) : (
                <button
                  className="px-4 py-2 cursor-pointer rounded bg-green-200 text-green-700 hover:bg-green-300 transition-all"
                  onClick={async () => {
                    await handleDisable(row?.id, true);
                    setOpenPopoverId(null);
                  }}
                >
                  Active
                </button>
              )}
              <button
                className="px-4 py-2 cursor-pointer rounded bg-red-500 text-white hover:bg-red-600 transition-all"
                onClick={async () => {
                  await handleDelete(row?.id);
                  setOpenPopoverId(null);
                }}
              >
                Delete
              </button>
            </PopoverContent>
          </Popover>
        </div>
      ),
    },
  ];

    const handleDisable = async (id, isActive) => {
    try {
      const endpoint = `/admin/user-management/${id}/status`;
      const res = await UserService.updateJsonProtectedData(token, endpoint, { isActive: isActive });
      if (res?.data?.success === true) {
       isActive ? toast.success("User disabled successfully") : toast.success("User activated successfully");
        fetcUserData()
      }
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  }

  const handleDelete = async (id) => {
    try {
      const endpoint = `/admin/user-management/${id}`;
      const res = await UserService.deletePotectedData(token, endpoint);
      if (res?.success === true) {
        toast.success("User deleted successfully");
        fetcUserData()
      }
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  }

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
          loading={isLoading}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </section>
  )
}

export default Booking
