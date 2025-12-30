import { CreateTaskDto } from './create-task.dto';
declare const UpdateTaskDto_base: import("@nestjs/common").Type<Partial<Omit<CreateTaskDto, "boardId">>>;
export declare class UpdateTaskDto extends UpdateTaskDto_base {
    loggedHours?: number;
    position?: number;
}
export {};
