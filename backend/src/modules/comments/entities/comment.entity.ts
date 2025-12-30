import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Task, (task) => task.comments, { onDelete: 'CASCADE' })
  task: Task;

  @Column()
  taskId: string;

  @ManyToOne(() => User, (user) => user.comments)
  author: User;

  @Column()
  authorId: string;
}
