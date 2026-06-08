import { Server, Socket } from "socket.io";
import { getAIResponse } from "./aiHandler";

interface ConnectedUser {
  userId: string;
  userName: string;
  socketId: string;
}

const connectedUsers: Map<string, ConnectedUser> = new Map();

export function setupSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    const { userId, userName } = socket.handshake.auth as {
      userId: string;
      userName: string;
    };

    console.log(`✅ User connected: ${userName} (${socket.id})`);
    connectedUsers.set(socket.id, { userId, userName, socketId: socket.id });

    // Join a room
    socket.on("join_room", (roomId: string) => {
      socket.join(roomId);
      console.log(`${userName} joined room: ${roomId}`);
      socket.to(roomId).emit("user_joined", { userId, userName });
    });

    // Leave a room
    socket.on("leave_room", (roomId: string) => {
      socket.leave(roomId);
      socket.to(roomId).emit("user_left", { userId, userName });
    });

    // Handle new message
    socket.on(
      "send_message",
      async (data: {
        roomId: string;
        content: string;
        userId: string;
        userName: string;
        messageId: string;
      }) => {
        // Broadcast to room
        io.to(data.roomId).emit("receive_message", {
          id: data.messageId,
          content: data.content,
          userId: data.userId,
          user: { name: data.userName },
          roomId: data.roomId,
          isAI: false,
          createdAt: new Date().toISOString(),
        });

        // Check if message mentions @ai
        if (data.content.toLowerCase().includes("@cipher")) {
            const query = data.content.replace(/@cipher/gi, "").trim();

          // Emit typing indicator
          io.to(data.roomId).emit("ai_typing", true);

          try {
            const aiResponse = await getAIResponse(query);

            io.to(data.roomId).emit("ai_typing", false);
            io.to(data.roomId).emit("receive_message", {
              id: `ai-${Date.now()}`,
              content: aiResponse,
              userId: "ai-assistant",
              user: { name: "AI Assistant" },
              roomId: data.roomId,
              isAI: true,
              createdAt: new Date().toISOString(),
            });
          } catch {
            io.to(data.roomId).emit("ai_typing", false);
          }
        }
      }
    );

    // Typing indicator
    socket.on(
      "typing",
      (data: { roomId: string; userName: string; isTyping: boolean }) => {
        socket.to(data.roomId).emit("user_typing", data);
      }
    );

    socket.on("disconnect", () => {
      connectedUsers.delete(socket.id);
      console.log(`❌ User disconnected: ${userName}`);
    });
  });
}