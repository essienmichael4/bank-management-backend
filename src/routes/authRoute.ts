import { Router } from "express";
import  jwt  from "jsonwebtoken";
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

import { findUserByEmail, findUserByUsername } from "../controllers/userController";


const router = Router()
dotenv.config()

router.get("/auth", (req, res)=>{
    
    // res.status(401).json({error: "Not Implemented"})
})

router.post("/auth/login",  async (req, res)=>{
    const {email, password} = req.body

    let user = await findUserByEmail(email)
    if (!user){
        user = await findUserByUsername(email)
    }

    if(!user){
        return res.status(401).json({error: "User does not exist"})
    }

    const passVerify = await bcrypt.compare(password, user.password)
    if(!passVerify){
        return res.status(401).json({error: "Password does not match"})
    }

    const id = user.id
    const jwtPayload = {id}

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET || "secret", {algorithm:"HS256",expiresIn:"12h"})
    
    res.send({user, token})
})

export default router
