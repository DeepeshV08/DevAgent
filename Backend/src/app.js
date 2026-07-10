import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRoutes.js'
import projectRouter from './routes/projectRoutes.js'
import cors from 'cors'
const app = express()


app.use(express.json())
app.use(morgan())
app.use(cookieParser())
app.use(cors())

app.use('/api/auth', authRouter)
app.use('/api/projects', projectRouter)

export default app