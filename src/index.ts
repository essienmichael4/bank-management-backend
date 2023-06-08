import express from "express";
import cors from 'cors'
import userRoute from './routes/userRoute'
import authRoute from './routes/authRoute'
import savingRoute from './routes/savingRoute'
import loanRoute from './routes/loanRoute'

const app = express()

app.use(express.json())
app.use(cors())
app.use("/api/v1", authRoute)
app.use("/api/v1", userRoute)
app.use("/api/v1/saving", savingRoute)
app.use("/api/v1/loan", loanRoute)

app.listen("3000", ()=>{
    console.log("Server running on port 3000");    
})
