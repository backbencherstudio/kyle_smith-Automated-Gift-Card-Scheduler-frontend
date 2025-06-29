"use client"
import Loader from "@/components/reusable/Loader";
import { useToken } from "@/hooks/useToken";
import { UserService } from "@/service/user/user.service";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";
import DynamicTableTwo from "../../_component/common/DynamicTableTwo";
import GiftCardAddForm from "../../_component/giftcard/GiftCardAddForm";

function page() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false)
    const { token } = useToken()
    const [giftCardData, setGiftCardData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10);
    const [updateData, setUpdateData] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const columns = [
        {
            label: "Vendor ID",
            accessor: "vendor_id",
            width: "220px",
        },
        {
            label: "Card Code",
            accessor: "card_code",
            width: "380px",
        },
        {
            label: "Face Value",
            accessor: "face_value",
            width: "120px",
            formatter: (value: number) => `$${value}`
        },
        {
            label: "Purchase Cost",
            accessor: "purchase_cost",
            width: "120px",
            formatter: (value: number) => `$${value}`
        },
        {
            label: "Selling Price",
            accessor: "selling_price",
            width: "120px",
            formatter: (value: number) => `$${value}`
        },
        {
            label: "Status",
            accessor: "status",
            width: "150px",
            formatter: (value: string) => {
                const baseClass = "text-sm px-2 py-2 text-center font-medium rounded-md";
                return (
                    <div
                        className={
                            value === "AVAILABLE"
                                ? `${baseClass} bg-greenColor/10 text-greenColor`
                                : `${baseClass} bg-redColor/10 text-redColor`
                        }
                    >
                        {value}
                    </div>
                );
            },
        },
        {
            label: "Purchase Date",
            accessor: "purchase_date",
            width: "150px",
            formatter: (value: string) => new Date(value).toLocaleDateString()
        },
        {
            label: "Expiry Date",
            accessor: "expiry_date",
            width: "150px",
            formatter: (value: string) => new Date(value).toLocaleDateString()
        },
        {
            label: "Action",
            accessor: "action",
            width: "120px",
            formatter: (value, row) => (
                <div className="flex gap-2">
                    <button onClick={() => handleUpdate(row)} className="cursor-pointer px-2 rounded-sm text-greenColor ">
                        <FaRegEdit size={20} />
                    </button>
                    <button disabled={!value} onClick={() => handleDelete(row?.id)} className="cursor-pointer disabled:text-grayColor1 disabled:cursor-not-allowed px-2 rounded-sm text-redColor ">
                        <RiDeleteBin6Line size={20} />
                    </button>
                </div>
            )
        }
    ];

    const fetchGiftCards = async (page = 1, limit = itemsPerPage) => {
        setIsLoading(true);
        try {
            const endpoint = `/admin/gift-card-inventory`;
            const res = await UserService.getData(token, endpoint);
            console.log(res);
            
            const result = res;
            setGiftCardData(result?.data || []);
            setCurrentPage(result?.page || 1);
            setTotalPages(result?.totalPages || 1);
            setIsLoading(false);
        } catch (error) {
            console.log("Error fetching gift card data:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGiftCards(currentPage, itemsPerPage)
    }, [token, itemsPerPage])

    const handleUpdate = async (data) => {
        console.log(data);
        setUpdateData(data)
        setIsOpen(true)
    }
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchGiftCards(page, itemsPerPage);
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this gift card?")) return;
        try {
            const endpoint = `/admin/gift-card-inventory/${id}`;
            const response = await UserService?.deletePotectedData(token, endpoint);
            if (response?.success) {
                toast.success(response?.note);
                fetchGiftCards(currentPage, itemsPerPage);
            } else {
                toast.error(response?.message || "Failed to delete gift card");
            }
        } catch (error) {
            toast.error("An error occurred while deleting gift card");
            console.error("Delete error:", error);
        }
    }

    return (
        <div>
            {isLoading ? (
                <Loader />
            ) :
                <div>
                    <div className="flex justify-end mb-5">
                        <button onClick={() => { setIsOpen(true); setUpdateData(undefined); }} className="text-base cursor-pointer shadow-sm hover:scale-105 transition-all duration-200 font-medium text-descriptionColor px-4 py-2 rounded-sm bg-primaryColor">Add Gift Card</button>
                    </div>

                    <DynamicTableTwo
                        columns={columns}
                        data={giftCardData}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            }

            {isOpen && (
                <GiftCardAddForm
                    onfetch={fetchGiftCards}
                    open={isOpen}
                    onClose={() => {
                        setIsOpen(false);
                        setUpdateData(undefined);
                    }}
                    initialData={updateData}
                />
            )}
        </div>
    )
}

export default page
