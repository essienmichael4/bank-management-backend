import { Router } from "express";
import { PasswordRequest, UpdateUser, User } from "../models/user.model";
import bcrypt from 'bcrypt'
import { authenticateToken } from "../middlewares/authService";
import { activateUser, createUser, disableUser, findAllUsers, findUserByEmail, findUserById, findUserByUsername, updatePassword, updateUser } from "../controllers/userController";
import { AuthRequest } from "../models/authRequest.model";


const router = Router()

router.get("/user/:email", authenticateToken, async (req, res) => {
    const {email} = req.params
    const user = await findUserByEmail(email)
    res.send(user)
})

router.get("/users/:id", authenticateToken, async (req, res) => {
    const {id} = req.params
    const user = await findUserById(Number(id))
    res.send(user)
})

router.get("/users", authenticateToken, async (req, res) => {
    const user = await findAllUsers()
    res.send(user)
})

router.post("/user", authenticateToken, async (req, res) =>{
    
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
        res.status(201).send({result, message:"User added successfully"})
        
    } catch (e) {
        console.log(e);
        
        res.status(400).json({error: "User could not be created"})
    }
})

router.put("/user/:id", authenticateToken, async (req, res) => {

    try{
        const {id} = req.params
        const {account} = req.body
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

router.post("/user/change-password", authenticateToken, async (req:AuthRequest,res)=>{    
    try{
        const user:PasswordRequest = req.body
        const tokenAccount = req.tokenAccount
        let isAdmin = false

        console.log(req.body);
        console.log(tokenAccount);
        

        const dbUser = await findUserById(Number(user.id))

        if(!dbUser){
            return res.status(400).json({error: "User does not exist"})
        }

        if(dbUser.id != tokenAccount!.id){
            isAdmin = true
            if(tokenAccount!.role == "USER"){
                return res.status(401).json({error: "You are not permitted to make this update"})
            }

            if(dbUser.role == "SUPERADMIN" && tokenAccount?.role != "SUPERADMIN"){
                return res.status(401).json({error: "You are not permitted to make this update"})
            }
        }

        if(!user.previousPassword){
            return res.status(401).json({error: "Please enter you account's password"})
        }

        if(isAdmin){
            const adminUser = await findUserById(Number(user.id))
            const passVerify = await bcrypt.compare(user.previousPassword, adminUser!.password)
            if(!passVerify){
                return res.status(401).json({error: "Password does not match the accounts password"})
            }
            if(user.password != user.repeatPassword){
                return res.status(401).json({error: "The passwords do not match"})
            }
        }else{
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

router.put("/user/disable/:id", authenticateToken, async (req:AuthRequest, res) => {
    try{
        const {id} = req.params
        const disabledBy = req.tokenAccount
        
        
        if(disabledBy!.role == "USER"){
            return res.status(401).json({error: "User is not permitted to close accounts"})
        }

        const userAccount = await findUserById(Number(id)); 
        if(userAccount!.role == "SUPERADMIN" && disabledBy?.role != "SUPERADMIN"){
            return res.status(401).json({error: "You are not permitted to make this update"})
        }

        if(!userAccount){
            res.status(404).json({error: "Account does not exist"})
        }

        const disabled = await disableUser(userAccount!.id)
        res.send({disabled, message: "Account disabled successfully"})

    }catch(err){
        res.status(401).json({error: "Server Error"})
    }
})

router.put("/user/activate/:id", authenticateToken, async (req:AuthRequest, res) => {
    try{
        const {id} = req.params
        const activatedBy = req.tokenAccount
        
        
        if(activatedBy!.role == "USER"){
            return res.status(401).json({error: "User is not permitted to close accounts"})
        }

        const userAccount = await findUserById(Number(id)); 
        if(userAccount!.role == "SUPERADMIN" && activatedBy?.role != "SUPERADMIN"){
            return res.status(401).json({error: "You are not permitted to make this update"})
        }

        if(!userAccount){
            res.status(404).json({error: "Account does not exist"})
        }

        const activated = await activateUser(userAccount!.id)
        res.send({activated, message: "Account activated successfully"})

    }catch(err){
        res.status(401).json({error: "Server Error"})
    }
})

export default router
