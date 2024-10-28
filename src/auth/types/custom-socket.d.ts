import { JwtPayload } from './auth.types'; 
import { Socket } from 'socket.io';

declare module 'socket.io' {
  interface Socket {
    user?: JwtPayload;
  }
}
