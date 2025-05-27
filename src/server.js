/**
 * @file Entry point for the Password Service.
 * @module src/server
 * @author Alexandru Antonescu
 * @version 1.0.0
 */

import '@lnu/json-js-cycle'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { randomUUID } from 'node:crypto'
import httpContext from 'express-http-context'

import connectToDatabase from './config/mongoose.js'
import { morganLogger } from './config/morgan.js'
import { logger } from './config/winston.js'
import { router } from './routes/router.js'

// Load environment variables
dotenv.config()

try {
  // Connect to MongoDB
  await connectToDatabase(process.env.MONGODB_URI)

  // Create Express application
  const app = express()

  app.set('trust proxy', 1)

  // Security headers
  app.use(helmet())

  // Enable CORS
  app.use(cors())

  // Parse JSON
  app.use(express.json())

  // Add per-request context (must be before anything that uses it)
  app.use(httpContext.middleware)

  // HTTP request logging
  app.use(morganLogger)

  // Attach a unique ID to each request
  app.use((req, res, next) => {
    req.requestUuid = randomUUID()
    httpContext.set('request', req)
    next()
  })

  // Mount routes
  app.use('/', router)

  // Error handler
  app.use((err, req, res, next) => {
    logger.error(err.message, { error: err })

    if (process.env.NODE_ENV === 'production') {
      const status = err.status || 500
      const message = err.message || 'Internal Server Error'
      return res.status(status).json({ status, message })
    }

    const copy = JSON.decycle(err, { includeNonEnumerableProperties: true })
    res.status(err.status || 500).json(copy)
  })

  // Start server
  const server = app.listen(process.env.PORT, () => {
    logger.info(`Password Service running at http://localhost:${server.address().port}`)
    logger.info('Press Ctrl-C to terminate...')
  })
} catch (err) {
  logger.error(err.message, { error: err })
  process.exitCode = 1
}
