import {config} from 'dotenv'
config()
import Redis from 'ioredis';

const redisClient = new Redis({
    host: process.env.REDIS_HOST ,
    port: process.env.REDIS_PORT ,
    password: process.env.REDIS_PASSWORD ,
});



redisClient.on('connect', () => {
    console.log('Redis connected');
});

redisClient.on('error', (err) => {
    console.warn('Redis unavailable:', err.message);
});

export default redisClient;