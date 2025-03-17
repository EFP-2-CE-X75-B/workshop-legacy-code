import dotenv from 'dotenv';
import { DeliveryStrategy } from '../types/delivery-strategy.interface';
import { Notification } from '../types/notification.interface';
import nodemailer from 'nodemailer';

dotenv.config();

/**
 * The EmailStrategy class is responsible for sending notifications via email.
 * 
 * @author [Steve Lebleu]
 * @version 1.0
 */
export class EmailStrategy implements DeliveryStrategy {
  private transporter: nodemailer.Transporter;
  private emailAddress: string;

  constructor(email: string) {
    this.emailAddress = email;

    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: true
      }
    });
  }

  async send(notification: Notification): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: this.emailAddress,
        subject: `Notification: ${notification.type}`,
        text: notification.message,
        html: `<p><strong>${notification.type}:</strong> ${notification.message}</p>`
      });
      return true;
    } catch (error) {
      console.error('Email delivery failed:', error);
      return false;
    }
  }
} 