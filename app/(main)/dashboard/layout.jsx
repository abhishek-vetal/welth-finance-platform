import { Suspense } from "react";
import { BarLoader } from "react-spinners";

export default async function DashboardLayout({ children }) {
    
    return (
        <div className="container mx-auto px-5">
            <h1 className="text-5xl font-extrabold tracking-tighter gradient drop-shadow-sm">
                Dashboard
            </h1>

            <Suspense
                fallback={<BarLoader className="mt-4" color="#9333ea" width={"100%"} />}
            >
                {children}
            </Suspense>
        </div>
    )
}