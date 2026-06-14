import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import router from './routes'
import { errorMiddleware } from './middlewares/error.middleware'

const app = express()
// console.log(process.env)

app.use(cors())
app.use(express.json())


app.use('/api', router)
app.use(errorMiddleware)


const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
