import { createClient } from 'redis';
import { getEnvVar } from './utils/getEnvVar.js';

export const redisClient = createClient({
    username: 'default',
    password: getEnvVar('REDIS_PASSWORD'),
    socket: {
        host: getEnvVar('REDIS_HOST'),
        port: getEnvVar('REDIS_PORT')
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

await redisClient.connect();
