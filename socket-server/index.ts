import * as dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { setupSocket } from "./socket";

dotenv.config();

const PORT = process.env.PORT || 3002;

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

setupSocket(io);

httpServer.listen(PORT, () => {
  console.log(`🚀 Cipher Socket server running on port ${PORT}`);
});