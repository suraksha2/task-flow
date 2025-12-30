import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ActivityType } from '../../../common/enums';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ActivityType })
  type: ActivityType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.activities)
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Project, (project) => project.activities, { onDelete: 'CASCADE' })
  project: Project;

  @Column()
  projectId: string;

  @ManyToOne(() => Task, (task) => task.activities, { nullable: true, onDelete: 'CASCADE' })
  task: Task;

  @Column({ nullable: true })
  taskId: string;
}
