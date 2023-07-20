import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import userRoute from './routes/userRoute'
import authRoute from './routes/authRoute'
import savingRoute from './routes/savingRoute'
import loanRoute from './routes/loanRoute'
import overviewRoute from './routes/overviewRoute'
import transactionRoute from './routes/transactionRoute'

const app = express()
dotenv.config()

const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())
app.use("/api/v1", authRoute)
app.use("/api/v1", userRoute)
app.use("/api/v1/saving", savingRoute)
app.use("/api/v1/loan", loanRoute)
app.use("/api/v1/overview", overviewRoute)
app.use("/api/v1/", transactionRoute)

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);    
})
