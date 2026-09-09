import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';
import logger from './logger.js';

interface EmailButtonContent {
  color: string;
  text: string;
  link: string;
}

interface EmailActionContent {
  instructions: string;
  button: EmailButtonContent;
}

interface EmailBodyContent {
  name: string;
  greeting: string;
  intro: string[];
  action: EmailActionContent;
  outro: string[];
  signature: string;
}

interface MailgenContent {
  body: EmailBodyContent;
}

interface SendEmailOptions {
  email: string;
  subject: string;
  mailgenContent: MailgenContent;
}

async function sendEmail(options: SendEmailOptions): Promise<void> {
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'Task Manager',
      link: 'https://taskmanagelink.com',
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST ?? '',
    port: Number(process.env.MAILTRAP_SMTP_PORT ?? 587),
    auth: {
      user: process.env.MAILTRAP_SMTP_USER ?? '',
      pass: process.env.MAILTRAP_SMTP_PASS ?? '',
    },
  });

  const mail = {
    from: 'mail.taskmanager@example.com',
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    logger.error(`Error while sending email: ${error}`);
  }
}

function emailVerificationMailGenContent(
  username: string,
  verificationUrl: string,
): MailgenContent {
  return {
    body: {
      name: username,
      greeting: 'Hello',
      intro: [
        'Welcome to Project Management System!',
        'Please verify your email address to activate your account and get started.',
      ],
      action: {
        instructions: 'Click the button below to verify your email address:',
        button: {
          color: '#2563EB',
          text: 'Verify Email Address',
          link: verificationUrl,
        },
      },
      outro: [
        'This verification link will expire soon for your security.',
        'If you did not create an account, you can safely ignore this email.',
      ],
      signature: 'Best regards,\nThe Project Management System Team',
    },
  };
}

function forgotPasswordMailGenContent(username: string, resetPasswordUrl: string): MailgenContent {
  return {
    body: {
      name: username,
      greeting: 'Hello',
      intro: [
        'We received a request to reset your password.',
        'Click the button below to create a new password for your account.',
      ],
      action: {
        instructions: 'Reset your password by clicking the button below:',
        button: {
          color: '#2563EB',
          text: 'Reset Password',
          link: resetPasswordUrl,
        },
      },
      outro: [
        'This password reset link will expire soon for your security.',
        'If you did not request a password reset, you can safely ignore this email.',
      ],
      signature: 'Best regards,\nThe Project Management System Team',
    },
  };
}

export { emailVerificationMailGenContent, forgotPasswordMailGenContent };
