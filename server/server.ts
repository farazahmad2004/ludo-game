import { config } from "dotenv";
config({
  path: "./config.env",
});
import { Socket, Server } from "socket.io";
import http from "http";
import { app } from "./app.ts";
import mongoose from "mongoose";
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI as string;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

mongoose.connect(MONGO_URI).then(() => {
  console.log("MongoDB connected!");
})
.catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});
interface LobbyPlayer {
  socketId: string;
  userId: string;
  username: string;
  color: string;
  isHost: boolean;
}

let waitingLobby: LobbyPlayer[] = [];
const availableColors = ['red', 'blue', 'green', 'yellow'];

io.on("connection", (socket) => {
  console.log("USER CONNECTED:", socket.id);
  socket.on("room:join", (userData) => {
    const existingPlayerIndex = waitingLobby.findIndex(p => p.userId === userData._id);

    if (existingPlayerIndex !== -1) {
      waitingLobby[existingPlayerIndex].socketId = socket.id;
      io.emit("lobby:update", waitingLobby);
      return;
    }

    if (waitingLobby.length >= 4) {
      return;
    }

    const isHost = waitingLobby.length === 0;
    const color = availableColors[waitingLobby.length];

    const newPlayer: LobbyPlayer = {
      socketId: socket.id,
      userId: userData._id,
      username: userData.username,
      color: color,
      isHost: isHost
    };
    
    waitingLobby.push(newPlayer);    
    io.emit("lobby:update", waitingLobby);
  });

  socket.on("game:start", () => {
    if (waitingLobby.length >= 2) {
      const gameId = "game_" + Date.now();
      
      io.emit("game:start", { gameId, players: waitingLobby });
      
      waitingLobby = [];
    }
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED:", socket.id);
    waitingLobby = waitingLobby.filter(p => p.socketId !== socket.id);
    io.emit("lobby:update", waitingLobby);
  });
});
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
