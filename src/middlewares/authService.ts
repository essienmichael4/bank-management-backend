import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import { findUserById } from "../controllers/userController";
import { AuthRequest } from "../models/authRequest.model";

dotenv.config()

export async function authenticateToken(req:AuthRequest, res:Response, next:NextFunction) {
    let token = req.headers["authorization"]?.split(" ")[1]
    
    if(!token) return res.sendStatus(401)    

    try{
        const jwtPayload = jwt.verify(token,  process.env.JWT_SECRET || "secret") as {id:number}
        
        const user = await findUserById(jwtPayload.id)

        if(!user){
            return res.status(401).json({error: "Api token invalid, Please login and try again"})
        }

        req.account = user!
    }catch(e){
        return res.sendStatus(401)
    }

    next()
}