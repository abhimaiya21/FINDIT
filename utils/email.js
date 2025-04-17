import nodemailer from 'nodemailer';
import logger from './logger.js';
import AppError from './AppError.js';

// Create transporter
// In utils/email.js, replace the transporter with:
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'your-ethereal-username',
      pass: 'your-ethereal-password'
    }
  });
// Verify connection
transporter.verify((error) => {
  if (error) {
    logger.error('Email server connection error:', error);
  } else {
    logger.info('Email server is ready to send messages');
  }
});

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email content
 */
export const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.email,
      subject: options.subject,
      text: options.message,
      // html: options.html (uncomment if using HTML templates)
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${options.email}`);
  } catch (err) {
    logger.error('Email sending error:', err);
    throw new AppError('There was an error sending the email. Try again later!', 500);
  }
};

// Email templates
export const emailTemplates = {
  resetPassword: (url) => `
    <h1>Password Reset Request</h1>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${url}">${url}</a>
    <p>This link will expire in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `,
  welcome: (name) => `
    <h1>Welcome to FindIt, ${name}!</h1>
    <p>Your account has been successfully created.</p>
    <p>Start reporting lost items or helping others find their belongings.</p>
  `
};