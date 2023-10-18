import { Router } from "express";
import nodemailer from 'nodemailer';
import { authenticateToken } from "../middlewares/authService";
import { countTransactions, createLoanTransaction, createSavingTransaction, getAllTransactions, getDashboardTransactions, getLastReceipt, getSingleTransaction } from "../controllers/transactionsController";
import { TransactionRequest } from "../models/transactionRequest.model";
import { getAllLoansForTransactions, getLoanByAccountNumber } from "../controllers/loanController";
import { getAccountByAccountNumber, getAllAccountsForTransactions } from "../controllers/savingController";
import { AuthRequest } from "../models/authRequest.model";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
});

const router = Router()

router.get("/transactions/dashboard", async (req,res)=>{
    const transactions = await getDashboardTransactions()
    const count = await countTransactions()

    const result = {transactions, count}

    res.send(result)
})

router.get("/transactions/accounts", async (req,res)=>{
    
    const savingAccount = await getAllAccountsForTransactions()
    const loanAccount = await getAllLoansForTransactions()
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
    const departments = await prisma.department.findMany({select:{office:true}})
    res.send(departments)
})

router.get("/transactions/:id", async (req,res)=>{
    try{
        const {id} = req.params
        const result = await getSingleTransaction(id)
        res.send(result)
    }catch(err){
        res.status(401).json({error: "Server error"})
    }
})

router.post("/transactions", authenticateToken, async (req:AuthRequest,res) => {
    try{
        const account = req.tokenAccount
        const transaction:TransactionRequest = req.body

        const response: any = await getLastReceipt()
        
        let receipt = response[0].receipt ? Number(response[0].receipt) + 1 : 10001

        if(transaction.transactionType == "LOAN_PAYMENT"){
            let loanAccount = await getLoanByAccountNumber(transaction.accountNumber)
            
            if(!loanAccount){
                return res.status(401).json(
                    {error: `Loan with account number ${transaction.accountNumber} was not found. Please try again?`}
                )
            }

            let refund = 0

            let loanBalance = Number(loanAccount!.balance) - Number(transaction.transactedAmount)

            if(loanBalance < 0){
                loanAccount.status = "PAID"
                refund = Number(transaction.transactedAmount) - Number(loanAccount!.balance) 
                loanBalance = 0
            }else if(loanBalance == 0){
                loanAccount.status = "PAID"
            }

            console.log(loanAccount.status);
            

            const result = await createLoanTransaction(loanAccount, transaction, loanBalance, account!.id, receipt.toString())
            
            if(refund > 0){
                const { to, subject, text } = {
                    to: result!.email,
                    subject: "BMS Account Transaction",
                    text: `Loan Payment of GH¢ ${transaction.transactedAmount} has been paid to loan number: ${result.account}. Loan balance left is GH¢ ${result.balance}. You will be refunded GH¢ ${refund}.
                    Thank you for banking with us.`
                }
    
                const mailOptions = {
                    from: process.env.EMAIL_SENDER,
                    to,
                    subject,
                    text,
                };
                // await transporter.sendMail(mailOptions);
                res.send({result, message: `Transaction successful with receipt ${receipt}`})
            }else{
                const { to, subject, text } = {
                    to: result!.email,
                    subject: "BMS Account Transaction",
                    text: `Loan Payment of GH¢ ${transaction.transactedAmount} has been paid to loan number: ${result.account}. Loan balance left is GH¢ ${result.balance}.
                    Thank you for banking with us.`
                }
    
                const mailOptions = {
                    from: process.env.EMAIL_SENDER,
                    to,
                    subject,
                    text,
                };
                // await transporter.sendMail(mailOptions);
                res.send({result, message: `Transaction successful with receipt ${receipt}`})
            }

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
            
            const { to, subject, text } = {
                to: result!.email,
                subject: "BMS Account Transaction",
                text: `${transaction.transactionType} transaction of GH¢ ${transaction.transactedAmount} has been made with number: ${result.account}. Account balance left is GH¢ ${result.balance}.
                Thank you for banking with us.`
            }

            const mailOptions = {
                from: process.env.EMAIL_SENDER,
                to,
                subject,
                text,
            };
        
            // await transporter.sendMail(mailOptions);

            res.send({result, message: `Transaction successful with receipt ${receipt}`})
        }
    }catch(err){
        res.status(401).json({error: "Server error"})
    }
})

export default router