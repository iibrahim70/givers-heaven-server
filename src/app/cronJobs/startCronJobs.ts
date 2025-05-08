import { cleanupExpiredVerificationsJob } from '../modules/Verification/cron/cleanupExpiredVerifications.job';

export const startCronJobs = () => {
  cleanupExpiredVerificationsJob();
};
