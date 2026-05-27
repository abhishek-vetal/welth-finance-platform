import { getUserAccounts } from "@/actions/dashboard";
import AddTransactionsForm from "../_components/transaction-form";
import { defaultCategories } from "@/data/categories";
import { getTransaction } from "@/actions/transactions";

export default async function AddTransactions({ searchParams }) {
  const accounts = await getUserAccounts();

  const editId = (await searchParams).edit;

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="container mx-auto px-10 md:px-30 lg:px-70">
      <h1 className="text-5xl font-extrabold tracking-tight bg-linear-to-r from-slate-800 via-violet-600 to-blue-500 dark:from-cyan-400 dark:via-violet-400 dark:to-pink-500 bg-clip-text text-transparent">
        {`${editId ? "Update" : "Add"} Transaction`}
      </h1>

      <AddTransactionsForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  );
}
