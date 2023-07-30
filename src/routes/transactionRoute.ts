import { Router } from "express";
import { authenticateToken } from "../middlewares/authService";
import { countTransactions, getAllTransactions, getDashboardTransactions, getSingleTransaction } from "../controllers/transactionsController";

const router = Router()

router.get("/transactions/dashboard", async (req,res)=>{
    const transactions = await getDashboardTransactions()
    const count = await countTransactions()

    const result = {transactions, count}

    res.send(result)
})
router.get("/transactions", async (req,res)=>{
    const transactions = await getAllTransactions()
    const count = await countTransactions()

    const result = {transactions, count}

    res.send(result)
})
router.get("/transactions/:id", async (req,res)=>{
    const {id} = req.params
    const result = await getSingleTransaction(id)
    res.send(result)
})

export default router