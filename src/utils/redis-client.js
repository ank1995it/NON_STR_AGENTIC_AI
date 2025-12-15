
/** 
import redis from 'redis';
import { logger } from './logger.js';
import { config } from '../config/index.js';



class RedisClient {
    static instance = null;
    static instancePromise = null;

     constructor() {
        // Return existing instance if already created
        if (RedisClient.instance) {
            return RedisClient.instance;
        }

        this.config = {
            socket: {
                host: config.redis.hostName,
                port: config.redis.port || 6380,
                tls: true,
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        logger.error('Too many reconnection attempts');
                        return new Error('Too many retries');
                    }
                    logger.info(`Reconnecting... attempt ${retries}`);
                    return Math.min(retries * 100, 3000); // Max 3 seconds between retries
                }
            },
            password: config.redis.password 
        };
        
        this.client = null;
        this.isConnected = false;
        this.connectionPromise = null;
        
        // Store as singleton instance
        RedisClient.instance = this;
        
        // Start connection
        this.connectionPromise = this.connect();
    }

    static getInstance(config = {}) {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient(config);
        }
        return RedisClient.instance;
    }

    async connect() {
        if (this.isConnected) {
            return;
        }

        try {
            this.client = redis.createClient(this.config);

            this.client.on('error', (err) => {
                logger.error('Redis Client Error:', err);
                this.isConnected = false;
            });

            this.client.on('ready', () => {
                logger.info('Redis client is ready');
                this.isConnected = true;
            });

            this.client.on('reconnecting', () => {
                logger.info('Redis client is reconnecting...');
                this.isConnected = false;
            });

            this.client.on('end', () => {
                logger.info('Redis connection closed');
                this.isConnected = false;
            });

            await this.client.connect();
        } catch (err) {
            logger.error('Failed to connect to Redis:', err);
            throw err;
        }
    }

    async ensureConnected() {
        await this.connectionPromise;
        
        if (!this.isConnected) {
            logger.info('Reconnecting to Redis...');
            this.connectionPromise = this.connect();
            await this.connectionPromise;
        }
    }

    async get(key) {
        await this.ensureConnected();
        
        try {
            const value = await this.client.get(key);
            
            if (value) {
                try {
                    return JSON.parse(value);
                } catch (err) {
                    return value;
                }
            }
            return value;
        } catch (err) {
            logger.error(`Error getting key "${key}":`, err);
            throw err;
        }
    }

    async disconnect() {
        if (this.client && this.isConnected) {
            await this.client.quit();
            logger.info('Disconnected from Redis');
            this.isConnected = false;
            RedisClient.instance = null;
        }
    }

    static reset() {
        RedisClient.instance = null;
    }
}
export default RedisClient;
*/