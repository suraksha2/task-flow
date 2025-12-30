import { TaskStatus, TaskPriority } from '../../../common/enums';
export declare class CreateTaskDto {
    title: string;
    description?: string;
    boardId: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assigneeId?: string;
    dueDate?: string;
    estimatedHours?: number;
    labels?: string[];
}
