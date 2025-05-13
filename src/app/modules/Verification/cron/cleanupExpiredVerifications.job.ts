import cron from 'node-cron';
import { Verification } from '../verification.model';
import colors from 'colors';
import { winstonLogger } from '../../../logger';

export const cleanupExpiredVerificationsJob = () => {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const result = await Verification.deleteMany({
        status: 'pending',
        expireAt: { $lt: new Date() },
      });

      if (result?.deletedCount > 0) {
        winstonLogger.info(
          colors.bgGreen.bold(
            `✅ [CRON] Deleted ${result.deletedCount} expired pending verifications.`,
          ),
        );
      } else {
        winstonLogger.warn(
          colors.bgYellow.bold(
            '⚠️ [CRON] No expired pending verifications found for deletion.',
          ),
        );
      }
    } catch (error) {
      winstonLogger.error(
        colors.bgRed.bold(
          `❌ [CRON] Error during verification cleanup: ${error}`,
        ),
      );
    }
  });
};
