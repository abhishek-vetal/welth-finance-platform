import { getDashboardData, getUserAccounts } from "@/actions/dashboard"
import CreateAccountDrawer from "@/components/create-account-drawer"
import { Plus } from "lucide-react"
import AccountCard from "./_components/account-card"
import BudgetProgress from "./_components/budget-progress"
import { getCurrentBudget } from "@/actions/budget"
import { Card, CardContent } from "@/components/ui/card"
import DashboardOverview from "./_components/dashboard-overview"

export default async function Dashboard() {
    const accounts = await getUserAccounts()
    const budgetData = await getCurrentBudget()
    const transactions = await getDashboardData()

    

    return (
        <div className="mt-10 flex flex-col gap-10">
            {/* Budget Progress */}
            <BudgetProgress
                initialBudget={budgetData?.budget}
                currentExpenses={budgetData?.totalExpense || 0}
            />

            <DashboardOverview 
                accounts={accounts}
                transactions={transactions || []}
            />

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                <CreateAccountDrawer>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer py-13">
                        <CardContent className="flex flex-col gap-2 justify-center items-center text-muted-foreground h-full">
                            <Plus className="w-10 h-10" />
                            <p className="text-sm font-medium">Add New Account</p>
                        </CardContent>
                    </Card>
                </CreateAccountDrawer>

                {accounts.length > 0 && accounts.map((account) => (
                    <AccountCard key={account.id} account={account} />
                ))}
            </div>
        </div>
    )
}