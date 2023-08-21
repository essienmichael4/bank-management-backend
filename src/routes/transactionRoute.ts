import { Router } from "express";
import { authenticateToken } from "../middlewares/authService";
import { countTransactions, createLoanTransaction, createSavingTransaction, getAllTransactions, getDashboardTransactions, getLastReceipt, getSingleTransaction } from "../controllers/transactionsController";
import { TransactionRequest } from "../models/transactionRequest.model";
import { getAllLoans, getLoanByAccountNumber } from "../controllers/loanController";
import { getAccountByAccountNumber, getAllAccounts } from "../controllers/savingController";
import { AuthRequest } from "../models/authRequest.model";
import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

const router = Router()

router.get("/transactions/dashboard", async (req,res)=>{
    const transactions = await getDashboardTransactions()
    const count = await countTransactions()

    const result = {transactions, count}

    res.send(result)
})

router.get("/transactions/accounts", async (req,res)=>{
    
    const savingAccount = await getAllAccounts()
    const loanAccount = await getAllLoans()
    const allAccounts = [...savingAccount, ...loanAccount]

    res.send(allAccounts)
})

router.get("/transactions", async (req,res)=>{
    const transactions = await getAllTransactions()
    const count = await countTransactions()

    const result = {transactions, count}

    res.send(result)
})

router.get("/departments", async (req, res) => {
    console.log("Hi");
    
    const departments = await prisma.department.findMany({select:{office:true}})
    // console.log(departments.forEach(department=> department.office))
    res.send(departments)
})

router.get("/transactions/:id", async (req,res)=>{
    const {id} = req.params
    const result = await getSingleTransaction(id)
    res.send(result)
})

router.post("/transactions", authenticateToken, async (req:AuthRequest,res) => {
    const account = req.tokenAccount
    const transaction:TransactionRequest = req.body

    const response: any = await getLastReceipt()

    let receipt = response.receipt ? Number(response!.receipt) + 1 : 10001

    if(transaction.transactionType == "LOAN_PAYMENT"){
        const loanAccount = await getLoanByAccountNumber(transaction.accountNumber)
        
        if(!loanAccount){
            return res.status(401).json(
                {error: `Loan with account number ${transaction.accountNumber} was not found. Please try again?`}
            )
        }

        const loanBalance = Number(loanAccount!.balance) - Number(transaction.transactedAmount)

        if(loanBalance <= 0){
            loanAccount.status = "PAID"
        }

        const result = await createLoanTransaction(loanAccount, transaction, loanBalance, account!.id, receipt.toString())

        res.send({result, message: `Transaction successful with receipt ${receipt}`})

    }else{
        const savingAccount = await getAccountByAccountNumber(transaction.accountNumber)

        if(!savingAccount){
            return res.status(401).json(
                {error: `Saving with account number ${transaction.accountNumber} was not found. Please try again?`}
            )
        }

        let savingBalance = 0
        
        if(transaction.transactionType == "DEPOSITE"){
            savingBalance = Number(savingAccount.balance) + Number(transaction.transactedAmount)
        }else{
            savingBalance = Number(savingAccount.balance) - Number(transaction.transactedAmount)
            if(savingBalance < 0){
                return res.status(401).json(
                    {error: `The debit amount exceeds the balance  in the account`}
                )
            }
        }

        const result = await createSavingTransaction(savingAccount, transaction, savingBalance, account!.id, receipt.toString())
        
        res.send({result, message: `Transaction successful with receipt ${receipt}`})
    }
})

export default router

function getAllDepartments() {
    throw new Error("Function not implemented.");
}
