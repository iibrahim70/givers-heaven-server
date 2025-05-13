import nodemailer from 'nodemailer';
import { ISendEmail } from '../interfaces/sendEmail.interface';
import { logger } from '../logger/winston.logger';
import colors from 'colors';
import { envConfig } from '../config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: envConfig.smtpEmailUser,
    pass: envConfig.smtpEmailPass,
  },
});

export const sendEmail = async (payload: ISendEmail) => {
  try {
    const info = await transporter.sendMail({
      from: envConfig.smtpEmailUser,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
    logger.info(
      colors.bgGreen(`✅ Email successfully sent to: ${info?.accepted}`),
    );
  } catch (error) {
    logger.error(colors.bgRed(`❌ Email sending failed: ${error}`));
  }
};
