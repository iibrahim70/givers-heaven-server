import cron from 'node-cron';
import { Verification } from '../verification.model';
import { logger } from '../../../logger/winston.logger';
import colors from 'colors';

export const cleanupExpiredVerificationsJob = () => {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const result = await Verification.deleteMany({
        status: 'pending',
        expireAt: { $lt: new Date() },
      });

      if (result?.deletedCount > 0) {
        logger.info(
          colors.bgGreen.bold(
            `✅ [CRON] Deleted ${result.deletedCount} expired pending verifications.`,
          ),
        );
      } else {
        logger.warn(
          colors.bgYellow.bold(
            '⚠️ [CRON] No expired pending verifications found for deletion.',
          ),
        );
      }
    } catch (error) {
      logger.error(
        colors.bgRed.bold(
          `❌ [CRON] Error during verification cleanup: ${error}`,
        ),
      );
    }
  });
};
