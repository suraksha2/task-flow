import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../../../common/enums';
import { Project } from '../../projects/entities/project.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Activity } from '../../activity/entities/activity.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Project, (project) => project.owner)
  ownedProjects: Project[];

  @ManyToMany(() => Project, (project) => project.members)
  projects: Project[];

  @OneToMany(() => Task, (task) => task.assignee)
  assignedTasks: Task[];

  @OneToMany(() => Task, (task) => task.reporter)
  reportedTasks: Task[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
