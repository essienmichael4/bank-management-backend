import { Router } from "express";

const router = Router()

router.get("/loan", (req, res)=>{
    res.status(401).json({error: "Not Implemented"})
})


export default router
