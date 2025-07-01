"use client";
import Loader from "@/components/reusable/Loader";
import { useToken } from "@/hooks/useToken";
import { UserService } from "@/service/user.service";
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import DynamicTableTwo from "../../_component/common/DynamicTableTwo";


function GiftSchedulePage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { token } = useToken();

  const fetchQueueData = async () => {
    try {
      setLoading(true);
      const endpoint = `/queue-monitoring/admin-dashboard?page=${currentPage}&limit=${itemsPerPage}`;
      const response = await UserService.getData(token, endpoint);
      setData(response?.jobs?.jobs);
    } catch (error) {
      console.error("Error fetching queue data:", error);
      toast.error("Failed to fetch queue data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchQueueData();
    }
  }, [token]);


  const columns = [
    {
      label: "ID",
      width: "80px",
      accessor: "id",
    },
    {
      label: "Sender Name",
      width: "150px",
      accessor: "sender",
      formatter: (value: any) => (
        <div className="font-medium">{value}</div>
      ),
    },
    {
      label: "Recipient Email",
      width: "150px",
      accessor: "recipient",
      formatter: (value: any) => (
        <div>
          <div className=" font-medium">{value.email}</div>
        </div>
      ),
    },

    {
      label: "Gift Card Code",
      width: "200px",
      accessor: "giftCardCode",
      formatter: (value: any) => <div className="font-medium">{value}</div>,
    },
    {
      label: "Scheduled Date",
      width: "150px",
      accessor: "scheduled",
      formatter: (value: any) => <div className="relative cursor-pointer group w-fit">
        <div className="font-medium capitalize">
          {value?.relative}
        </div>
        {/* Tooltip */}
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-gray-800 text-white text-base px-2 py-3 rounded shadow-md whitespace-nowrap z-10">
          {value?.display || "Exact date not available"}
        </div>
      </div>,
    },

    {
      label: "Status",
      width: "120px",
      accessor: "status",
      formatter: (value: any) => (
        <p className={`px-2 py-2 w-[80%] text-center rounded-sm text-base font-medium ${value === 'completed' ? 'bg-green-100 text-green-800' :
          value === 'scheduled' ? 'bg-blue-100 text-blue-800' : value === 'field' ? 'bg-red-100 text-redColor' :
            'bg-gray-100 text-gray-800'
          }`}>
          {value}
        </p>
      ),
    },
    {
      label: "Processing Time",
      width: "120px",
      accessor: "processed",
      formatter: (value: any) => <div className="font-medium capitalize">{value?.relative}</div>,
    },

    {
      label: "Amount",
      width: "150px",
      accessor: "amount",
      formatter: (value: any) => <div>${value}</div>,
    },
  ];

  if (loading) return <Loader />

  console.log(data);

  return (
    <div className="bg-whiteColor p-5 rounded-md">
      <h4 className='text-lg font-bold text-headerColor pb-5 '>Gift Schedule</h4>

      {data && data && (
        <DynamicTableTwo
          columns={columns}
          data={data}
          currentPage={currentPage}
          itemsPerPage={10}
          onPageChange={setCurrentPage}
          noDataMessage="No gift schedules found."
        />
      )}
    </div>

  );
}

export default GiftSchedulePage;
