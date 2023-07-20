import { Router } from "express";
// import { authenticateToken } from "../middlewares/authService";
import { getLoanBalanceOverview, getLoanInterestOverview, getSavingsBalanceOverview } from "../controllers/overviewController";
import { Overview } from "../models/overview.model";

const router = Router()

router.get("/dashboard",async (req,res) => {
    const totalSavings = await getSavingsBalanceOverview() 
    const totalLoans = await getLoanBalanceOverview()
    const totalInterest = await getLoanInterestOverview() 

    const loans = totalLoans.reduce((acc:number, bal, currIndex)=>{
        return acc= bal.balance;
    }, 0)
    const savings = totalSavings.reduce((acc:number, bal, currIndex)=>{
        return acc= bal.balance;
    }, 0)
    const interests = totalInterest.reduce((acc:number, bal, currIndex)=>{
        return acc= bal.interest;
    }, 0)

    const overview:Overview[]  = [{
        title: "Total Revenue",
        balance: loans+savings,
        tag: "revenue"
    },{
        title: "Current Account",
        balance: savings-loans,
        tag: "current"
    },{
        title: "Total Savings",
        balance: savings,
        tag: "savings"
    },{
        title: "Total Loans",
        balance: loans,
        tag: "loans"
    },{
        title: "Total Interest",
        balance: interests,
        tag: "interest"
    }]
    
    res.send(overview)
})

router.get("/transactions/:id")
router.post("/transactions/:id")

export default router