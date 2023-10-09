import { Router } from "express";
import nodemailer from 'nodemailer';
import { activateSavingAccount, closeSavingAccount, countAccounts, createSavingsAccount, disableSavingAccount, getAccountByAccountNumber, getAccountById, getAllAccounts, getLastAccountNumber, updateSavingsAccount } from "../controllers/savingController";
import { SavingAccount, UpdateSavingAccount } from "../models/account.model";
import { authenticateToken } from "../middlewares/authService";
import { AuthRequest } from "../models/authRequest.model";

const router = Router()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
});

router.get("/account/:id", authenticateToken, async (req, res)=>{
    try{
        const {id} = req.params
        const dbAccount = await getAccountById(id)

        if(!dbAccount){
            return res.status(400).send({error: "This account does not exist"})
        }

        res.send(dbAccount)

    }catch(e){
        res.status(401).json({error: "Account server Error"})
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

router.get("/accounts", authenticateToken, async(req, res)=>{
    try{
        const accounts = await getAllAccounts()
        const count = await countAccounts()

        const result = {accounts,count}
        res.send(result)
    }catch(e){
        res.status(401).json({error: "e.error"})
    }
})

router.get("/account", authenticateToken, async(req, res)=>{
    try{
        const dbAccounts = await getAllAccounts()
        res.send(dbAccounts)
    }catch(e){
        res.status(401).json({error: "e.error"})
    }
})

router.post("/account", authenticateToken, async (req,res)=>{
    
    try{
        const accountRequest:SavingAccount = req.body
        
        const result = await createSavingsAccount(accountRequest)
        const { to, subject, text } = {
            to: result!.email,
            subject: "BMS Account Created",
            text: `User Account created with account number: ${result.account}. Thank you for banking with us.`
        }

        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to,
            subject,
            text,
          };
      
        await transporter.sendMail(mailOptions);
        res.send(result)
    }catch(e){
        console.log(e);
        
        res.status(400).json({error: "Create Account Server Error"})
    }
})

router.put("/account/:id", authenticateToken, async (req:AuthRequest, res)=>{
    try{
        const {id} = req.params
        const tokenAccount = req.tokenAccount
        if(tokenAccount?.role == "USER"){
            return res.status(401).json({error: "User is not allowed to make updates"})
        }
        const accountRequest:UpdateSavingAccount = req.body

        const result = await updateSavingsAccount(id,accountRequest)
        res.send(result)
    }catch(e){
        res.status(400).json({error: "Create Account Server Error"})
    }
})

router.put("/close/:account", authenticateToken, async (req:AuthRequest, res) => {
    try{
        const {account} = req.params
        const grantedBy = req.tokenAccount
        
        
        if(grantedBy!.role == "USER"){
            return res.status(401).json({error: "User is not permitted to close accounts"})
        }

        const savingAccount = await getAccountByAccountNumber(account); 

        if(!savingAccount){
            res.status(404).json({error: "Account does not exist"})
        }

        const granted = await closeSavingAccount(savingAccount!.account)
        res.send({granted, message: "Account cloased successfully"})

    }catch(err){
        res.status(401).json({error: "Server Error"})
    }
})

router.put("/disable/:account", authenticateToken, async (req:AuthRequest, res) => {
    try{
        const {account} = req.params
        const grantedBy = req.tokenAccount
        
        
        if(grantedBy!.role == "USER"){
            return res.status(401).json({error: "User is not permitted to close accounts"})
        }

        const savingAccount = await getAccountByAccountNumber(account); 

        if(!savingAccount){
            res.status(404).json({error: "Account does not exist"})
        }

        const disabled = await disableSavingAccount(savingAccount!.account)
        res.send({disabled, message: "Account disabled successfully"})

    }catch(err){
        res.status(401).json({error: "Server Error"})
    }
})

router.put("/activate/:account", authenticateToken, async (req:AuthRequest, res) => {
    try{
        const {account} = req.params
        const grantedBy = req.tokenAccount
        
        
        if(grantedBy!.role == "USER"){
            return res.status(401).json({error: "User is not permitted to close accounts"})
        }

        const savingAccount = await getAccountByAccountNumber(account); 

        if(!savingAccount){
            res.status(404).json({error: "Account does not exist"})
        }

        const granted = await activateSavingAccount(savingAccount!.account)
        res.send({granted, message: "Account activated successfully"})

    }catch(err){
        res.status(401).json({error: "Server Error"})
    }
})

export default router
