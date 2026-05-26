"use client"

import { updateBudget } from "@/actions/budget"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import useFetch from "@/hooks/use-fetch"
import { Check, Pencil, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

export default function BudgetProgress({ initialBudget, currentExpenses = 0 }) {
  const [isEditing, setIsEditing] = useState(false)
  const [budget, setBudget] = useState(initialBudget?.amount || 0)
  const [input, setInput] = useState(initialBudget?.amount?.toString() || "")

  const {
    data: updateBudgetData,
    loading: updateBudgetLoading,
    fn: updateBudgetFn,
    error,
  } = useFetch(updateBudget)

  const handleBudget = async () => {
    const amount = parseFloat(input)
    if (isNaN(amount) || amount < 0) {
      toast.error("Please enter a valid positive budget")
      return 
    }
    await updateBudgetFn(amount)
  }

  useEffect(() => {
    // 1. Wait until we actually have a response from the server
    if (updateBudgetData) {
      
      if (!updateBudgetData.success) {
        toast.error(updateBudgetData.error || "Failed to update budget");
        console.error("Budget Update Failure:", updateBudgetData.error);
        return; 
      }

      setIsEditing(false)
      setBudget(updateBudgetData.data.amount)
      toast.success("Budget updated successfully")
    }
  }, [updateBudgetData])

  // Reset input if user cancels editing mid-way
  const handleCancel = () => {
    setIsEditing(false)
    setInput(budget.toString())
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleBudget()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  const percentage = budget ? (currentExpenses / budget) * 100 : 0

  return (
    <Card className="w-full shadow-sm border-border/50">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <CardTitle className="text-xl">Monthly Budget</CardTitle>
            <CardDescription className="text-sm font-medium">
              {budget > 0 ? (
                <span>
                  ₹{currentExpenses.toFixed(2)} of ₹{Number(budget).toFixed(2)} spent
                </span>
              ) : (
                "Set a monthly target to track expenses"
              )}
            </CardDescription>
          </div>

          <div>
            {isEditing ? (
              <div className="flex gap-1.5 items-center">
                <Button
                  onClick={handleBudget}
                  variant="ghost"
                  size="icon"
                  disabled={updateBudgetLoading}
                  className="h-8 w-8 text-green-600 bg-green-50 hover:bg-green-100 disabled:opacity-50"
                >
                  {updateBudgetLoading ? (
                    <Spinner className="h-4 w-4 text-green-600" />
                  ) : (
                    <Check className="h-4 w-4 stroke-[2.5]" />
                  )}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="ghost"
                  size="icon"
                  disabled={updateBudgetLoading}
                  className="h-8 w-8 text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50"
                >
                  <X className="h-4 w-4 stroke-[2.5]" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isEditing ? (
          <Input
            placeholder="Enter budget amount"
            type="number"
            disabled={updateBudgetLoading}
            value={input} 
            autoFocus
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <>
            <Progress
              value={percentage > 100 ? 100 : percentage}
              className={`h-2 w-full bg-slate-100 [&>div]:transition-all [&>div]:duration-500 ${
                percentage >= 90 
                  ? "[&>div]:bg-red-500" 
                  : percentage >= 75 
                    ? "[&>div]:bg-amber-500" 
                    : "[&>div]:bg-green-500"
              }`}
            />
            
            <div className="flex justify-between text-xs text-muted-foreground mt-2 px-0.5 font-medium">
              <span>
                {percentage > 100 ? "Budget exceeded" : `${percentage.toFixed(1)}% used`}
              </span>
              
              {budget > 0 && (
                <span>
                  {percentage > 100 
                    ? `₹${(currentExpenses - budget).toFixed(2)} over limit`
                    : `₹${(budget - currentExpenses).toFixed(2)} remaining`
                  }
                </span>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}