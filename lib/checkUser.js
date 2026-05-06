import { currentUser } from '@clerk/nextjs/server'
import db from "@/lib/prisma"

export default async function checkUser() {
    const user = await currentUser()

    if (!user) {
        console.log("user not found!")
        return 
    }
    
    try {
        const databaseUser = await db.user.findUnique({
            where: { clerkUserId: user.id },
        })

        if (databaseUser) {
            return databaseUser
        }
        
        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name: user.fullName,
                email: user.emailAddresses[0].emailAddress,
                imageUrl: user.imageUrl
            },
        })
        return newUser
        
        
    } catch (err) {
        console.error(err.message)
    }
}