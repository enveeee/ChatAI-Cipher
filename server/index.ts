import * as dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { setupSocket } from "./socket";

dotenv.config({ path: ".env" });

const PORT = 3002;

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

setupSocket(io);

httpServer.listen(PORT, () => {
  console.log(`🚀 Cipher Socket server running on port ${PORT}`);
});