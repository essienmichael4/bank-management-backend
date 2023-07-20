import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getSavingsBalanceOverview = ()=>{
    return prisma.saving.findMany({select: {balance:true}})
}

export const getLoanBalanceOverview = ()=>{
    return prisma.loan.findMany({select: {
        balance: true
    }})
}

export const getLoanInterestOverview = ()=>{
    return prisma.loanDetail.findMany({select: {
        interest:true
    }})
}



