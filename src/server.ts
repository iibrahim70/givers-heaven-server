import mongoose from 'mongoose';
import app from './app';
import { logger } from './app/logger/winston.logger';
import colors from 'colors';
import { Server } from 'http';
import { seedSuperAdmin } from './app/seeds/superAdmin.seeds';
import { startCronJobs } from './app/cronJobs/startCronJobs';
import { envConfig } from './app/config';

let server: Server;

async function main() {
  try {
    const connectionInstance = await mongoose.connect(
      `${envConfig.dbURL}/${envConfig.collectionName}`,
    );

    // Seed super admin
    seedSuperAdmin();

    // Start all cron jobs
    startCronJobs();

    logger.info(
      colors.bgGreen.bold(
        `✅ Database Connected! Host: ${connectionInstance?.connection?.host}`,
      ),
    );

    server = app.listen(
      Number(envConfig.port),
      envConfig.ipAddress as string,
      () => {
        logger.info(
          colors.bgGreen.bold(
            `🚀 Server running on: ${envConfig.ipAddress}:${envConfig.port}`,
          ),
        );
      },
    );
  } catch (error) {
    logger.error(colors.bgCyan.bold(`❌ MongoDB connection error: ${error}`));
    process.exit(1);
  }
}

main();

process.on('unhandledRejection', (error) => {
  logger.error(
    colors.bgYellow.bold(`⚠️ Unhandled rejection, shutting down... ${error}`),
  );

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error(
    colors.bgRed.bold(`❌ Uncaught exception: ${error}, shutting down...`),
  );
  process.exit(1);
});
