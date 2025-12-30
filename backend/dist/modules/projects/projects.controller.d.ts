import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { User } from '../users/entities/user.entity';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: CreateProjectDto, user: User): Promise<import("./entities/project.entity").Project>;
    findAll(user: User): Promise<import("./entities/project.entity").Project[]>;
    findOne(id: string, user: User): Promise<import("./entities/project.entity").Project>;
    update(id: string, updateProjectDto: UpdateProjectDto, user: User): Promise<import("./entities/project.entity").Project>;
    remove(id: string, user: User): Promise<void>;
    addMember(id: string, memberId: string, user: User): Promise<import("./entities/project.entity").Project>;
    removeMember(id: string, memberId: string, user: User): Promise<import("./entities/project.entity").Project>;
}
