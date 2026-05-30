import { config } from 'dotenv'
config()

import app  from './app'
import { pool } from './config/database'

const PORT = parseInt(process.env.PORT || '4000')

async function start() {
  try {
    await pool.query('SELECT 1')
    console.log('Database connected.')
  } catch (err) {
    console.error('Database connection failed:', err)
    process.exit(1)
  }

  app.listen(PORT, () => {
    console.log(`PlaysWell API running on http://localhost:${PORT}`)
    console.log(`Health: http://localhost:${PORT}/health`)
  })
}

start()
