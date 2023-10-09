import { Router } from "express";
import nodemailer from 'nodemailer';
import { authenticateToken } from "../middlewares/authService";
import { LoanAccount } from "../models/account.model";
import { closeLoanAccount, countLoans, createLoan, getAllLoans, getLastAccountNumber, getLoanByAccountNumber, getLoanById, grantLoan, loanedLoan, updateLoan } from "../controllers/loanController";
import { AuthRequest } from "../models/authRequest.model";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
});

const router = Router()

//Get All Loans
router.get("/accounts",authenticateToken, async (req, res)=>{
    try{
        const loans = await getAllLoans()
        const count = await countLoans()

        const result = ({loans, count})
        res.send(result)
    }catch(err){
        res.status(401).json({error: "Server error"})
    }
})

router.get("/accounts/number", authenticateToken, async (req,res)=>{
    try{
        const result = await getLastAccountNumber()
        res.send(result)
    }catch(e){
        res.status(400).json({error: "Something went wrong"})
    }
})

//Get Single Loan
router.get("/account/:id",authenticateToken, async (req,res)=>{
    try{
        const {id} = req.params

        const result = await getLoanById(id)
        if(!result){
            return res.status(400).send({error: "This account does not exist"})
        }
        res.send(result)
    }catch(err){
        res.status(401).json({error: "Server error"})
    }
})

// Create Loan
router.post("/account",authenticateToken, async (req:AuthRequest, res) => {
    try{
        const account = req.tokenAccount
        const loan:LoanAccount = req.body

        if(loan.loanDetail.state != "NEW" && account!.role == "USER"){
            return res.status(401).json(
                {error: `User is not permitted to make ${loan.loanDetail.state} loan request`}
            )
        }

        if(loan.loanDetail.state != "NEW" && account!.role != "USER"){
            loan.loanDetail.state = "GRANTED"
            loan.loanDetail.grantedBy = String(account!.id)
        }

        const result = await createLoan(loan)
        const { to, subject, text } = {
            to: result!.email,
            subject: "BMS Loan Account Created",
            text: `Loan Account created with loan number: ${result.account} and loan amount of ${result.balance}`
        }

        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to,
            subject,
            text,
          };
      
        await transporter.sendMail(mailOptions);
        res.send({result, message: "Loan created successfully"})
    }catch(err){
        res.status(401).json({error: "Server error"})
    }
})

// Update Loan
router.put("/:id", authenticateToken,async (req:AuthRequest, res) => {
    // try{
        const {id} = req.params
        const account = req.tokenAccount
        const loanUpdate:LoanAccount = req.body

        if(account!.role == "USER"){
            return res.status(401).json({error: "User is not permitted to make updates"})
        }

        const result = await updateLoan(id, loanUpdate)
        res.send({result, message: "Loan updated successfully"})

    // }catch(err){
    //     res.status(401).json({error: "Server Error"})
    // }
})

router.put("/grant/:account", authenticateToken,async (req:AuthRequest, res) => {
    try{
        const {account} = req.params
        const grantedBy = req.tokenAccount
        
        
        if(grantedBy!.role == "USER"){
            return res.status(401).json({error: "User is not permitted to grant loans"})
        }

        const loanAccount = await getLoanByAccountNumber(account); 

        if(!loanAccount){
            res.status(404).json({error: "Account does not exist"})
        }

        const granted = await grantLoan(loanAccount!.loanDetail!.id, grantedBy!.id)
        res.send({granted, message: "Loan granted successfully"})

    }catch(err){
        res.status(401).json({error: "Server Error"})
    }
})


router.put("/close/:account", authenticateToken,async (req:AuthRequest, res) => {  
    try{
        const {account} = req.params
        const grantedBy = req.tokenAccount
        
        if(grantedBy!.role == "USER"){
            return res.status(401).json({error: "User is not permitted to grant loans"})
        }

        const loanAccount = await getLoanByAccountNumber(account); 

        if(!loanAccount){
            res.status(404).json({error: "Account does not exist"})
        }

        const closed = await closeLoanAccount(loanAccount!.account , grantedBy!.id)
        res.send({closed, message: "Loan closed successfully"})

    }catch(err){
        res.status(401).json({error: "Server Error"})
    }
})

router.put("/loaned/:account", authenticateToken,async (req:AuthRequest, res) => {
    try{
        const {account} = req.params
        const grantedBy = req.tokenAccount

        const loanAccount = await getLoanByAccountNumber(account); 

        if(!loanAccount){
            res.status(404).json({error: "Account does not exist"})
        }

        const loaned = await loanedLoan(account, grantedBy!.id)
        res.send({loaned, message: "Loan granted successfully"})

    }catch(err){
        res.status(401).json({error: "Server Error"})
    }
})


export default router
