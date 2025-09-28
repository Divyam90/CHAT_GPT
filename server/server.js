import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDb from './config/db.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import creditRouter from './routes/creditRoutes.js'
import { stripeWebhooks } from './controllers/webhooks.js'

const app = express()

await connectDb()

// Stripe Webhooks
app.post('/api/stripe',express.raw({type:'application/json'}),stripeWebhooks)

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.get('/' , (req,res)=>{
    res.send("API WORKING")
})


app.use('/api/user',userRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)
app.use('/api/credit',creditRouter)

// MongoDb Connection

const PORT = process.env.PORT || 4000

app.listen(PORT , ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})