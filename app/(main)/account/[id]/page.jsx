import { getAccountWithTransactions } from "@/actions/account"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { BarLoader } from "react-spinners"
import TransactionTable from "../_components/transaction-table"
import AccountChart from "../_components/account-chart"

export default async function AccountsPage({ params }) {
    const { id } = await params
    const accountData = await getAccountWithTransactions(id)

    if (!accountData) {
        notFound()
    }

    const { transactions, ...account } = accountData

    return (
        <div className="container mx-auto px-8 flex flex-col gap-13 m">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-5xl font-extrabold tracking-tighter gradient drop-shadow-sm capitalize">{account.name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {`${account.type.charAt(0).toUpperCase()}${account.type.slice(1).toLowerCase()}`} Account
                    </p>
                </div>
                <div className="flex flex-col text-right gap-1">
                    <p className="text-xl md:text-2xl font-bold">₹{account.balance.toFixed(2)}</p>
                    <p className="text-xs md:text:sm text-muted-foreground">{account._count.transactions} Transactions</p>
                </div>
            </div>

            {/* chart section */}
            <Suspense
                fallback={<BarLoader className="mt-4" color="#9333ea" width={"100%"} />}
            >
                <AccountChart transactions={transactions} />
            </Suspense>

            {/* transaction table */}
            <Suspense
                fallback={<BarLoader className="mt-4" color="#9333ea" width={"100%"} />}
            >
                <TransactionTable transactions={transactions} />

            </Suspense>

        </div>
    )
}