import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { TaskStatus, TaskPriority } from '../../../common/enums';
import { Board } from '../../boards/entities/board.entity';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Activity } from '../../activity/entities/activity.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ unique: true })
  taskKey: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Column({ default: 0 })
  position: number;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({ nullable: true })
  estimatedHours: number;

  @Column({ default: 0 })
  loggedHours: number;

  @Column('simple-array', { nullable: true })
  labels: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Board, (board) => board.tasks, { onDelete: 'CASCADE' })
  board: Board;

  @Column()
  boardId: string;

  @ManyToOne(() => User, (user) => user.assignedTasks, { nullable: true })
  assignee: User;

  @Column({ nullable: true })
  assigneeId: string;

  @ManyToOne(() => User, (user) => user.reportedTasks)
  reporter: User;

  @Column()
  reporterId: string;

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];

  @OneToMany(() => Activity, (activity) => activity.task)
  activities: Activity[];
}
