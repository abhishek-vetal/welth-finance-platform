import { Suspense } from "react";
import { BarLoader } from "react-spinners";

export default async function DashboardLayout({ children }) {
  return (
    <div className="container mx-auto px-4 md:px-6">
      {/* Dashboard heading */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl bg-linear-to-r from-slate-800 via-violet-600 to-blue-500 dark:from-cyan-400 dark:via-violet-400 dark:to-pink-500 bg-clip-text text-transparent">
          Dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Track your finances, accounts and spending insights
        </p>
      </div>

      <Suspense
        fallback={
          <div className="mt-6 overflow-hidden rounded-full">
            <BarLoader color="#8b5cf6" width={"100%"} />
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
