"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, isSameMonth } from "date-fns"
import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts"

const COLORS = [
  "#3B82F6", "#8B5CF6", "#10B981", "#F59E0B",
  "#EF4444", "#EC4899", "#14B8A6", "#6366F1",
]

// when I hover my mouse on piechart then it will give me these props.
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null

  const { name, value } = payload[0]

  return (
    <div className="bg-background border rounded-lg px-4 py-3 shadow-md pointer-events-none">
      <p className="font-medium text-sm">
        {name}: <span className="font-bold">₹{Number(value).toLocaleString()}</span>
      </p>
    </div>
  )
}

export default function DashboardOverview({ accounts, transactions }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  )

  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  )

  const recentTransactions = [...accountTransactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 9)

  const now = new Date()

  const currentMonthExpenses = accountTransactions.filter((t) => {
    return (
      t.type === "EXPENSE" &&
      isSameMonth(new Date(t.date), now)
    )
  })

  const expenseByCategory = currentMonthExpenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount)
    return acc
  }, {})

  // 4. Inject the 'fill' color directly into the data!
  const piechartData = Object.entries(expenseByCategory).map(
    ([category, amount], index) => ({
      name: category,
      value: amount,
      fill: COLORS[index % COLORS.length],
    })
  )

  const totalExpense = piechartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="grid gap-5 md:grid-cols-2">

      {/* Recent Transactions */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <Select value={selectedAccountId || ""} onValueChange={setSelectedAccountId}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="py-1">
            {recentTransactions.length === 0 ? (
              <p className="text-center py-10 text-muted-foreground text-sm">
                No recent transactions
              </p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/60 transition-colors"
                >
                  <div className="py-1">
                    <p className="font-medium text-sm leading-none">
                      {transaction.description || "Untitled"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), "PPP")}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex items-center text-sm font-semibold",
                      transaction.type === "EXPENSE" ? "text-red-500" : "text-green-500"
                    )}
                  >
                    {transaction.type === "EXPENSE" ? (
                      <ArrowDownRight className="mr-1 h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                    )}
                    ₹{Number(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Monthly Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {piechartData.length === 0 ? (
            <div className="h-75 flex items-center justify-center text-muted-foreground text-sm">
              No expense data for this month.
            </div>
          ) : (
            <div className="flex flex-col items-center">

              {/* Donut Chart Wrapper */}
              <div className="relative h-62.5 w-full">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    {/* 5. The Pie is now beautifully self-closing with no children! */}
                    <Pie
                      data={piechartData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={75}
                      outerRadius={105}
                      paddingAngle={2}
                      stroke="none"
                      className="outline-none"
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: 'transparent' }}
                      isAnimationActive={false}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Text absolute positioned */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-2xl font-bold">
                    ₹{totalExpense.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Custom Grid Legend */}
              <div className="w-full mt-6 grid grid-cols-2 gap-3">
                {piechartData.map((item) => {
                  const percentage = totalExpense > 0
                    ? ((item.value / totalExpense) * 100).toFixed(1)
                    : 0;

                  return (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: item.fill }} // Uses the same fill from the data!
                        />
                        <span className="text-sm truncate">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-semibold text-xs ml-2">
                        {percentage}%
                      </span>
                    </div>
                  )
                })}
              </div>

            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}