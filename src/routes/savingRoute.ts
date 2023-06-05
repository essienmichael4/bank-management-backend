import { Router } from "express";
import { createSavingsAccount, getAccountById, getAllAccounts, updateSavingsAccount } from "../controllers/savingController";
import { SavingAccount, UpdateSavingAccount } from "../models/account.model";

const router = Router()

router.get("/account/:id", async (req, res)=>{
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

router.get("/account", async(req, res)=>{
    try{
        const dbAccounts = await getAllAccounts()
        res.send(dbAccounts)
    }catch(e){
        res.status(401).json({error: "e.error"})
    }
})

router.post("/account", async (req,res)=>{
    try{
        const accountRequest:SavingAccount = req.body

        const result = await createSavingsAccount(accountRequest)
        res.send(result)
    }catch(e){
        res.status(400).json({error: "Create Account Server Error"})
    }
    
})

router.put("/account/:id", async (req, res)=>{
    try{
        const {id} = req.params
        const accountRequest:UpdateSavingAccount = req.body

        const result = await updateSavingsAccount(id,accountRequest)
        res.send(result)
    }catch(e){
        res.status(400).json({error: "Create Account Server Error"})
    }
})


export default router
