"use client";

import Image from "next/image";
import React from "react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  totalPages?: number;
  onPageChange: (page: number) => void;
  onView?: (row: any) => void;
  onDelete?: (id: any) => void;
  noDataMessage?: string;
  loading?: boolean;
  showLoading?: boolean;
}

export default function DynamicTableTwo({
  columns,
  data,
  currentPage,
  itemsPerPage,
  totalPages: propTotalPages,
  onPageChange,
  onView,
  onDelete,
  noDataMessage = "No data found.",
  totalPages: totalPagesProp,
  loading = false,
  showLoading = false,
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
      <div className="rounded-lg border border-borderColor2 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-100 hover:bg-neutral-100">
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  style={{ 
                    width: col.width || "auto",
                    minWidth: col.width || "auto",
                    maxWidth: col.width || "auto"
                  }}
                  className="px-4 py-3 whitespace-nowrap text-sm border-r border-b border-borderColor2 font-semibold text-blackColor overflow-hidden text-ellipsis bg-neutral-100"
                >
                  {col.label}
                </TableHead>
              ))}
              {(onView || onDelete) && (
                <TableHead 
                  className="px-4 py-3 text-sm font-medium text-[#4a4c56] border-r border-b border-borderColor2 bg-neutral-100"
                  style={{ width: "120px" }}
                >
                  Action
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, i) => (
                <TableRow key={i} className="border-t border-borderColor2 hover:bg-gray-50">
                  {columns.map((col, idx) => (
                    <TableCell
                      key={idx}
                      style={{ 
                        width: col.width || "auto",
                        minWidth: col.width || "auto",
                        maxWidth: col.width || "auto"
                      }}
                      className="px-4 py-3 text-sm text-[#4a4c56] border-b border-r border-borderColor2 overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      <div className="truncate">
                        {col.formatter
                          ? col.formatter(row[col.accessor], row)
                          : row[col.accessor]}
                      </div>
                    </TableCell>
                  ))}
                  {(onView || onDelete) && (
                    <TableCell 
                      className="px-4 py-3 flex gap-4 items-center border-b border-r border-borderColor2"
                      style={{ width: "120px" }}
                    >
                      {onView && (
                        <span
                          className="text-xs underline text-[#4a4c56] cursor-pointer"
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
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="px-4 py-10 text-center text-[#4a4c56] text-sm"
                >
                  {showLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    noDataMessage
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="cursor-pointer px-2 py-1 flex justify-center items-center border disabled:bg-grayColor1/30 disabled:cursor-not-allowed text-grayColor1 rounded disabled:opacity-40 disabled:text-grayColor1 disabled:border-0"
          >
           <MdArrowBackIosNew />
          </button>
          {getPagination().map((page, i) => (
            <button
              key={i}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={page === "..." || loading}
              className={`px-2 rounded border text-sm cursor-pointer ${
                page === currentPage
                  ? "text-primaryColor border-primaryColor bg-primaryColor/10 font-medium"
                  : "text-grayColor1"
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="cursor-pointer px-2 py-1 flex justify-center items-center border disabled:bg-grayColor1/30 disabled:cursor-not-allowed text-grayColor1 rounded disabled:opacity-40 disabled:text-grayColor1 disabled:border-0"
          >
           <MdArrowForwardIos />
          </button>
        </div>
      )}
    </div>
  );
}
