import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ default: 0 })
  position: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Project, (project) => project.boards, { onDelete: 'CASCADE' })
  project: Project;

  @Column()
  projectId: string;

  @OneToMany(() => Task, (task) => task.board)
  tasks: Task[];
}
