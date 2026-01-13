import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  /**
   * GET /notifications?limit=20&unreadOnly=true
   * List notifications for the current user
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async list(
    @CurrentUser('id') userId: string,
    @Query('limit') limit?: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 20;
    const parsedUnreadOnly = unreadOnly === 'true';

    return this.notificationsService.list(userId, parsedLimit, parsedUnreadOnly);
  }

  /**
   * GET /notifications/unread-count
   * Get unread notification count for the current user
   */
  @UseGuards(JwtAuthGuard)
  @Get('unread-count')
  async unreadCount(@CurrentUser('id') userId: string) {
    const count = await this.notificationsService.getUnreadCount(userId);
    return { count };
  }

  /**
   * POST /notifications/:id/read
   * Mark a notification as read
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/read')
  async markRead(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    await this.notificationsService.markRead(userId, id);
    return { success: true };
  }

  /**
   * POST /notifications/mark-all-read
   * Mark all notifications as read for a user
   */
  @UseGuards(JwtAuthGuard)
  @Post('mark-all-read')
  async markAllRead(@CurrentUser('id') userId: string) {
    await this.notificationsService.markAllRead(userId);
    return { success: true };
  }

  /**
   * POST /notifications/:id/delete
   * Delete a notification
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/delete')
  async delete(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    await this.notificationsService.delete(userId, id);
    return { success: true };
  }
}
