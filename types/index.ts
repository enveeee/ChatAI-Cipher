export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Room {
  id: string;
  name: string;
  createdAt: string;
  members?: RoomMember[];
}

export interface RoomMember {
  id: string;
  userId: string;
  roomId: string;
  user?: User;
}

export interface Message {
  id: string;
  content: string;
  isAI: boolean;
  createdAt: string;
  userId?: string;
  roomId: string;
  user?: User;
}

export interface SocketMessage {
  roomId: string;
  content: string;
  userId: string;
  userName: string;
}