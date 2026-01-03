import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  userEmail?: string;
  userRole?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/ws',
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('WebSocketGateway');
  private connectedUsers = new Map<string, Set<string>>(); // userId -> Set of socketIds

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth?.token || 
                    client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      client.userId = payload.sub;
      client.userEmail = payload.email;
      client.userRole = payload.role;

      // Track connected users
      if (!this.connectedUsers.has(payload.sub)) {
        this.connectedUsers.set(payload.sub, new Set());
      }
      this.connectedUsers.get(payload.sub)?.add(client.id);

      // Join user's personal room
      client.join(`user:${payload.sub}`);

      this.logger.log(`Client connected: ${client.id} (User: ${payload.email})`);

      // Notify user of successful connection
      client.emit('connected', {
        message: 'Connected to real-time server',
        userId: payload.sub,
      });
    } catch (error) {
      this.logger.error(`Authentication failed for client ${client.id}:`, error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      const userSockets = this.connectedUsers.get(client.userId);
      if (userSockets) {
        userSockets.delete(client.id);
        if (userSockets.size === 0) {
          this.connectedUsers.delete(client.userId);
        }
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Join a project room for real-time updates
  @SubscribeMessage('joinProject')
  handleJoinProject(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { projectId: string },
  ) {
    client.join(`project:${data.projectId}`);
    this.logger.log(`Client ${client.id} joined project:${data.projectId}`);
    return { event: 'joinedProject', data: { projectId: data.projectId } };
  }

  // Leave a project room
  @SubscribeMessage('leaveProject')
  handleLeaveProject(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { projectId: string },
  ) {
    client.leave(`project:${data.projectId}`);
    this.logger.log(`Client ${client.id} left project:${data.projectId}`);
    return { event: 'leftProject', data: { projectId: data.projectId } };
  }

  // Join a board room for task updates
  @SubscribeMessage('joinBoard')
  handleJoinBoard(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { boardId: string },
  ) {
    client.join(`board:${data.boardId}`);
    this.logger.log(`Client ${client.id} joined board:${data.boardId}`);
    return { event: 'joinedBoard', data: { boardId: data.boardId } };
  }

  // Leave a board room
  @SubscribeMessage('leaveBoard')
  handleLeaveBoard(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { boardId: string },
  ) {
    client.leave(`board:${data.boardId}`);
    this.logger.log(`Client ${client.id} left board:${data.boardId}`);
    return { event: 'leftBoard', data: { boardId: data.boardId } };
  }

  // ============ Emit Methods for Services to Use ============

  // Task Events
  emitTaskCreated(boardId: string, task: any) {
    this.server.to(`board:${boardId}`).emit('taskCreated', task);
  }

  emitTaskUpdated(boardId: string, task: any) {
    this.server.to(`board:${boardId}`).emit('taskUpdated', task);
  }

  emitTaskDeleted(boardId: string, taskId: string) {
    this.server.to(`board:${boardId}`).emit('taskDeleted', { taskId });
  }

  emitTaskMoved(boardId: string, data: { taskId: string; newStatus: string; newPosition: number }) {
    this.server.to(`board:${boardId}`).emit('taskMoved', data);
  }

  // Comment Events
  emitCommentAdded(taskId: string, boardId: string, comment: any) {
    this.server.to(`board:${boardId}`).emit('commentAdded', { taskId, comment });
  }

  emitCommentDeleted(taskId: string, boardId: string, commentId: string) {
    this.server.to(`board:${boardId}`).emit('commentDeleted', { taskId, commentId });
  }

  // Project Events
  emitProjectUpdated(projectId: string, project: any) {
    this.server.to(`project:${projectId}`).emit('projectUpdated', project);
  }

  emitMemberAdded(projectId: string, member: any) {
    this.server.to(`project:${projectId}`).emit('memberAdded', member);
  }

  emitMemberRemoved(projectId: string, memberId: string) {
    this.server.to(`project:${projectId}`).emit('memberRemoved', { memberId });
  }

  // User Notifications
  emitNotification(userId: string, notification: {
    type: 'task_assigned' | 'task_updated' | 'comment_added' | 'mentioned' | 'project_invite';
    title: string;
    message: string;
    data?: any;
  }) {
    this.server.to(`user:${userId}`).emit('notification', {
      ...notification,
      timestamp: new Date().toISOString(),
    });
  }

  // Broadcast to all connected users (for admin announcements)
  broadcastAnnouncement(message: string) {
    this.server.emit('announcement', {
      message,
      timestamp: new Date().toISOString(),
    });
  }

  // Get online users count
  getOnlineUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }
}
