import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';
export declare class Comment {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    task: Task;
    taskId: string;
    author: User;
    authorId: string;
}
