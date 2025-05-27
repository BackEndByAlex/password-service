import express from 'express'
import { router } from './routes/router.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(express.json())
app.use('/', router)

export default app
