import { TaskStatus, TaskPriority } from '../../../common/enums';
import { Board } from '../../boards/entities/board.entity';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Activity } from '../../activity/entities/activity.entity';
export declare class Task {
    id: string;
    title: string;
    description: string;
    taskKey: string;
    status: TaskStatus;
    priority: TaskPriority;
    position: number;
    dueDate: Date;
    estimatedHours: number;
    loggedHours: number;
    labels: string[];
    createdAt: Date;
    updatedAt: Date;
    board: Board;
    boardId: string;
    assignee: User;
    assigneeId: string;
    reporter: User;
    reporterId: string;
    comments: Comment[];
    activities: Activity[];
}
