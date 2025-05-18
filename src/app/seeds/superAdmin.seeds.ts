import colors from 'colors';
import { Auth } from '../modules/Auth/auth.model';
import mongoose from 'mongoose';
import { User } from '../modules/User/user.model';
import { envConfig } from '../config';
import { appLogger } from '../logger';

export const seedSuperAdmin = async () => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if super admin already exists
    const isSuperAdminExists = await Auth.findOne({
      role: envConfig.superAdminRole,
    });

    if (isSuperAdminExists) {
      appLogger.warn(
        colors.bgYellow.bold(
          '⚠️ Super admin already exists, no need to create!',
        ),
      );
      return;
    }

    // create auth
    const auth = await Auth.create(
      [
        {
          email: envConfig.superAdminEmail,
          password: envConfig.superAdminPassword,
          role: envConfig.superAdminRole,
        },
      ],
      { session },
    );

    // Create User
    await User.create(
      [
        {
          authId: auth[0]?._id,
          name: envConfig.superAdminName,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    appLogger.info(colors.bgGreen.bold('✅ Super admin created successfully!'));
  } catch (error) {
    await session.abortTransaction();
    appLogger.error(
      colors.bgRed.bold(`❌ Error seeding super admin:, ${error}`),
    );
  } finally {
    await session.endSession();
  }
};
