import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  // AUTHENTICATED: get chat response for product questions
  // POST /chat/ask
  @Post('ask')
  @UseGuards(JwtAuthGuard)
  async ask(@Body() body: { userId: string; productId: string; question: string }) {
    return this.chatService.getAnswer(body.userId, body.productId, body.question);
  }
  
  // AUTHENTICATED: compare products
  // POST /chat/compare
  @Post('compare')
  @UseGuards(JwtAuthGuard)
  async compare(@Body() body: { userId: string; productIds: string[]; question: string }) {
    return this.chatService.compareProductsByIds(body.userId, body.productIds, body.question);
  }
}