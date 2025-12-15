// src/server.js
import Fastify from 'fastify';
import fastifyWs from '@fastify/websocket';
import fastifyFormBody from '@fastify/formbody';
import { initAppInsights } from './utils/appinsights.js'
initAppInsights();
import { config } from './config/index.js';
import { setupSecurity } from './middleware/security.js';
import { logger } from './utils/logger.js';
import { setupRoutes } from './routes/index.js';

const app = Fastify({
    logger,
    trustProxy: config.server.trustProxy,
    connectionTimeout: config.server.connectionTimeout,
    disableRequestLogging:true,
});

async function startServer() {
    try {      

        // Register plugins
        await app.register(fastifyWs);
        await app.register(fastifyFormBody)

        // Setup security
        await setupSecurity(app);

        // Setup routes
        await setupRoutes(app);

        // Start server
        await app.listen({
            port: config.server.port,
            host: config.server.host
        });

        logger.info(`Server listening on ${config.server.host}:${config.server.port}`);
    } catch (error) {
        logger.error('Error starting server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received. Shutting down...');
    await app.close();
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

startServer();
