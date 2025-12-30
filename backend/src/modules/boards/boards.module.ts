import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { Board } from './entities/board.entity';
import { ProjectsModule } from '../projects/projects.module';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]),
    forwardRef(() => ProjectsModule),
    forwardRef(() => ActivityModule),
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
  exports: [BoardsService],
})
export class BoardsModule {}
