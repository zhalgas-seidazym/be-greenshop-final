import connectToRedis from "../database/redis.js";

class RedisRepository {
    constructor() {
        this.client = null;
    }

    async init() {
        if (!this.client) {
            this.client = await connectToRedis();
        }
    }

    async get(key) {
        await this.init();
        return await this.client.get(key);
    }

    async set(key, value, expiry = 3600) {
        await this.init();
        return await this.client.set(key, value, {
            EX: expiry,
        });
    }

    async delete(key) {
        await this.init();
        return await this.client.del(key);
    }

    async exists(key) {
        await this.init();
        return await this.client.exists(key);
    }
}

export default RedisRepository;
