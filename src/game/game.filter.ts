import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch()
export class AllWsExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    let message: unknown = 'Unknown error';

    if (exception instanceof WsException) {
      message = exception.getError();
    } else if (exception instanceof BadRequestException) {
      message = exception.getResponse();
    } else if (exception instanceof HttpException) {
      message = exception.getResponse();
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    client.emit('exception', {
      status: 'error',
      message,
    });
  }
}
