import { Loan, LoanStatus, PrismaClient, Saving, TransactionType } from '@prisma/client'
import { TransactionRequest } from '../models/transactionRequest.model'
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

export const createLoanTransaction = (loanAccount:Loan, transaction:TransactionRequest, loanBalance:number, transactedBy:number, receipt:string) =>{
    return prisma.loan.update({
        where:{account: transaction.accountNumber},
        data:{
            balance: loanBalance,
            transactions: {
                create: {
                    amount: Number(transaction.transactedAmount),
                    previousAmount: Number(loanAccount.balance),
                    balanceAmount: loanBalance,
                    description: "",
                    receipt: receipt,
                    cheque: "",
                    type: TransactionType[transaction.transactionType as keyof typeof  TransactionType],
                    user: {
                        connect: {
                            id: Number(transactedBy)
                        }
                    },
                }
            }
        }
    })
}

export const createSavingTransaction = (savingAccount:Saving, transaction:TransactionRequest, savingBalance:number, transactedBy:number, receipt:string) =>{
    return prisma.saving.update({
        where:{account: transaction.accountNumber},
        data:{
            balance: savingBalance,
            transactions: {
                create: {
                    amount: Number(transaction.transactedAmount),
                    previousAmount: Number(savingAccount.balance),
                    balanceAmount: savingBalance,
                    description: "",
                    receipt: receipt,
                    cheque: "",
                    type: TransactionType[transaction.transactionType as keyof typeof  TransactionType],
                    user: {
                        connect: {
                            id: Number(transactedBy)
                        }
                    },
                }
            }
        }
    })
}

export const getLastReceipt = ()=>{
    return prisma.transaction.findMany({
        select: {receipt:true},
        orderBy: {id: "desc"},
        take: 1
    })
}
