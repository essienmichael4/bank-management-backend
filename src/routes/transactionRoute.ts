import { Router } from "express";
import { authenticateToken } from "../middlewares/authService";
import { getAllTransactions, getDashboardTransactions, getSingleTransaction } from "../controllers/transactionsController";

const router = Router()

router.get("/transactions/dashboard", async (req,res)=>{
    const result = await getDashboardTransactions()
    res.send(result)
})
router.get("/transactions", async (req,res)=>{
    const result = await getAllTransactions()
    res.send(result)
})
router.get("/transactions/:id", async (req,res)=>{
    const {id} = req.params
    const result = await getSingleTransaction(id)
    res.send(result)
})

export default router