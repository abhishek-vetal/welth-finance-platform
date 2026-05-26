"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { deleteBulkTransactions } from "@/actions/account"
import { categoryColors } from "@/data/categories"
import useFetch from "@/hooks/use-fetch"

import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Clock,
    PencilIcon,
    RefreshCcw,
    Search,
    TrashIcon,
    X,
} from "lucide-react"

import { toast } from "sonner"
import { BarLoader } from "react-spinners"

const RECURRING_INTERVALS = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
}

export default function TransactionTable({ transactions }) {
    const router = useRouter()

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    })

    const [selectIDs, setSelectIDs] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState("")
    const [recurringFilter, setRecurringFilter] = useState("")

    const ITEMS_PER_PAGE = 8
    const [currentPage, setCurrentPage] = useState(1)

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE

    const {
        data: deleteTransactionsData,
        loading: deleteTransactionsLoading,
        fn: deleteTransactionsFn,
        error,
    } = useFetch(deleteBulkTransactions)

    const handleDelete = async (ids) => {
        const confirmDelete = window.confirm(
            ids.length > 1
                ? `Are you sure you want to delete ${ids.length} transactions? This action cannot be undone.`
                : "Are you sure you want to delete this transaction? This action cannot be undone."
        )

        if (!confirmDelete) return

        deleteTransactionsFn(ids)
    }

    useEffect(() => {
        if (deleteTransactionsData) {
            const count = selectIDs.length

            if (count > 1) {
                toast.success(`${count} transactions deleted successfully`)
            } else {
                toast.success("Transaction deleted successfully")
            }

            setSelectIDs([])
        }
    }, [deleteTransactionsData])

    useEffect(() => {
        if (error) {
            toast.error(error?.message || "Transaction deletion failed")
        }
    }, [error])

    const sortedTransactions = useMemo(() => {
        let result = [...transactions]

        if (searchTerm) {
            result = result.filter((t) => {
                const searchStr = searchTerm.toLowerCase()

                const {
                    date,
                    description,
                    category,
                    amount,
                    recurringInterval,
                } = t

                const displayDate = date
                    ? format(new Date(date), "PP")
                    : ""

                return Object.values({
                    date: displayDate,
                    description,
                    category,
                    amount,
                    recurringInterval,
                }).some((value) => {
                    if (value === null || value === undefined) return false

                    return String(value)
                        .toLowerCase()
                        .includes(searchStr)
                })
            })
        }

        if (typeFilter) {
            result = result.filter((t) => t.type === typeFilter)
        }

        if (recurringFilter) {
            result =
                recurringFilter === "recurring"
                    ? result.filter((t) => t.isRecurring)
                    : result.filter((t) => !t.isRecurring)
        }

        if (sortConfig.key != null) {
            result = result.sort((a, b) => {
                if (!sortConfig.key) return 0

                const valueA = a[sortConfig.key]
                const valueB = b[sortConfig.key]

                if (sortConfig.key === "date") {
                    const dateA = new Date(valueA || 0)
                    const dateB = new Date(valueB || 0)

                    return sortConfig.direction === "asc"
                        ? dateA - dateB
                        : dateB - dateA
                }

                if (sortConfig.key === "amount") {
                    const numA = Number(valueA) || 0
                    const numB = Number(valueB) || 0

                    return sortConfig.direction === "asc"
                        ? numA - numB
                        : numB - numA
                }

                const strA = String(valueA || "")
                const strB = String(valueB || "")

                return sortConfig.direction === "asc"
                    ? strA.localeCompare(strB)
                    : strB.localeCompare(strA)
            })
        }

        return result
    }, [
        searchTerm,
        typeFilter,
        recurringFilter,
        sortConfig,
        transactions,
    ])

    const clearAllFilters = () => {
        setSearchTerm("")
        setTypeFilter("")
        setRecurringFilter("")
        setSortConfig({
            key: null,
            direction: "asc",
        })
        setCurrentPage(1)
        setSelectIDs([])
    }

    const handleSelect = (id) => {
        setSelectIDs((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        )
    }

    const handleSelectAll = () => {
        setSelectIDs((current) =>
            current.length === 0
                ? sortedTransactions.map((t) => t.id)
                : []
        )
    }

    const handleSort = (key) => {
        let direction = "asc"

        if (
            sortConfig.key === key &&
            sortConfig.direction === "asc"
        ) {
            direction = "desc"
        }

        setSortConfig({ key, direction })
    }

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, typeFilter, recurringFilter])
    
    const totalPages = Math.ceil(
        sortedTransactions.length / ITEMS_PER_PAGE
    )

    const currentTransactions = sortedTransactions.slice(
        indexOfFirstItem,
        indexOfLastItem
    )

    return (
        <div className="flex flex-col gap-2">
            {deleteTransactionsLoading && (
                <BarLoader
                    className="mt-4"
                    color="#9333ea"
                    width={"100%"}
                />
            )}

            <div className="flex flex-col md:flex-row gap-2">
                <div className="relative min-w-100 flex-1">
                    <Search className="h-4 w-4 absolute top-2 left-3 text-muted-foreground" />

                    <Input
                        placeholder="Search transactions"
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                        className="pl-8"
                    />
                </div>

                <div className="flex gap-1 items-center flex-wrap">
                    <Select
                        value={typeFilter}
                        onValueChange={(value) =>
                            setTypeFilter(value)
                        }
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="INCOME">
                                Income
                            </SelectItem>

                            <SelectItem value="EXPENSE">
                                Expense
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={recurringFilter}
                        onValueChange={(value) =>
                            setRecurringFilter(value)
                        }
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="All Transactions" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="recurring">
                                Recurring Only
                            </SelectItem>

                            <SelectItem value="non-recurring">
                                Non-Recurring Only
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {selectIDs.length > 0 && (
                        <Button
                            variant="destructive"
                            onClick={() =>
                                handleDelete(selectIDs)
                            }
                            className="flex items-center"
                        >
                            <TrashIcon />
                            {`Delete Selected (${selectIDs.length})`}
                        </Button>
                    )}

                    {(searchTerm ||
                        typeFilter ||
                        recurringFilter ||
                        sortConfig.key ||
                        currentPage > 1 ||
                        selectIDs.length > 0) && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            onClick={clearAllFilters}
                                        >
                                            <X />
                                        </Button>
                                    </TooltipTrigger>

                                    <TooltipContent>
                                        <p>Clear Filters</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10">
                                <Checkbox
                                    onCheckedChange={
                                        handleSelectAll
                                    }
                                    checked={
                                        selectIDs.length ===
                                        sortedTransactions.length &&
                                        sortedTransactions.length > 0
                                    }
                                />
                            </TableHead>

                            <TableHead
                                className="cursor-pointer select-none w-10"
                                onClick={() =>
                                    handleSort("date")
                                }
                            >
                                <div className="flex items-center gap-1">
                                    Date

                                    {sortConfig.key === "date" ? (
                                        sortConfig.direction === "asc" ? (
                                            <ArrowUp className="w-4 h-4" />
                                        ) : (
                                            <ArrowDown className="w-4 h-4" />
                                        )
                                    ) : (
                                        <ArrowUpDown className="w-4 h-4 opacity-50" />
                                    )}
                                </div>
                            </TableHead>

                            <TableHead className={"w-70 max-w-70"}>
                                Description
                            </TableHead>

                            <TableHead
                                className="cursor-pointer select-none"
                                onClick={() =>
                                    handleSort("category")
                                }
                            >
                                <div className="flex items-center gap-1">
                                    Category

                                    {sortConfig.key === "category" ? (
                                        sortConfig.direction === "asc" ? (
                                            <ArrowUp className="w-4 h-4" />
                                        ) : (
                                            <ArrowDown className="w-4 h-4" />
                                        )
                                    ) : (
                                        <ArrowUpDown className="w-4 h-4 opacity-50" />
                                    )}
                                </div>
                            </TableHead>

                            <TableHead
                                className="cursor-pointer select-none text-right"
                                onClick={() =>
                                    handleSort("amount")
                                }
                            >
                                <div className="flex items-center justify-end gap-1">
                                    Amount

                                    {sortConfig.key === "amount" ? (
                                        sortConfig.direction === "asc" ? (
                                            <ArrowUp className="w-4 h-4" />
                                        ) : (
                                            <ArrowDown className="w-4 h-4" />
                                        )
                                    ) : (
                                        <ArrowUpDown className="w-4 h-4 opacity-50" />
                                    )}
                                </div>
                            </TableHead>

                            <TableHead>
                                Recurring
                            </TableHead>

                            <TableHead className="w-10" />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {currentTransactions.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="text-center text-muted-foreground"
                                >
                                    No Transaction Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentTransactions.map(
                                (transaction) => (
                                    <TableRow
                                        key={transaction.id}
                                    >
                                        <TableCell>
                                            <Checkbox
                                                onCheckedChange={() =>
                                                    handleSelect(
                                                        transaction.id
                                                    )
                                                }
                                                checked={selectIDs.includes(
                                                    transaction.id
                                                )}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {format(
                                                new Date(
                                                    transaction.date
                                                ),
                                                "PP"
                                            )}
                                        </TableCell>

                                        <TableCell className="max-w-40">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger className="truncate block max-w-60">
                                                        {transaction.description}
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{transaction.description}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>

                                        <TableCell>
                                            <div
                                                style={{
                                                    backgroundColor:
                                                        categoryColors[
                                                        transaction.category
                                                        ],
                                                }}
                                                className="text-white w-fit px-3 py-1 rounded-md"
                                            >
                                                {
                                                    transaction.category
                                                }
                                            </div>
                                        </TableCell>

                                        <TableCell
                                            className={`font-bold text-right ${transaction.type ===
                                                "EXPENSE"
                                                ? "text-red-500"
                                                : "text-green-500"
                                                }`}
                                        >
                                            {transaction.type ===
                                                "EXPENSE"
                                                ? "-"
                                                : "+"}
                                            ₹
                                            {transaction.amount.toFixed(
                                                2
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <TooltipProvider>
                                                {transaction.isRecurring ? (
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Badge
                                                                variant="secondary"
                                                                className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                                                            >
                                                                <RefreshCcw className="h-3 w-3" />

                                                                {
                                                                    RECURRING_INTERVALS[
                                                                    transaction
                                                                        .recurringInterval
                                                                    ]
                                                                }
                                                            </Badge>
                                                        </TooltipTrigger>

                                                        <TooltipContent>
                                                            <div className="text-sm">
                                                                <div>
                                                                    Next
                                                                    Date:
                                                                </div>

                                                                <div>
                                                                    {format(
                                                                        new Date(
                                                                            transaction.nextRecurringDate
                                                                        ),
                                                                        "PPP"
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="gap-1"
                                                    >
                                                        <Clock className="h-3 w-3" />
                                                        One-time
                                                    </Badge>
                                                )}
                                            </TooltipProvider>
                                        </TableCell>

                                        <TableCell className="w-10">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost">
                                                        ...
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            router.push(
                                                                `/transactions/create?edit=${transaction.id}`
                                                            )
                                                        }
                                                    >
                                                        <PencilIcon />
                                                        Edit
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator />

                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleDelete([
                                                                transaction.id,
                                                            ])
                                                        }
                                                    >
                                                        <TrashIcon />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            )
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-center space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        setCurrentPage((prev) =>
                            Math.max(prev - 1, 1)
                        )
                    }
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>

                <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                        )
                    }
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}