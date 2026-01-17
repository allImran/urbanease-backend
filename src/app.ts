// import express from 'express'
// import cors from 'cors'
// import router from './routes'
// import { errorMiddleware } from './middlewares/error.middleware'

// const app = express()

// app.use(cors())
// app.use(express.json())

// app.use('/api', router)
// app.use(errorMiddleware)


// // if (process.env.NODE_ENV !== 'production') {
// //   app.listen(3000, () => {
// //     console.log('Server running on http://localhost:3000')
// //   })
// // }

// export default app

// Use "type: module" in package.json to use ES modules
import express from 'express';
const app = express();
 
// Define your routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express on Vercel!' });
});
 
// Export the Express app
export default app;
