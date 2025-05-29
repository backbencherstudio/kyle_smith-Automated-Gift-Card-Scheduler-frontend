"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ✅ Static Weekly Data (from your example)
const weeklyUserData = [
  { label: "Sat", users: 0 },
  { label: "Sun", users: 50 },
  { label: "Mon", users: 25 },
  { label: "Tue", users: 75 },
  { label: "Wed", users: 50 },
  { label: "Thu", users: 105 },
  { label: "Fri", users: 80 },
];

// ✅ Static Monthly Data (Day 1–30)
const monthlyUserData = [
  { label: "Day 1", users: 15 },
  { label: "Day 2", users: 30 },
  { label: "Day 3", users: 45 },
  { label: "Day 4", users: 20 },
  { label: "Day 5", users: 60 },
  { label: "Day 6", users: 80 },
  { label: "Day 7", users: 70 },
  { label: "Day 8", users: 50 },
  { label: "Day 9", users: 40 },
  { label: "Day 10", users: 90 },
  { label: "Day 11", users: 65 },
  { label: "Day 12", users: 75 },
  { label: "Day 13", users: 55 },
  { label: "Day 14", users: 35 },
  { label: "Day 15", users: 25 },
  { label: "Day 16", users: 45 },
  { label: "Day 17", users: 70 },
  { label: "Day 18", users: 60 },
  { label: "Day 19", users: 50 },
  { label: "Day 20", users: 80 },
  { label: "Day 21", users: 90 },
  { label: "Day 22", users: 100 },
  { label: "Day 23", users: 110 },
  { label: "Day 24", users: 95 },
  { label: "Day 25", users: 75 },
  { label: "Day 26", users: 60 },
  { label: "Day 27", users: 45 },
  { label: "Day 28", users: 30 },
  { label: "Day 29", users: 20 },
  { label: "Day 30", users: 10 },
];

// ✅ Static Yearly Data
const yearlyUserData = [
  { label: "Jan", users: 200 },
  { label: "Feb", users: 180 },
  { label: "Mar", users: 160 },
  { label: "Apr", users: 190 },
  { label: "May", users: 220 },
  { label: "Jun", users: 210 },
  { label: "Jul", users: 250 },
  { label: "Aug", users: 230 },
  { label: "Sep", users: 240 },
  { label: "Oct", users: 260 },
  { label: "Nov", users: 280 },
  { label: "Dec", users: 300 },
];

export default function NewUserChart() {
  const [selectedRange, setSelectedRange] = useState("Weekly");
  const [chartData, setChartData] = useState(weeklyUserData);

  useEffect(() => {
    if (selectedRange === "Weekly") {
      setChartData(weeklyUserData);
    } else if (selectedRange === "Monthly") {
      setChartData(monthlyUserData);
    } else if (selectedRange === "Yearly") {
      setChartData(yearlyUserData);
    }
  }, [selectedRange]);

  const maxUser = Math.max(...chartData.map((d) => d.users));
  const dynamicMax = Math.ceil(maxUser / 25) * 25;
  const ticks = Array.from({ length: dynamicMax / 25 + 1 }, (_, i) => i * 25);
  
  return (
    <Card className="shadow-none bg-white rounded-xl flex flex-col justify-between">
      <CardHeader className="flex justify-between items-center pb-0">
        <h4 className="text-base font-semibold text-black">New User</h4>
        <Select
          value={selectedRange}
          onValueChange={(val) => setSelectedRange(val)}
        >
          <SelectTrigger className="w-[100px] h-8 text-sm">
            <SelectValue placeholder="Weekly" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Yearly">Yearly</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="pt-2 pl-0">
        <ResponsiveContainer width="100%" height={306}>
          <LineChart data={chartData}>
            <CartesianGrid />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#333" }}
            />
            <YAxis
             domain={[0, dynamicMax]}
             allowDataOverflow={false}
             tickLine={false}
             axisLine={false}
             tick={{ fontSize: 12, fill: "#333" }}
             ticks={ticks}
              
            />
            <Tooltip
              content={({ payload }) => {
                if (!payload?.length) return null;
                return (
                  <div className="bg-white border rounded-md shadow-md px-3 py-2 text-xs">
                    <p className="font-semibold">{payload[0].payload.label}</p>
                    <p>{payload[0].value} new users</p>
                  </div>
                );
              }}
            />
            <Line
             
              dataKey="users"
              stroke="#F5A300"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "white",
                stroke: "#F5A300",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 5,
                stroke: "#F5A300",
                strokeWidth: 2,
                fill: "#fff",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
