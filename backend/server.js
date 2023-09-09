import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import taskRoutes from './routes/taskRoutes.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '100mb' }))
dotenv.config()

app.use('/api/tasks', taskRoutes)

app.get('/', (req, res) => {
    res.json('API is running')
})

app.listen(5000, () => {
    console.log("connected to backend");
})