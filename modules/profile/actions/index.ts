import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";



export const CurrentUserName = async () => {
        const user=await currentUser();

        const currentUserName=await prisma.user.findUnique({
            where:{
                clerkId:user?.id
            },
            select:{
                firstName:true,
             
                
            }
        });
        return currentUserName;
    }