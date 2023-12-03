import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendEmail(mailData: {
    template: string;
    subject: string;
    context: Record<string, any>;
    to: string;
  }) {
    const { to, subject, template, context } = mailData;
    try {
      const result = await this.mailerService.sendMail({
        to,
        subject,
        template: `./${template}`,
        context,
      });
      console.log('Email sent successfully: ', result);
    } catch (error) {
      console.log('Error sending email: ', error);
      throw error;
    }
  }
}
