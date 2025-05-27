"use client";
import { bookingData } from "@/demoData/bookingData";
import React, { useState } from "react";
import DynamicTableTwo from "../common/DynamicTableTwo";
import BookingStatuse from "./BookingStatuse";

function BookingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = React.useState<
    "All" | "Ongoing" | "Completed"
  >("All");
  
  
  const columns = [
    {
      label: "No",
      accessor: "no",
      width: "50px",
    },
    {
      label: "Order Id",
      accessor: "orderId",
      width: "102px",
    },
    {
      label: "User Name",
      accessor: "userName",
      width: "172px",
    },
    {
      label: "Service Name",
      accessor: "serviceName",
      width: "172px",
    },
    {
      label: "Service Type",
      accessor: "serviceType",
      width: "172px",
    },
    {
      label: "Location",
      accessor: "location",
      width: "172px",
    },
    {
      label: "Service Date",
      accessor: "serviceDate",
      width: "120px",
    },
    {
      label: "Status",
      accessor: "status",
      width: "120px",
      formatter: (value) => <BookingStatuse status={value}/>,
    },
  
  ];
  

  const filteredUsers = bookingData.filter((user) => {
    const roleMatch = selectedRole === "All" || user.status === selectedRole;
    return roleMatch;
  });
  return (
    <section>
      <div className="border p-5 rounded-md">
        <div className=" flex justify-between items-center pb-4">
          <h4 className="text-xl lg:text-2xl font-medium text-headerColor ">
          Our Works
          </h4>
        </div>
        <div className="flex justify-between md:justify-start gap-2 whitespace-nowrap md:gap-4 pb-5">
          {["All", "Ongoing", "Completed"].map((role) => (
            <button
              key={role}
              onClick={() =>
                setSelectedRole(role as "All" | "Ongoing" | "Completed")
              }
              className={`md:px-4 px-1.5 cursor-pointer border rounded-md text-sm md:text-base py-2 ${
                selectedRole === role
                  ? "  text-whiteColor bg-primaryColor"
                  : " text-primaryColor border-primaryColor"
              }`}
            >
              {role === "All"
                ? "All Work"
                : role == "Ongoing"
                ? "Ongoing Work"
                : role === "Completed"
                ? "Completed Work"
                : role}
            </button>
          ))}
        </div>
        <DynamicTableTwo
          columns={columns}
          data={filteredUsers}
          currentPage={currentPage}
          itemsPerPage={7}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </section>
  );
}

export default BookingPage;
