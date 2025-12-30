import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Task } from '../tasks/entities/task.entity';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }

  async sendTaskAssignedEmail(task: Task): Promise<void> {
    if (!task.assignee?.email) return;

    const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:5173');

    try {
      await this.transporter.sendMail({
        from: this.configService.get('SMTP_FROM', 'noreply@projectflow.com'),
        to: task.assignee.email,
        subject: `[ProjectFlow] You've been assigned to: ${task.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">New Task Assignment</h2>
            <p>Hi ${task.assignee.firstName},</p>
            <p>You've been assigned to a new task:</p>
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <h3 style="margin: 0 0 8px 0;">${task.taskKey}: ${task.title}</h3>
              <p style="margin: 0; color: #6b7280;">${task.description || 'No description'}</p>
              <p style="margin: 8px 0 0 0;">
                <strong>Priority:</strong> ${task.priority}<br>
                <strong>Status:</strong> ${task.status}
              </p>
            </div>
            <a href="${frontendUrl}/tasks/${task.id}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              View Task
            </a>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
              This is an automated message from ProjectFlow.
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  async sendTaskDueSoonEmail(task: Task): Promise<void> {
    if (!task.assignee?.email) return;

    const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:5173');

    try {
      await this.transporter.sendMail({
        from: this.configService.get('SMTP_FROM', 'noreply@projectflow.com'),
        to: task.assignee.email,
        subject: `[ProjectFlow] Task due soon: ${task.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f59e0b;">Task Due Soon</h2>
            <p>Hi ${task.assignee.firstName},</p>
            <p>This is a reminder that the following task is due soon:</p>
            <div style="background: #fef3c7; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <h3 style="margin: 0 0 8px 0;">${task.taskKey}: ${task.title}</h3>
              <p style="margin: 0;">
                <strong>Due Date:</strong> ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
              </p>
            </div>
            <a href="${frontendUrl}/tasks/${task.id}" 
               style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              View Task
            </a>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }
}
