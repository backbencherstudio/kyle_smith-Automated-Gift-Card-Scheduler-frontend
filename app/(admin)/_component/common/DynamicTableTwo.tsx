"use client";

import Image from "next/image";
import React from "react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

interface ColumnConfig {
  label: React.ReactNode;
  width: any;
  accessor: string;
  formatter?: (value: any, row: any) => React.ReactNode;
}

interface DynamicTableProps {
  columns: ColumnConfig[];
  data: any[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onView?: (row: any) => void;
  onDelete?: (id: any) => void;
  noDataMessage?: string;
  totalPages?: number;
}

export default function DynamicTableTwo({
  columns,
  data,
  currentPage,
  itemsPerPage,
  onPageChange,
  onView,
  onDelete,
  noDataMessage = "No data found.",
  totalPages: totalPagesProp,
}: DynamicTableProps) {
  const totalPages = totalPagesProp || Math.ceil(data.length / itemsPerPage);
  const paginatedData = data; 
  
  const getPagination = () => {
    let pages: (number | string)[] = [];
    if (totalPages <= 4) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
      }
    }
    return pages;
  };

  return (
    <div>
      {/* Table Wrapper with Border & Radius */}
      <div className="overflow-hidden ">
        <div className="overflow-x-auto">
           <table className={`min-w-[100px] w-full text-left border border-borderColor2`}>
                     <thead className="bg-neutral-100 ">
                       <tr>
                         {columns.map((col, index) => (
                           <th
                             key={index}
                             style={{ width: col.width || "auto" }}
                             className="px-4 py-3 whitespace-nowrap text-sm  border border-borderColor2 font-semibold text-blackColor "
                           >
                             {col.label}
                           </th>
                         ))}
                         {(onView || onDelete) && (
                           <th className="px-4 py-3 text-sm font-medium text-[#4a4c56] border-b border-borderColor2">
                             Action
                           </th>
                         )}
                       </tr>
                     </thead>
                     <tbody className="bg-white">
                       {paginatedData.length > 0 ? (
                         paginatedData.map((row, i) => (
                           <tr key={i} className="border-t border-borderColor2">
                             {columns.map((col, idx) => (
                               <td
                                 key={idx}
                                 style={{ width: col.width || "auto" }}
                                 className="px-4 py-3 text-sm text-[#4a4c56] border-b border-r border-borderColor2"
                               >
                                 {col.formatter
                                   ? col.formatter(row[col.accessor], row)
                                   : row[col.accessor]}
                               </td>
                             ))}
                             {(onView || onDelete) && (
                               <td className="px-4 py-3 flex gap-4 items-center border-b border-r border-borderColor2">
                                 {onView && (
                                   <span
                                     className="text-xs underline text-[#4a4c56]  cursor-pointer"
                                     onClick={() => onView(row)}
                                   >
                                     View details
                                   </span>
                                 )}
                                 {onDelete && (
                                   <Image
                                     onClick={() => onDelete(row.id)}
                                     src="/dashboard/icon/delete.svg"
                                     alt="delete"
                                     width={16}
                                     height={16}
                                     className="cursor-pointer"
                                   />
                                 )}
                               </td>
                             )}
                           </tr>
                         ))
                       ) : (
                         <tr>
                           <td
                             colSpan={columns.length + 1}
                             className="px-4 py-10 text-center text-[#4a4c56] text-sm"
                           >
                             {noDataMessage}
                           </td>
                         </tr>
                       )}
                     </tbody>
                   </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="cursor-pointer px-2 py-1 flex justify-center  items-center border disabled:bg-grayColor1/30 disabled:cursor-not-allowed text-grayColor1 rounded disabled:opacity-40 disabled:text-grayColor1 disabled:border-0"
          >
           <MdArrowBackIosNew />
          </button>
          {getPagination().map((page, i) => (
            <button
              key={i}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={page === "..."}
              className={`px-2 rounded border text-sm ${
                page === currentPage
                  ? "text-primaryColor border-primaryColor bg-primaryColor/10  font-medium"
                  : "text-grayColor1"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="cursor-pointer px-2 py-1 flex justify-center  items-center border disabled:bg-grayColor1/30 disabled:cursor-not-allowed text-grayColor1 rounded disabled:opacity-40 disabled:text-grayColor1 disabled:border-0"
          >
           <MdArrowForwardIos />
          </button>
        </div>
      )}
    </div>
  );
}
