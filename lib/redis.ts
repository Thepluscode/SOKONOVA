
import Redis from 'ioredis'

let client: Redis | null = null

export function getRedis() {
  if (!client) {
    const url = process.env.REDIS_URL
    if (!url) throw new Error('Missing REDIS_URL')
    client = new Redis(url, { maxRetriesPerRequest: 2 })
  }
  return client
}
