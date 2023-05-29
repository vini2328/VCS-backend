import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors';
import connectDB from './config/connectdb.js';
import userRoutes from './routes/userRoutes.js'
import RepoRoutes from './routes/RepoRoutes.js'


const DATABASE_URL = process.env.DATABASE_URL
const app = express()
const port =process.env.PORT

// cors policy
app.use(cors())

// database connections
connectDB(DATABASE_URL)

// json
app.use(express.json())

// load Routes
app.use('/api/user',userRoutes)
app.use('/repo',RepoRoutes)


app.listen(port,()=>{
    console.log(`server listening at http://localhost:${port}`)
})