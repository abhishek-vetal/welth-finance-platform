import { getAccountWithTransactions } from "@/actions/account";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BarLoader } from "react-spinners";
import TransactionTable from "../_components/transaction-table";
import AccountChart from "../_components/account-chart";

export default async function AccountsPage({ params }) {
  const { id } = await params;
  const accountData = await getAccountWithTransactions(id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="container mx-auto flex flex-col gap-12 px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight capitalize md:text-5xl bg-linear-to-r from-slate-800 via-violet-600 to-blue-500 dark:from-cyan-400 dark:via-violet-400 dark:to-pink-500 bg-clip-text text-transparent">
            {account.name}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {`${account.type.charAt(0).toUpperCase()}${account.type.slice(1).toLowerCase()}`}{" "}
            Account
          </p>
        </div>

        <div className="rounded-3xl bg-card px-6 py-4 shadow-sm text-right">
          <p className="text-2xl font-bold md:text-3xl">
            ₹{account.balance.toFixed(2)}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>

      {/* Chart */}
      <Suspense
        fallback={
          <div className="overflow-hidden rounded-full">
            <BarLoader color="#8b5cf6" width={"100%"} />
          </div>
        }
      >
        <AccountChart transactions={transactions} />
      </Suspense>

      {/* Table */}
      <Suspense
        fallback={
          <div className="overflow-hidden rounded-full">
            <BarLoader color="#8b5cf6" width={"100%"} />
          </div>
        }
      >
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
}
