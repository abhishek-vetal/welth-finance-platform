"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import useFetch from "@/hooks/use-fetch"
import { createAccount } from "@/actions/dashboard"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

// Step 1 — Define validation rules with Zod
const accountSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["CURRENT", "SAVINGS"], { required_error: "Type is required" }),
    balance: z.coerce.number().min(0, "Balance cannot be negative"),
    isDefault: z.boolean().default(false),
})

export default function CreateAccountDrawer({ children }) {
    const [open, setOpen] = useState(false)

    // Step 2 — Setup React Hook Form with Zod resolver
    const { 
        register,       // connects inputs to form
        handleSubmit,   // validates then submits
        formState: { errors }, // errors
        setValue,       // manually set a value (for Select, Switch)
        watch,          // watch current values
        reset           // reset form after submit
    } = useForm({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            name: "",
            type: "CURRENT",
            balance: 0.00,
            isDefault: false,
        }
    })

    const {
        data: newAccount, 
        loading: createAccountLoading,  
        error, 
        fn: createAccountFn
    } = useFetch(createAccount)

    // Step 3 — Handle form submission
    const onSubmit = async (data) => {
        await createAccountFn(data)
    }

    useEffect(() => {
        if(newAccount) {
            toast.success("Account created successfully")
            reset()
            setOpen(false)
        }
    }, [newAccount])

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Failed to create account");
        }
    }, [error]);

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>

            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Create New Account</DrawerTitle>
                </DrawerHeader>

                {/* Step 4 — The Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
                    
                    {/* Account Name */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Account Name</label>
                        <Input 
                            {...register("name")} 
                            placeholder="e.g. Main Account"
                            autoComplete="off" 
                        />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                    </div>

                    {/* Account Type */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Account Type</label>
                        <Select onValueChange={(value) => setValue("type", value)} defaultValue="CURRENT">
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CURRENT">Current</SelectItem>
                                <SelectItem value="SAVINGS">Savings</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
                    </div>

                    {/* Balance */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Initial Balance</label>
                        <Input 
                            {...register("balance")} 
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            autoComplete="off"
                        />
                        {errors.balance && <p className="text-red-500 text-xs">{errors.balance.message}</p>}
                    </div>

                    {/* Is Default */}
                    <div className="flex justify-between items-center gap-3 border px-3 py-4 rounded-lg bg-gray-50">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Set as Default</label>
                            <p className="text-gray-600 text-xs">This accout will be selected by default for transaction.</p>
                        </div>
                        <Switch 
                            onCheckedChange={(checked) => setValue("isDefault", checked)}
                            checked={watch("isDefault")}
                        />
                    </div>

                    {/* buttons */}
                    <div className="flex gap-3">
                        <DrawerClose asChild>
                            <Button variant="outline" className="flex-1">Cancel</Button>
                        </DrawerClose>

                        <Button type="submit" className="flex-1" disabled={createAccountLoading}>
                            {createAccountLoading ? <><Loader2 className="animate-spin mr-1 h-4 w-4" /> Creating...</> : "Creating Account" }
                        </Button>
                    </div>
                </form>
            </DrawerContent>
        </Drawer>
    )
}