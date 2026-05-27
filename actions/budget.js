"use server";

import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { endOfMonth, startOfMonth } from "date-fns";
import { revalidatePath } from "next/cache";

export async function getCurrentBudget() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const budget = await db.budget.findUnique({
      where: { userId: user.id },
    });

    const totalExpense = await db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: {
          gte: startOfMonth(new Date()),
          lte: endOfMonth(new Date()),
        },
      },
      _sum: {
        amount: true,
      },
    });

    return {
      budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
      totalExpense: totalExpense._sum.amount?.toNumber() || 0,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateBudget(updateAmount) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const upsertBudget = await db.budget.upsert({
      where: { userId: user.id },
      update: { amount: updateAmount, lastAlertSent: null },
      create: {
        userId: user.id,
        amount: updateAmount,
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      data: { ...upsertBudget, amount: upsertBudget.amount.toNumber() },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
