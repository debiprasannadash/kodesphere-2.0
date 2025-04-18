"use server";

import prisma from "@/lib/prisma";
import { checkRateLimit } from "./rateLimit";

export async function getSubmission(loggedInEmail){
     const rateLimit = await checkRateLimit();
        if(!rateLimit){
            console.log("Rate limit exceeded")
            return false
        }

    const participantData = await prisma.participant.findFirst({
        where: {
            email: loggedInEmail,
        },
    });
    
    const TEAMID = participantData?.TeamId;
    
    const {Track: track} = await prisma.team.findFirst({
        where: {
            TeamId: TEAMID
        },
        select: {
            Track: true
        }
    })

    const submissions = await prisma.submission.findFirst({
        where:{
            TeamId: TEAMID
        }
    })

    await prisma.$disconnect();
    if(submissions){
        return ({status:true, TEAMID, track})
    }

    return  ({status:false, TEAMID, track})
}