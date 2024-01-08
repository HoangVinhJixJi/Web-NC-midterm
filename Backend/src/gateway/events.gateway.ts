import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({ cors: true })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(private readonly authService: AuthService) {}
  handleEmitSocket({ data, event, to }) {
    if (to) {
      // this.server.to(to.map((el) => String(el))).emit(event, data);
      this.server.to(to).emit(event, data);
      console.log('send noti data to: ', data);
    } else {
      this.server.emit(event, data);
      console.log('send noti data emit all : ', data);
    }
  }

  // @SubscribeMessage('message')
  // async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data) {
  //   console.log('message', data, socket.id);
  // }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  afterInit(socket: Socket): any {}

  async handleConnection(socket: Socket) {
    console.log('connect', socket.id);
    // Lấy userId từ token và đặt vào biến user
    const user = await this.authService.getUserFromSocket(socket);
    console.log('user socket: ', user);
    if (user) {
      // Lưu userId vào socket để có thể sử dụng ở các phần khác
      socket.data.userId = user.userId;
      socket.join(socket.data.userId);
      console.log('connect success', socket.data.userId);
      setTimeout(() => {
        this.handleEmitSocket({
          data: { message: `Thông báo test thử từ : ${socket.data.userId}` },
          event: 'message',
          to: '6575edb257bc05fc01237645',
        });
      }, 3000);
    } else {
      socket.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnect', socket.id, socket.data);
  }
}
