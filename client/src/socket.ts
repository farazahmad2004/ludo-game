import { io } from 'socket.io-client';
// server 8000 port per hai, so we connect like this.
export const socket = io("http://localhost:8000", {
  autoConnect: false,
  withCredentials: true
});