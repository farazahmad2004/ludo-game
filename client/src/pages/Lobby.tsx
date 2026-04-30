import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { socket } from '../socket.ts';
import './lobby.css';
interface LobbyPlayer {
  socketId: string;
  userId: string;
  username: string;
  color: string;
  isHost: boolean;
}
export default function Lobby() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<LobbyPlayer[]>([]);
  useEffect(() => {
    socket.connect();
    if (user) {
      socket.emit("room:join", user);
    }
    socket.on("lobby:update", (updatedPlayers: LobbyPlayer[]) => {
      setPlayers(updatedPlayers);
    });
    socket.on("game:start", (data: { gameId: string, players: LobbyPlayer[] }) => {
      navigate(`/newgame/${data.gameId}`);
    });
    return () => {
      socket.off("lobby:update");
      socket.off("game:start");
      socket.disconnect();
    }
  }, [user, navigate]);
  const isHost = (players.length > 0) && (players[0].userId === user?._id);
  const canStart = players.length >= 2 && isHost;
  const handleStartGame = () => {
    if (canStart) {
      socket.emit("game:start");
    }
  };
  const handleGoBack = () => {
    navigate("/home");
  }
  return (
    <div className="page">
      <div className="lobby-container">
        <div className="lobby-header">
          <h1 className="lobby-title">🎲 LUDO</h1>
          <p className="lobby-subtitle">Classic Board Game Experience</p>
        </div>
        <div className="lobby-card">
          <h2>Game Lobby</h2>
          <div className="players-grid">
            {[0, 1, 2, 3].map((index) => {
              const player = players[index];
              if (player) {
                return (
                  <div key={index} className="player-slot filled">
                    <div className="player-slot-label">Player {index + 1}</div>
                    <div className="player-slot-name">{player.username} {player.userId === user?._id ? "(You)" : ""}</div>
                    <div className={`player-slot-color ${player.color}`} />
                  </div>
                );
              } else {
                return (
                  <div key={index} className="player-slot empty">
                    <div className="player-slot-label">Player {index + 1}</div>
                    <div className="player-slot-name">Waiting...</div>
                    <div className="player-slot-color none" />
                  </div>
                );
              }
            })}
          </div>
          {/* Button is supposed to stay disabled until atleast 1 person joins */}
          {/* <button class="start-button" id="start-btn" disabled>
            Start Game (Need 2+ Players)
          </button> */}
          <button
            className="start-button"
            id="start-btn"
            disabled={!canStart}
            onClick={handleStartGame}
          >
            {isHost ? `Start Game (${players.length}/4 Players)` : "Waiting for Host..."}
          </button>
          <div className="lobby-footer">
            {/* <p id="player-count">1 player ready</p> */}
            <button className="back-button" onClick={handleGoBack}>Go Back</button>
          </div>
        </div>
      </div>
    </div>);
}