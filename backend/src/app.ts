import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from 'dotenv'

import cardsRoutes       from './routes/cardsRoutes'
import listingsRoutes    from './routes/listingsRoutes'
import submissionsRoutes from './routes/submissionsRoutes'
import { pool }          from './config/database'

config()

const app = express()

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5174', 'https://andreruizloera.github.io']

app.use(helmet())
app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => { console.log(`${req.method} ${req.path}`); next() })
}

app.use('/api/v1/cards',       cardsRoutes)
app.use('/api/v1/listings',    listingsRoutes)
app.use('/api/v1/submissions', submissionsRoutes)

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', db: 'ok', timestamp: new Date().toISOString() })
  } catch {
    res.status(503).json({ status: 'degraded', db: 'error' })
  }
})

app.get('/', (_req, res) => res.json({ name: 'PlaysWell API', version: '1.0.0' }))

app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

export default app
