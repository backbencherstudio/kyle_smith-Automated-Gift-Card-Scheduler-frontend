"use client";

import { TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// === Data ===
const allChartData = [
  { month: "Jan", revenue: 150, year: 2025 },
  { month: "Feb", revenue: 180, year: 2025 },
  { month: "Mar", revenue: 120, year: 2025 },
  { month: "Apr", revenue: 140, year: 2025 },
  { month: "May", revenue: 180, year: 2025 },
  { month: "Jun", revenue: 100, year: 2025 },
  { month: "Jul", revenue: 80, year: 2025 },
  { month: "Aug", revenue: 190, year: 2025 },
  { month: "Sep", revenue: 160, year: 2025 },
  { month: "Oct", revenue: 170, year: 2025 },
  { month: "Nov", revenue: 140, year: 2025 },
  { month: "Dec", revenue: 130, year: 2025 },

  { month: "Jan", revenue: 100, year: 2024 },
  { month: "Feb", revenue: 110, year: 2024 },
  { month: "Mar", revenue: 120, year: 2024 },
  { month: "Apr", revenue: 130, year: 2024 },
  { month: "May", revenue: 140, year: 2024 },
  { month: "Jun", revenue: 90, year: 2024 },
  { month: "Jul", revenue: 80, year: 2024 },
  { month: "Aug", revenue: 100, year: 2024 },
  { month: "Sep", revenue: 110, year: 2024 },
  { month: "Oct", revenue: 120, year: 2024 },
  { month: "Nov", revenue: 130, year: 2024 },
  { month: "Dec", revenue: 140, year: 2024 },
];

// === Time Detection ===
const currentMonth = new Date().toLocaleString("default", { month: "short" });
const currentYear = new Date().getFullYear();

export function RevenueLineChart() {
  const [selectedYear, setSelectedYear] = useState(`${currentYear}`);

  const filteredData = allChartData.filter(
    (entry) => `${entry.year}` === selectedYear
  );

  const currentMonthIndex = filteredData.findIndex(
    (entry) =>
      entry.month === currentMonth && `${entry.year}` === `${currentYear}`
  );

  return (
    <Card className="shadow-none h-[443px] flex flex-col justify-between">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm text-descriptionColor font-medium">
              Revenue Statistic
            </h4>
            <div className="flex gap-2 items-center leading-none">
              <h5 className="font-bold text-2xl">$500K</h5>
              <span className="rounded-full bg-greenColor/15 border border-greenColor flex justify-center items-center px-2 gap-1 text-[10px] py-1 text-greenColor">
                10% <TrendingUp className="h-3 w-3 text-greenColor" />
              </span>
            </div>
          </div>
          <Select onValueChange={(value) => setSelectedYear(value)}>
            <SelectTrigger className="w-[100px] focus-visible:ring-0">
              <SelectValue placeholder="Yearly" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="pl-0 relative">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData}>
            <defs>
              <linearGradient
                id="currentMonthGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#BACDFA" />
                <stop offset="100%" stopColor="#EFF3FF" />
              </linearGradient>
            </defs>

            {/* 🔵 Active Month Line */}
            {currentMonthIndex !== -1 && (
              <ReferenceLine
                x={filteredData[currentMonthIndex]?.month}
                stroke="#BACDFA"
                
                strokeWidth={19}
              />
            )}

            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={true}
              tickMargin={10}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={true}
              tickMargin={10}
              className="text-xs"
              tickFormatter={(value) => `$${value}`}
            />

            <Tooltip
              content={({ payload }) => {
                if (!payload?.length) return null;
                const value = payload[0].payload.revenue;
                const month = payload[0].payload.month;
                const year = payload[0].payload.year;
                return (
                  <div className="rounded-md bg-white p-2 shadow-[#EFF3FF] shadow-xl text-xs"  style={{
                    
                    boxShadow: "2px 2px 7px 2px rgba(238, 242, 255, 100)"
                  }}>
                    <h5 className="text-xs font-semibold">
                      {month} {year}
                    </h5>
                    <p className="text-[10px] font-semibold text-pragaraphColor">
                      <span className="text-[#93979A]">This Month:</span> $
                      {value}K
                    </p>
                  </div>
                );
              }}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#1141CB"
              strokeWidth={2}
              dot={({ cx, cy, payload }) => {
                const isCurrent =
                  payload.month === currentMonth &&
                  `${payload.year}` === `${currentYear}`;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill={isCurrent ? "#ffffff" : "#1141CB"}
                    stroke="#1141CB"
                    strokeWidth={2}
                  />
                );
              }}
              activeDot={{
                r: 6,
                stroke: "#1141CB",
                strokeWidth: 2,
                fill: "#ffffff",
              }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* 🟦 Current Month Tooltip Box (Always Visible) */}
        {currentMonthIndex !== -1 && (
          <div
            className="absolute top-[-30px] z-10 bg-white p-2 rounded-md  shadow-[#EFF3FF] shadow-xl text-xs pointer-events-none"
            style={{
              left: `calc(${(currentMonthIndex / filteredData.length) * 100}% + 40px)`,
              boxShadow: "2px 2px 7px 2px rgba(238, 242, 255, 100)"
            }}
           
          >
            <h5 className="text-xs font-semibold">
              {filteredData[currentMonthIndex]?.month}{" "}
              {filteredData[currentMonthIndex]?.year}
            </h5>
            <p className="text-[10px] font-semibold text-pragaraphColor">
              <span className="text-[#93979A]">This Month:</span> $
              {filteredData[currentMonthIndex]?.revenue}K
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
