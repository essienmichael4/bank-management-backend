import { Router } from "express";
import { authenticateToken } from "../middlewares/authService";
import { LoanAccount } from "../models/account.model";
import { createLoan, getAllLoans, getLoanById, updateLoan } from "../controllers/loanController";
import { AuthRequest } from "../models/authRequest.model";

const router = Router()

//Get All Loans
router.get("/",authenticateToken, async (req, res)=>{
    try{
        const result = await getAllLoans()
        res.send(result)
    }catch(err){
        res.status(401).json({error: "Server error"})
    }
})

//Get Single Loan
router.get("/:id",authenticateToken, async (req,res)=>{
    try{
        const {id} = req.params
        const result = await getLoanById(id)
        res.send(result)
    }catch(err){
        res.status(401).json({error: "Server error"})
    }
})

// Create Loan
router.post("/",authenticateToken, async (req:AuthRequest, res) => {
    // try{
        const account = req.tokenAccount
        const loan:LoanAccount = req.body

        if(loan.loanDetail.state != "NEW" && account!.role == "USER"){
            return res.status(401).json(
                {error: `User is not permitted to make ${loan.loanDetail.state} loan request`}
            )
        }

        if(loan.loanDetail.state != "NEW" && account!.role != "USER"){
            loan.loanDetail.grantedBy = String(account!.id)
        }

        const result = await createLoan(loan)
        res.send({result, message: "Loan created successfully"})
    // }catch(err){
    //     res.status(401).json({error: "Server error"})
    // }
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


export default router
