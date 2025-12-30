import { ConfigService } from '@nestjs/config';
import { Task } from '../tasks/entities/task.entity';
export declare class EmailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendTaskAssignedEmail(task: Task): Promise<void>;
    sendTaskDueSoonEmail(task: Task): Promise<void>;
}
