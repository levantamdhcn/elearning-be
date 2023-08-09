// Nest dependencies
import { Logger } from '@nestjs/common';

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

// Other dependencies
import { Server, Socket } from 'socket.io';

// Local files
import { MessageService } from '../Service/message.service';
import { JwtManipulationService } from 'src/shared/service/jwt-manipulation.service';

@WebSocketGateway(1234)
export class MessageGateway {
  @WebSocketServer() wss: Server;
  private logger = new Logger('MessageGateway');

  constructor(
    private readonly messageService: MessageService,
    private jwtManipulationService: JwtManipulationService,
  ) {}

  async handleConnection(socket: Socket) {
    const { Authorization } = socket.handshake.query;
    let clientUsername;

    try {
      clientUsername = this.jwtManipulationService.decodeJwtToken(
        Authorization,
        'username',
      );
    } catch (error) {
      this.logger.error('Client disconnected');
    }

    if (!clientUsername) return;

    socket.join(clientUsername);
    socket.on(
      'sendMessage',
      async (messageForm: { recipient: string; body: string }) => {
        messageForm.body = messageForm.body.replace(/^\s+|\s+$/g, '');
        if (messageForm.body.length === 0) return;

        try {
          const { _id } = await this.messageService.sendMessage({
            ...messageForm,
            from: clientUsername,
          });
          socket.to(messageForm.recipient).emit('pingMessage', {
            conversation_id: _id,
            from: clientUsername,
            body: messageForm.body,
          });
        } catch (error) {
          this.logger.error('Message could not send');
        }
      },
    );
  }
}
