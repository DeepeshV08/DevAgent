import redis, { Redis } from 'ioredis'


const redisClient = new Redis({
    host : process.env.REDIS_HOST,
    port:process.env.REDIS_POST,
    password : process.env.REDIS_PASSWORD
})

redisClient.on('connect', () => {
    console.log("Redis connected")
})

export default redisClient