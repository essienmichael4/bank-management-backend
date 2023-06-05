import { Router } from "express";
import { PasswordRequest, UpdateUser, User } from "../models/user.model";
import bcrypt from 'bcrypt'
import { authenticateToken } from "../middlewares/authService";
import { createUser, findUserByEmail, findUserById, findUserByUsername, updatePassword, updateUser } from "../controllers/userController";


const router = Router()

router.get("/user/:email", authenticateToken, async (req, res) => {
    const {email} = req.params
    const user = await findUserByEmail(email)
    res.send(user)
})

router.post("/user", async (req, res) =>{
    
    try {
        const user:User = req.body
        const hashPassword = await bcrypt.hash(user.password, 10)
        user.password = hashPassword

        const checkUniqueEmail = await findUserByEmail(user.email)        
        if (checkUniqueEmail){
            return res.status(400).json({error: "Email already exists."})
        }

        const checkUniqueUsername = await findUserByUsername(user.username)
        if (checkUniqueUsername){
            return res.status(400).json({error: "Username has already been taken."})
        }

        const result = await createUser(user)
        res.status(201).send(result)
        
    } catch (e) {
        res.status(400).json({error: "User could not be created"})
    }
})

router.put("/user/:id", authenticateToken,async (req, res) => {

    try{
        const id = req.params
        const account = req.body
        const user:UpdateUser = req.body
        const dbUser = await findUserByEmail(user.email!)
        if(!dbUser){
            return res.status(400).json({error: "User does not exist"})
        }

        if(id != account.id){
            if(account.role = "USER"){
                return res.status(401).json({error: "You are not permitted to make this update"})
            }
        }

        const result = await updateUser(user)
        res.send({result, msg: "User updated successfully"})
    }catch(e){
        res.status(400).json({error: "Server Error"})
    }
})

router.put("user/password/:id", authenticateToken, async (req,res)=>{
    try{
        const id = req.params
        const account = req.body
        const user:PasswordRequest = req.body

        const dbUser = await findUserById(Number(id))

        if(!dbUser){
            return res.status(400).json({error: "User does not exist"})
        }

        if(id != account.id){
            if(account.role = "USER"){
                return res.status(401).json({error: "You are not permitted to make this update"})
            }
        }

        if(user.previousPassword){
            const passVerify = await bcrypt.compare(user.previousPassword, dbUser!.password)
            if(!passVerify){
                return res.status(401).json({error: "Password does not match the accounts password"})
            }

            if(user.password != user.repeatPassword){
                return res.status(401).json({error: "The passwords do not match"})
            }
        }

        const hashPassword = await bcrypt.hash(user.password!, 10)

        const result = await updatePassword(user.id!, hashPassword)
        res.send({message: "Password updated successfully"})
    }catch(e){
        res.status(400).json({error: "e.error"})
    }
})

export default router
