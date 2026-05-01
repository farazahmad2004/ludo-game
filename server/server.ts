import { config } from "dotenv";
config({
  path: "./config.env",
});
import { Game } from './models/Game.ts';
import { User } from './models/User.ts';
import { Socket, Server } from "socket.io";
import http from "http";
import { app } from "./app.ts";
import mongoose from "mongoose";
import { type GameState, initializeGame, handleRoll, executeMove, autoPlayTurn } from "./utils/gameLogic.ts";
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
const turnTimers = new Map<string, NodeJS.Timeout>();
const userSockets = new Map<string, { userId: string, gameId: string }>();

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

const activeGames = new Map<string, GameState>();
io.on("connection", (socket) => {
  console.log("USER CONNECTED:", socket.id);
  const startTurnTimer = (gameId: string) => {
        const gameState = activeGames.get(gameId);
        if (!gameState || gameState.status === 'finished') return;
        const currentPlayer = gameState.players[gameState.turnIndex];
        const delay = currentPlayer.isAI ? 1500 : 20000;
        gameState.turnExpiresAt = Date.now() + delay;
        io.to(gameId).emit("game:update", gameState);

        if (turnTimers.has(gameId)) clearTimeout(turnTimers.get(gameId));

        const timer = setTimeout(async () => {
            const state = activeGames.get(gameId);
            if (!state) return;
            autoPlayTurn(state);
            if (state.status === 'finished') {
                try {
                  // coins ki calc.
                  const numPlayers = state.players.length;
                  const coinAwards = (rank: number) => {
                    if (numPlayers === 4) return rank === 1 ? 100 : rank === 2 ? 50 : rank === 3 ? 25 : 0;
                    if (numPlayers === 3) return rank === 1 ? 50 : rank === 2 ? 25 : 0;
                    return rank === 1 ? 25 : 0; // 2 players
                  };
                  const dbPlayers = state.players.map(p => ({
                    user_id: p.userId,
                    username: p.username,
                    color: p.color,
                    rank: p.rank,
                    coins_earned: coinAwards(p.rank as number)
                  }));
                  const newGame = new Game({
                    total_players: numPlayers,
                    players: dbPlayers,
                    status: 'finished',
                    started_at: new Date(),
                    finished_at: new Date()
                  });
                  await newGame.save();

                  // update user balances & stats.
                  for (const p of dbPlayers) {
                    await User.findByIdAndUpdate(p.user_id, {
                      $inc: { coins: p.coins_earned, total_played: 1 }
                    });
                  }
                } catch (error) {
                  console.error("Failed to save game to DB from timer:", error);
                }

                io.to(gameId).emit("game:over", state);
                activeGames.delete(gameId);
                turnTimers.delete(gameId);
            } else {
                activeGames.set(gameId, state);
                startTurnTimer(gameId); 
            }
        }, delay);

        turnTimers.set(gameId, timer);
    };
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
      const gameState = initializeGame(gameId, waitingLobby);
      activeGames.set(gameId, gameState);
      io.emit("game:start", { gameId, players: waitingLobby });
      
      waitingLobby = [];
    }
  });

  socket.on("game:join_room", ({ gameId, userId }) => {
      socket.join(gameId);
      userSockets.set(socket.id, { userId, gameId });
      const gameState = activeGames.get(gameId);      
      if (gameState) {
          const player = gameState.players.find(p => p.userId === userId);
          
          if (player && player.isAI) {
              player.isAI = false;
              gameState.logs.unshift(`${player.username} reconnected!`);
              if (gameState.players[gameState.turnIndex].userId === userId) {
                  startTurnTimer(gameId);
              } else {
                  io.to(gameId).emit("game:update", gameState);
              }
          } else if (gameState.status === 'playing' && !turnTimers.has(gameId)) {
              startTurnTimer(gameId);
          } else {
              socket.emit("game:update", gameState);
          }
      }
  });
  socket.on("game:roll", ({ gameId, userId }) => {
    const gameState = activeGames.get(gameId);
    if (!gameState) return;
    const updatedState = handleRoll(gameState, userId);    
    if (updatedState) {
      activeGames.set(gameId, updatedState);
      io.to(gameId).emit("game:update", updatedState);
      startTurnTimer(gameId);
    }
  });
  socket.on("game:move", async ({ gameId, userId, tokenId }) => {
    const gameState = activeGames.get(gameId);
    if (!gameState) return;
    const updatedState = executeMove(gameState, userId, tokenId);    
    if (updatedState) {
      activeGames.set(gameId, updatedState);
      io.to(gameId).emit("game:update", updatedState);
      startTurnTimer(gameId);
      if (updatedState.status === 'finished') {
        try {
          // coins ki calc.
          const numPlayers = updatedState.players.length;
          const coinAwards = (rank: number) => {
            if (numPlayers === 4) return rank === 1 ? 100 : rank === 2 ? 50 : rank === 3 ? 25 : 0;
            if (numPlayers === 3) return rank === 1 ? 50 : rank === 2 ? 25 : 0;
            return rank === 1 ? 25 : 0; // 2 players
          };
          const dbPlayers = updatedState.players.map(p => ({
            user_id: p.userId,
            username: p.username,
            color: p.color,
            rank: p.rank,
            coins_earned: coinAwards(p.rank as number)
          }));
          const newGame = new Game({
            total_players: numPlayers,
            players: dbPlayers,
            status: 'finished',
            started_at: new Date(),
            finished_at: new Date()
          });
          await newGame.save();

          // update user balances & stats.
          for (const p of dbPlayers) {
            await User.findByIdAndUpdate(p.user_id, {
              $inc: { coins: p.coins_earned, total_played: 1 }
            });
          }

          io.to(gameId).emit("game:over", updatedState);
          activeGames.delete(gameId);
          turnTimers.delete(gameId);
          
        } catch (error) {
          console.error("Failed to save game to DB:", error);
        }
      }
    }
  });
  socket.on("game:chat", ({ gameId, sender, text, color }) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    io.to(gameId).emit("game:chat", { sender, text, time, color });
  });
  socket.on("disconnect", () => {
      const session = userSockets.get(socket.id);
      if (session) {
          const { userId, gameId } = session;
          const gameState = activeGames.get(gameId);
          if (gameState && gameState.status !== 'finished') {
              const player = gameState.players.find(p => p.userId === userId);
              if (player) {
                  player.isAI = true;
                  gameState.logs.unshift(`${player.username} disconnected. AI taking over.`);
                  if (gameState.players[gameState.turnIndex].userId === userId) {
                      startTurnTimer(gameId);
                  } else {
                      io.to(gameId).emit("game:update", gameState);
                  }
              }
          }
          userSockets.delete(socket.id);
      }
    });
});
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});