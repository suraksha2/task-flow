import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Board } from '../../boards/entities/board.entity';
import { Activity } from '../../activity/entities/activity.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ unique: true })
  key: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.ownedProjects, { eager: true })
  owner: User;

  @Column()
  ownerId: string;

  @ManyToMany(() => User, (user) => user.projects)
  @JoinTable({
    name: 'project_members',
    joinColumn: { name: 'projectId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  members: User[];

  @OneToMany(() => Board, (board) => board.project)
  boards: Board[];

  @OneToMany(() => Activity, (activity) => activity.project)
  activities: Activity[];
}
