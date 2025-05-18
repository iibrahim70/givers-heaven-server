import mongoose from 'mongoose';
import app from './app';
import colors from 'colors';
import { Server } from 'http';
import { seedSuperAdmin } from './app/seeds/superAdmin.seeds';
import { startCronJobs } from './app/cronJobs/startCronJobs';
import { envConfig } from './app/config';
import { appLogger } from './app/logger';

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

    appLogger.info(
      colors.bgGreen.bold(
        `✅ Database Connected! Host: ${connectionInstance?.connection?.host}`,
      ),
    );

    server = app.listen(
      Number(envConfig.port),
      envConfig.ipAddress as string,
      () => {
        appLogger.info(
          colors.bgGreen.bold(
            `🚀 Server running on: ${envConfig.ipAddress}:${envConfig.port}`,
          ),
        );
      },
    );
  } catch (error) {
    appLogger.error(
      colors.bgCyan.bold(`❌ MongoDB connection error: ${error}`),
    );
    process.exit(1);
  }
}

main();

process.on('unhandledRejection', (error) => {
  appLogger.error(
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
  appLogger.error(
    colors.bgRed.bold(`❌ Uncaught exception: ${error}, shutting down...`),
  );
  process.exit(1);
});
