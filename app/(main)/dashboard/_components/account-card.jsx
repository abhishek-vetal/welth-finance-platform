"use client"

import { UpdateDefault } from "@/actions/account";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"
import useFetch from "@/hooks/use-fetch"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { toast } from "sonner"

export default function AccountCard({ account }) {
    const {id, name, isDefault, balance, type} = account

    const {
        data: updatedAccount, 
        loading: updateDefaultLoading,
        error, 
        fn: updateDefaultFn
    } = useFetch(UpdateDefault)

    const handleToggle = async (event) => {
        event.preventDefault()

        if (isDefault) {
            toast.warning("You need atleast 1 default account");
            return;
        }

        await updateDefaultFn(id);
    };

    useEffect(() => {
        if (updatedAccount?.success) {
            toast.success("Default account updated successfully");
        }
    }, [updatedAccount]);

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Failed to update default account");
        }
    }, [error]);
    
    return (
        <div>
            <Link href={`/account/${id}`}> 
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className={"flex justify-between"}>
                        <CardTitle className={"capitalize"}>{name}</CardTitle>
                        <div
                            className="flex gap-2 items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <p className="text-xs text-muted-foreground">Default</p>

                            <Switch
                                checked={isDefault}
                                onClick={handleToggle}
                                disabled={updateDefaultLoading}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">₹{balance.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}`} Account</p>
                    </CardContent>
                    <CardFooter className={"flex justify-between"}>
                        <div className="flex items-center">
                            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500"/> 
                            Income
                        </div>
                        <div className="flex items-center">
                            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500"/> 
                            Expense
                        </div>
                    </CardFooter>
                </Card>
            </Link>
        </div>
    )
}