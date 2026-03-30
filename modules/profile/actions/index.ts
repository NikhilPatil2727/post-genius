import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";

export const CurrentUserName = async () => {
        const { userId } = await auth();

        if (!userId) {
            return null;
        }

        const currentUserName=await prisma.user.findUnique({
            where:{
                clerkId:userId
            },
            select:{
                firstName:true,
             
                
            }
        });
        return currentUserName;
    }
