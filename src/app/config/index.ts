import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  // Server Config
  port: process.env.PORT,
  ipAddress: process.env.IP_ADDRESS,
  nodeEnv: process.env.NODE_ENV,
  corsOrigin:
    process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) || [],

  // Database Config
  dbURL: process.env.DATABASE_URL,
  collectionName: process.env.COLLECTION_NAME,

  // Super Admin Config
  superAdminName: process.env.SUPER_ADMIN_NAME,
  superAdminEmail: process.env.SUPER_ADMIN_EMAIL,
  superAdminPassword: process.env.SUPER_ADMIN_PASSWORD,
  superAdminRole: process.env.SUPER_ADMIN_ROLE,

  // Security & JWT
  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,

  // SMTP Config
  smtpEmailUser: process.env.SMTP_EMAIL_USER,
  smtpEmailPass: process.env.SMTP_EMAIL_PASS,
};
