import redis from 'redis'
import config from "../../main/config.js";

const connectToRedis = async () => {
    const client = await redis.createClient({
        socket: {
            host: config.redisHost,
            port: config.redisPort,
        },
        database: config.redisDatabase,
        password: config.redisPassword,
    });

    client.on('connect', () => {
        console.log('Connected to Redis successfully');
    });

    client.on('error', (err) => {
        console.error('Redis connection error:', err);
    });

    await client.connect();
    return client;
};

export default connectToRedis;