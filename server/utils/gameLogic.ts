export type Color = 'red' | 'blue' | 'green' | 'yellow';
export type TokenState = 'home' | 'board' | 'finished';
// makin a token interface to represent each token of a player.
export interface Token {
    id: string; // string iss liye as we have R1, B3 jese tokens.
    color: Color;
    state: TokenState;
    position: number;
};

export interface PlayerState {
  userId: string;
  username: string;
  color: Color;
  tokens: Token[];
  isAI: boolean;
  hasFinished: boolean;
  rank: number | null;
}
export interface GameState {
  gameId: string;
  status: 'waiting' | 'playing' | 'finished';
  players: PlayerState[];
  turnIndex: number;
  currentRoll: number | null;
  canRoll: boolean;
  rollHistory: number[];
  logs: string[];
}
export const START_POSITIONS: Record<Color, number> = {
  red: 0,
  blue: 13,
  yellow: 26,
  green: 39
};
export const SAFE_SQUARES = [0, 8, 13, 21, 26, 34, 39, 47];
export const TURN_IN_POSITIONS: Record<Color, number> = {
  red: 50,
  blue: 11,
  yellow: 24,
  green: 37
};
// starts the game: initializes the game state based on the players in the lobby and returns the initial game state object.
export function initializeGame(gameId: string, lobbyPlayers: any[]): GameState {
  const players: PlayerState[] = lobbyPlayers.map(p => ({
    userId: p.userId,
    username: p.username,
    color: p.color as Color,
    isAI: false,
    hasFinished: false,
    rank: null,
    tokens: [
      { id: `${p.color.charAt(0).toUpperCase()}1`, color: p.color as Color, state: 'home', position: -1 },
      { id: `${p.color.charAt(0).toUpperCase()}2`, color: p.color as Color, state: 'home', position: -1 },
      { id: `${p.color.charAt(0).toUpperCase()}3`, color: p.color as Color, state: 'home', position: -1 },
      { id: `${p.color.charAt(0).toUpperCase()}4`, color: p.color as Color, state: 'home', position: -1 },
    ]
  }));

  return {
    gameId,
    status: 'playing',
    players,
    turnIndex: 0, // pehley Red by convention.
    currentRoll: null,
    canRoll: true,
    rollHistory: [],
    logs: [`Game ${gameId} started!`]
  };
}
export function hasValidMoves(player: PlayerState, roll: number): boolean {
  return player.tokens.some(t => calculateTargetPosition(t, roll) !== null);
}
export function advanceTurn(gameState: GameState) {
  let nextIndex = (gameState.turnIndex + 1) % gameState.players.length;
  while (gameState.players[nextIndex].hasFinished && nextIndex !== gameState.turnIndex) {
    nextIndex = (nextIndex + 1) % gameState.players.length;
  }
  
  gameState.turnIndex = nextIndex;
  gameState.currentRoll = null;
  gameState.canRoll = true;
}
export function handleRoll(gameState: GameState, userId: string): GameState | null {
  const currentPlayer = gameState.players[gameState.turnIndex];
  if (currentPlayer.userId !== userId || !gameState.canRoll) {
    return null;
  }
  const roll = Math.floor(Math.random() * 6) + 1;
  gameState.currentRoll = roll;
  
  gameState.rollHistory.unshift(roll);
  if (gameState.rollHistory.length > 5) {
    gameState.rollHistory.pop();
  }

  gameState.logs.unshift(`${currentPlayer.username} rolled a ${roll}`);
  gameState.canRoll = false;

  if (!hasValidMoves(currentPlayer, roll)) {
    gameState.logs.unshift(`${currentPlayer.username} has no valid moves.`);
    advanceTurn(gameState);
  }
  return gameState;
}
// actual logic of the game is here
const HOME_STRETCH_PREFIX: Record<Color, number> = {
  red: 100,
  blue: 200,
  yellow: 300,
  green: 400
};

export function getDistance(pos: number, color: Color): number {
  if (pos < 0) return 0;
  if (pos >= 100) return 50 + (pos % 100);
  return (pos - START_POSITIONS[color] + 52) % 52;
}

export function calculateTargetPosition(token: Token, roll: number): number | null {
  if (token.state === 'finished') return null;
  if (token.state === 'home') {
    return roll === 6 ? START_POSITIONS[token.color] : null;
  }
  if (token.position >= 100) {
    const currentOffset = token.position % 100;
    const newOffset = currentOffset + roll;
    if (newOffset === 6) return HOME_STRETCH_PREFIX[token.color] + 6;
    if (newOffset < 6) return HOME_STRETCH_PREFIX[token.color] + newOffset;
    return null;
  }

  const distance = getDistance(token.position, token.color);
  const newDistance = distance + roll;

  if (newDistance > 50) {
    const offset = newDistance - 50;
    if (offset === 6) return HOME_STRETCH_PREFIX[token.color] + 6;
    if (offset < 6) return HOME_STRETCH_PREFIX[token.color] + offset;
    return null;
  }

  return (token.position + roll) % 52;
}

export function executeMove(gameState: GameState, userId: string, tokenId: string): GameState | null {
  const playerIndex = gameState.turnIndex;
  const player = gameState.players[playerIndex];

  if (player.userId !== userId || gameState.canRoll || gameState.currentRoll === null) {
    return null;
  }

  const token = player.tokens.find(t => t.id === tokenId);
  if (!token) return null;

  const targetPos = calculateTargetPosition(token, gameState.currentRoll);
  if (targetPos === null) return null;

  let capturedCount = 0;

  if (targetPos >= 100 && targetPos % 100 === 6) {
    token.state = 'finished';
    token.position = targetPos;
    gameState.logs.unshift(`${player.username}'s token reached the finish!`);
    
    // Check if player has won
    if (player.tokens.every(t => t.state === 'finished')) {
      player.hasFinished = true;
      const currentRank = gameState.players.filter(p => p.hasFinished).length;
      player.rank = currentRank;
      gameState.logs.unshift(`${player.username} finished in ${currentRank}${currentRank === 1 ? 'st' : currentRank === 2 ? 'nd' : currentRank === 3 ? 'rd' : 'th'} place!`);
    }
  } 
  else {
    token.state = 'board';
    token.position = targetPos;

    if (!SAFE_SQUARES.includes(targetPos) && targetPos < 100) {
      for (const otherPlayer of gameState.players) {
        if (otherPlayer.color !== player.color) {
          for (const otherToken of otherPlayer.tokens) {
            if (otherToken.position === targetPos) {
              otherToken.state = 'home';
              otherToken.position = -1;
              capturedCount++;
            }
          }
        }
      }
    }
  }

  if (capturedCount > 0) {
    gameState.logs.unshift(`${player.username} captured ${capturedCount} token(s)!`);
  }

  // Check if game is completely over (only 1 player hasn't finished)
  const activePlayers = gameState.players.filter(p => !p.hasFinished);
  if (activePlayers.length <= 1) {
    if (activePlayers.length === 1) {
      const lastPlayer = activePlayers[0];
      lastPlayer.hasFinished = true;
      lastPlayer.rank = gameState.players.length;
    }
    gameState.status = 'finished';
    return gameState;
  }

  const hasExtraTurn = gameState.currentRoll === 6;
  
  if (!hasExtraTurn || player.hasFinished) {
    advanceTurn(gameState);
  } else {
    gameState.currentRoll = null;
    gameState.canRoll = true;
  }
  return gameState;
}
export function autoPlayTurn(gameState: any) {
    const player = gameState.players[gameState.turnIndex];
    if (gameState.canRoll) {
        handleRoll(gameState, player.userId);
    }
    else if (gameState.currentRoll !== null) {
        const movableTokens = player.tokens.filter((t: any) => 
            t.state !== 'finished' && !(t.state === 'home' && gameState.currentRoll !== 6)
        );

        if (movableTokens.length > 0) {
            const randomToken = movableTokens[Math.floor(Math.random() * movableTokens.length)];
            executeMove(gameState, player.userId, randomToken.id);
        } else {
            advanceTurn(gameState);
        }
    }
    return gameState;
}