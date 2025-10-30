import { Controller, Get, Post, Param, Query, Body, BadRequestException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  /**
   * GET /notifications?userId=abc&limit=20&unreadOnly=true
   * List notifications for a user
   */
  @Get()
  async list(
    @Query('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    if (!userId) {
      throw new BadRequestException('userId query param is required');
    }

    const parsedLimit = limit ? parseInt(limit, 10) : 20;
    const parsedUnreadOnly = unreadOnly === 'true';

    return this.notificationsService.list(userId, parsedLimit, parsedUnreadOnly);
  }

  /**
   * GET /notifications/unread-count?userId=abc
   * Get unread notification count
   */
  @Get('unread-count')
  async unreadCount(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('userId query param is required');
    }

    const count = await this.notificationsService.getUnreadCount(userId);
    return { count };
  }

  /**
   * POST /notifications/:id/read
   * Mark a notification as read
   */
  @Post(':id/read')
  async markRead(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('userId is required in request body');
    }

    await this.notificationsService.markRead(userId, id);
    return { success: true };
  }

  /**
   * POST /notifications/mark-all-read
   * Mark all notifications as read for a user
   */
  @Post('mark-all-read')
  async markAllRead(@Body('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('userId is required in request body');
    }

    await this.notificationsService.markAllRead(userId);
    return { success: true };
  }

  /**
   * POST /notifications/:id/delete
   * Delete a notification
   */
  @Post(':id/delete')
  async delete(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('userId is required in request body');
    }

    await this.notificationsService.delete(userId, id);
    return { success: true };
  }
}
