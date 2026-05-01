import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { socket } from '../socket';
import './game.css';

interface Token {
  id: string;
  color: string;
  state: string;
  position: number;
}

interface PlayerState {
  userId: string;
  username: string;
  color: string;
  tokens: Token[];
  isAI: boolean;
  hasFinished: boolean;
  rank: number | null;
}

interface GameState {
  gameId: string;
  status: string;
  players: PlayerState[];
  turnIndex: number;
  currentRoll: number | null;
  canRoll: boolean;
  rollHistory: number[];
  logs: string[];
}

export default function Game() {
  const { game_id } = useParams<{ game_id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    if (!game_id) return;

    socket.connect();
    socket.emit("game:join_room", game_id);

    socket.on("game:update", (state: GameState) => {
      setGameState(state);
    });

    return () => {
      socket.off("game:update");
    };
  }, [game_id]);

  if (!gameState) {
    return <div className="page" style={{ color: 'white', padding: '20px' }}>Loading game state...</div>;
  }

  const currentPlayer = gameState.players[gameState.turnIndex];
  const isMyTurn = currentPlayer.userId === user?._id;
  const myPlayer = gameState.players.find(p => p.userId === user?._id);
  const handleRollDice = () => {
    if (isMyTurn && gameState.canRoll) {
      socket.emit("game:roll", { gameId: game_id, userId: user?._id });
    }
  };
  const handleTokenClick = (tokenId: string) => {
    if (isMyTurn && !gameState.canRoll && gameState.currentRoll !== null) {
      socket.emit("game:move", { gameId: game_id, userId: user?._id, tokenId });
    }
  };

  const renderSquare = (posId: number) => {
    const tokensOnSquare = gameState.players
      .flatMap(p => p.tokens)
      .filter(t => t.position === posId && t.state !== 'home' && t.state !== 'finished');

    return tokensOnSquare.map((token, i) => {
      const isClickable = isMyTurn && !gameState.canRoll && gameState.currentRoll !== null && token.color === myPlayer?.color;
      const colorClass = token.color === 'yellow' ? 'yel' : token.color;
      
      return (
        <div 
          key={token.id}
          className={`token token--${colorClass}`}
          onClick={() => isClickable ? handleTokenClick(token.id) : undefined}
          style={{ 
            cursor: isClickable ? 'pointer' : 'default',
            position: tokensOnSquare.length > 1 ? 'absolute' : 'relative',
            transform: tokensOnSquare.length > 1 ? `translate(${i * 4}px, ${i * -4}px)` : 'none',
            zIndex: 10 + i
          }}
        >
          {token.id}
        </div>
      );
    });
  };

  const renderYard = (color: string) => {
    const homeTokens = gameState.players
      .find(p => p.color === color)?.tokens
      .filter(t => t.state === 'home') || [];

    return [0, 1, 2, 3].map(index => {
      const token = homeTokens[index];
      if (token) {
        const isClickable = isMyTurn && !gameState.canRoll && gameState.currentRoll !== null && token.color === myPlayer?.color;
        const colorClass = token.color === 'yellow' ? 'yel' : token.color;
        return (
          <div key={`slot-${index}`} className="token-slot">
            <div 
              className={`token token--${colorClass}`} 
              onClick={() => isClickable ? handleTokenClick(token.id) : undefined}
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
            >
              {token.id}
            </div>
          </div>
        );
      }
      return <div key={`slot-${index}`} className="token-slot" />;
    });
  };

  const renderFinished = (color: string) => {
    const finishedTokens = gameState.players
      .find(p => p.color === color)?.tokens
      .filter(t => t.state === 'finished') || [];
      
    return finishedTokens.map(token => {
      const colorClass = token.color === 'yellow' ? 'yel' : token.color;
      return <div key={token.id} className={`token token--${colorClass}`} style={{ transform: 'scale(0.7)' }}>{token.id}</div>;
    });
  };
  const handleLeaveGame = () => {
    navigate("/home");
  };

  return (
    <div>
      <div className="page">
        <div className="topbar">
          <div className="topbar-info">
            <div><span>Room: </span><strong>#{game_id}</strong></div>
            <div><span>Mode: </span><strong>Classic ({gameState.players.length} players)</strong></div>
          </div>
          <div className="timer">20:00</div>
          <div className="flex-row gap-8px">
            <button className="btn btn-muted">▶ Spectate</button>
            <button className="btn btn-danger" onClick={handleLeaveGame}>✕ Leave Game</button>
          </div>
        </div>
        <div className="layout">
          <aside>
            <div className="panel">
              <div className="panel-hd">Your Turn - Roll Dice</div>
              <div className="panel-bd">
                <div className="die-number">{gameState.currentRoll || "?"}</div>
                <button
                  className="roll-btn"
                  onClick={handleRollDice}
                  disabled={!isMyTurn || !gameState.canRoll}
                  style={{ opacity: (!isMyTurn || !gameState.canRoll) ? 0.5 : 1, cursor: (!isMyTurn || !gameState.canRoll) ? 'not-allowed' : 'pointer' }}
                >
                  Roll!
                </button>
                <div className="roll-hist">
                  Recent:
                  {gameState.rollHistory.map((r, idx) => (
                    <span key={idx} className="rp">{r}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-hd">Players</div>
              <div className="panel-bd">
                {gameState.players.map((p, idx) => {
                  const onBoard = p.tokens.filter(t => t.state === 'board').length;
                  const home = p.tokens.filter(t => t.state === 'home').length;
                  const fin = p.tokens.filter(t => t.state === 'finished').length;
                  const isActive = idx === gameState.turnIndex;
                  const isMe = p.userId === user?._id;

                  return (
                    <div key={p.userId} className={`player-card ${isActive ? 'active' : ''}`}>
                      {isActive && <span className="active-badge">Turn</span>}
                      <div className="p-name">
                        <div className={`p-dot dot-${p.color}`} />
                        {p.username} ({p.color}) {isMe ? "(You)" : ""}
                      </div>
                      <div className="p-stats">On board: {onBoard} &nbsp;|&nbsp; Home: {home} &nbsp;|&nbsp; Fin: {fin}</div>
                      <div className="prog-wrap">
                        <div className={`prog-fill bg-${p.color}`} style={{ width: `${(fin / 4) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ══ BOARD AREA ══ */}
          <div className="board-area">
            <div className="ludo-board">
              <div className="board-row board-row--top">
                <div className="home home--red">
                  <div className="yard">
                    {renderYard('red')}
                  </div>
                </div>
                <div className="track-col track-col--top">
                  <div className="sq">{renderSquare(10)}</div>
                  <div className="sq">{renderSquare(11)}</div>
                  <div className="sq">{renderSquare(12)}</div>
                  
                  <div className="sq">{renderSquare(9)}</div>
                  <div className="sq sq--home-blue">{renderSquare(201)}</div>
                  <div className="sq sq--safe sq--start-blue">{renderSquare(13)}</div>
                  
                  <div className="sq sq--safe">{renderSquare(8)}</div>
                  <div className="sq sq--home-blue">{renderSquare(202)}</div>
                  <div className="sq">{renderSquare(14)}</div>
                  
                  <div className="sq">{renderSquare(7)}</div>
                  <div className="sq sq--home-blue">{renderSquare(203)}</div>
                  <div className="sq">{renderSquare(15)}</div>
                  
                  <div className="sq">{renderSquare(6)}</div>
                  <div className="sq sq--home-blue">{renderSquare(204)}</div>
                  <div className="sq">{renderSquare(16)}</div>
                  
                  <div className="sq">{renderSquare(5)}</div>
                  <div className="sq sq--home-blue">{renderSquare(205)}</div>
                  <div className="sq">{renderSquare(17)}</div>
                </div>
                <div className="home home--blue">
                  <div className="yard">
                    {renderYard('blue')}
                  </div>
                </div>
              </div>
              <div className="board-row board-row--mid">
                <div className="track-col track-col--left">
                  <div className="sq sq--safe">{renderSquare(51)}</div>
                  <div className="sq sq--start-red">{renderSquare(0)}</div>
                  <div className="sq">{renderSquare(1)}</div>
                  <div className="sq">{renderSquare(2)}</div>
                  <div className="sq">{renderSquare(3)}</div>
                  <div className="sq">{renderSquare(4)}</div>
                  
                  <div className="sq">{renderSquare(50)}</div>
                  <div className="sq sq--home-red">{renderSquare(101)}</div>
                  <div className="sq sq--home-red">{renderSquare(102)}</div>
                  <div className="sq sq--home-red">{renderSquare(103)}</div>
                  <div className="sq sq--home-red">{renderSquare(104)}</div>
                  <div className="sq sq--home-red">{renderSquare(105)}</div>
                  
                  <div className="sq">{renderSquare(49)}</div>
                  <div className="sq">{renderSquare(48)}</div>
                  <div className="sq sq--safe">{renderSquare(47)}</div>
                  <div className="sq">{renderSquare(46)}</div>
                  <div className="sq">{renderSquare(45)}</div>
                  <div className="sq">{renderSquare(44)}</div>
                </div>
                <div className="centre">
                  <div className="tri tri--top" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '5px' }}>{renderFinished('blue')}</div>
                  <div className="tri tri--right" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: '5px' }}>{renderFinished('yellow')}</div>
                  <div className="tri tri--bot" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '5px' }}>{renderFinished('green')}</div>
                  <div className="tri tri--left" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '5px' }}>{renderFinished('red')}</div>
                  <span className="centre-star">★</span>
                </div>
                <div className="track-col track-col--right">
                  <div className="sq">{renderSquare(18)}</div>
                  <div className="sq">{renderSquare(19)}</div>
                  <div className="sq">{renderSquare(20)}</div>
                  <div className="sq sq--safe">{renderSquare(21)}</div>
                  <div className="sq">{renderSquare(22)}</div>
                  <div className="sq">{renderSquare(23)}</div>
                  
                  <div className="sq sq--home-yellow">{renderSquare(305)}</div>
                  <div className="sq sq--home-yellow">{renderSquare(304)}</div>
                  <div className="sq sq--home-yellow">{renderSquare(303)}</div>
                  <div className="sq sq--home-yellow">{renderSquare(302)}</div>
                  <div className="sq sq--home-yellow">{renderSquare(301)}</div>
                  <div className="sq">{renderSquare(24)}</div>
                  
                  <div className="sq">{renderSquare(30)}</div>
                  <div className="sq">{renderSquare(29)}</div>
                  <div className="sq">{renderSquare(28)}</div>
                  <div className="sq">{renderSquare(27)}</div>
                  <div className="sq sq--start-yellow">{renderSquare(26)}</div>
                  <div className="sq">{renderSquare(25)}</div>
                </div>
              </div>
              <div className="board-row board-row--bot">
                <div className="home home--green">
                  <div className="yard">
                    {renderYard('green')}
                  </div>
                </div>
                <div className="track-col track-col--bot">
                  <div className="sq">{renderSquare(43)}</div>
                  <div className="sq sq--home-green">{renderSquare(405)}</div>
                  <div className="sq">{renderSquare(31)}</div>
                  
                  <div className="sq">{renderSquare(42)}</div>
                  <div className="sq sq--home-green">{renderSquare(404)}</div>
                  <div className="sq">{renderSquare(32)}</div>
                  
                  <div className="sq">{renderSquare(41)}</div>
                  <div className="sq sq--home-green">{renderSquare(403)}</div>
                  <div className="sq">{renderSquare(33)}</div>
                  
                  <div className="sq">{renderSquare(40)}</div>
                  <div className="sq sq--home-green">{renderSquare(402)}</div>
                  <div className="sq sq--safe">{renderSquare(34)}</div>
                  
                  <div className="sq sq--start-green">{renderSquare(39)}</div>
                  <div className="sq sq--home-green">{renderSquare(401)}</div>
                  <div className="sq">{renderSquare(35)}</div>
                  
                  <div className="sq">{renderSquare(38)}</div>
                  <div className="sq">{renderSquare(37)}</div>
                  <div className="sq">{renderSquare(36)}</div>
                </div>
                <div className="home home--yellow">
                  <div className="yard">
                    {renderYard('yellow')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside>
            <div className="panel">
              <div className="panel-hd">Live Chat</div>
              <div className="chat-window">
                <div className="chat-messages">
                  <div className="chat-msg sys"><div className="msg-bubble">Game started – Good luck everyone!</div></div>
                </div>
                <div className="chat-input-row">
                  <input type="text" placeholder="Type a message…" />
                  <button>Send</button>
                </div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-hd">Game Log</div>
              <div className="game-log">
                {gameState.logs.map((log, idx) => (
                  <div key={idx} className="log-entry">
                    <span className="log-text">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}