import React from 'react'

export default function GiftSchedulingCalender() {
    return (
        <div className="flex-1 bg-white rounded-xl shadow p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Gift Scheduling</h2>
                <button className="text-sm text-gray-500 border px-3 py-1 rounded-md">
                    View all
                </button>
            </div>

            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-2">
                <button>&lt;</button>
                <span className="text-sm font-medium">May 2025</span>
                <button>&gt;</button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 text-sm flex-grow">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className={`h-24 border rounded-md p-1 ${i === 1 || i === 3 || i === 7 || i === 9 || i === 11
                            ? "border-red-300 bg-red-50"
                            : i === 8
                                ? "border-green-300 bg-green-50"
                                : i === 10
                                    ? "border-purple-300 bg-purple-50"
                                    : "border-gray-100"
                            }`}
                    >
                        <p className="text-xs font-bold">
                            {String(i + 1).padStart(2, "0")}
                        </p>
                        {i === 1 && (
                            <div>
                                <p className="text-xs font-semibold">Eleanor</p>
                                <p className="text-[10px] text-gray-500">Birthday</p>
                            </div>
                        )}
                        {i === 8 && (
                            <div>
                                <p className="text-xs font-semibold">Esther</p>
                                <p className="text-[10px] text-gray-500">Crisms</p>
                            </div>
                        )}
                        {i === 10 && (
                            <div>
                                <p className="text-xs font-semibold">Wade</p>
                                <p className="text-[10px] text-gray-500">Marriage</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
