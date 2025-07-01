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
import { useToken } from "@/hooks/useToken";
import { UserService } from "@/service/user/user.service";
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



export default function NewUserChart() {
  const [selectedRange, setSelectedRange] = useState("weekly");
  const [chartData, setChartData] = useState([]);
  const { token } = useToken()
  const fetchData = async () => {
    try {
      const endpoint = `/admin-dashboard/overview?range=${selectedRange}`
      const response = await UserService?.getData(token, endpoint)
      setChartData(response?.new_user_chart)
    } catch (error) {
      console.log(error?.message);

    }
  }

  useEffect(() => {
    fetchData()
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
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
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
