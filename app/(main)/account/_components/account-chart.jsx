"use client"

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { endOfDay, format, setDate, startOfDay, subDays } from "date-fns";
import { useMemo, useState } from "react";
// 1. Added ResponsiveContainer to the imports
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

export default function AccountChart({ transactions }) {

  const [dateRange, setDateRange] = useState("1M");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange]
    const now = new Date()
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    const filtered = transactions.filter((t) => {
      return new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    })

    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd")

      if (!acc[date]) {
        acc[date] = { date, Income: 0, Expense: 0 }
      }

      transaction.type === "INCOME"
        ? acc[date].Income += transaction.amount
        : acc[date].Expense += transaction.amount

      return acc
    }, {})

    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date))

  }, [transactions, dateRange])

  const totals = useMemo(() => {
    return filteredData.reduce((acc, day) => {
      acc.Income += day.Income
      acc.Expense += day.Expense

      return acc
    }, { Income: 0, Expense: 0 })
  }, [filteredData])

  const netTotal = useMemo(() => {
    return totals.Income - totals.Expense
  }, [totals])


  return (

    <Card>
      <CardHeader>
        <CardTitle>Transaction Overview</CardTitle>
        <CardAction>
          <Select
            value={dateRange}
            onValueChange={(value) => setDateRange(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(DATE_RANGES).map(([key, { label }]) => {
                  return <SelectItem key={key} value={key}>{label}</SelectItem>
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex justify-evenly">
          <div className="flex flex-col items-center">
            <p className="text-muted-foreground">Total Income</p>
            <p className={"font-bold text-green-500"}>{`₹${totals.Income.toFixed(2)}`}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-muted-foreground">Total Expense</p>
            <p className={"font-bold text-red-500"}>{`₹${totals.Expense.toFixed(2)}`}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-muted-foreground">Net</p>
            <p className={`font-bold ${netTotal > 0 ? "text-green-500" : "text-red-500"}`}>
              {`₹${netTotal.toFixed(2)}`}
            </p>
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={filteredData}
              margin={{
                top: 20,
                right: 10,
                left: -20,
                bottom: 5,
              }}
            >
              {/* Cleaned up grid: Hiding vertical lines looks much cleaner in dashboards */}
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="date"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
                width={80}
              />

              <Tooltip
                cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
                formatter={(value) => [`₹${value}`, undefined]}
              />
              <Legend />

              {/* Slightly reduced radius to 4px so bars don't look like long capsules */}
              <Bar dataKey="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}