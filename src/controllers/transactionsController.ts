import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getDashboardTransactions= ()=>{
    return prisma.transaction.findMany({
        take:20,
        orderBy:{
            id: "desc"
        },
        include:{ 
            savingAccount: true,
            account: true,
            user: true
        }
    })
}

export const countTransactions = ()=>{
    return prisma.transaction.aggregate({
        _count:{id:true}
    })
}

export const getAllTransactions = () => {
    return prisma.transaction.findMany({
        include:{
            savingAccount:true,
            account:true,
            user: true
        }
    })
}

export const getSingleTransaction = (id:string) =>{
    return prisma.transaction.findUnique({
        where :{id:Number(id)},
        include:{
            savingAccount:true,
            account:true,
            user: true
        }
    })
}