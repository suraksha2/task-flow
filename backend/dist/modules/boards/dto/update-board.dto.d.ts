import { CreateBoardDto } from './create-board.dto';
declare const UpdateBoardDto_base: import("@nestjs/common").Type<Partial<Omit<CreateBoardDto, "projectId">>>;
export declare class UpdateBoardDto extends UpdateBoardDto_base {
}
export {};
