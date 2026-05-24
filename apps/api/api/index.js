import { loadEnv } from '../src/config/env.js'
import { createApp } from '../src/app.js'

loadEnv()

const server = createApp()

export default function handler(req, res) {
  server.emit('request', req, res)
}
