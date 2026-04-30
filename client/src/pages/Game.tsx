import './game.css';
export default function Game() {
  return (
    <div>
      <div className="page">
        {/* TOP BAR */}
        <div className="topbar">
          <div className="topbar-info">
            <div><span>Room: </span><strong>#LUDO-4821</strong></div>
            <div><span>Mode: </span><strong>Classic (4 players)</strong></div>
          </div>
          <div className="timer">00:23</div>
          <div className="flex-row gap-8px">
            <button className="btn btn-muted">▶ Spectate</button>
            <button className="btn btn-danger">✕ Leave Game</button>
          </div>
        </div>
        <div className="layout">
          {/* ══ LEFT SIDEBAR ══ */}
          <aside>
            <div className="panel">
              <div className="panel-hd">Your Turn - Roll Dice</div>
              <div className="panel-bd">
                <div className="die-number">6</div>
                <button className="roll-btn">Roll!</button>
                <div className="roll-hist">Recent: <span className="rp">4</span><span className="rp">6</span><span className="rp">2</span><span className="rp">6</span><span className="rp">1</span></div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-hd">Players</div>
              <div className="panel-bd">
                <div className="player-card active">
                  <span className="active-badge">Your Turn</span>
                  <div className="p-name"><div className="p-dot dot-red" />You (Red)</div>
                  <div className="p-stats">On board: 1 &nbsp;|&nbsp; Home: 2 &nbsp;|&nbsp; Fin: 1</div>
                  {/* <div class="pip-row">
    <div class="pip fin" title="R1 – Finished"></div>
    <div class="pip on"  title="R2 – Start sq."></div>
    <div class="pip home" title="R3 – Home"></div>
    <div class="pip home" title="R4 – Home"></div>
  </div> */}
                  <div className="prog-wrap"><div className="prog-fill w-40pct bg-red" /></div>
                </div>
                <div className="player-card">
                  <div className="p-name"><div className="p-dot dot-blue" />Ali (Blue)</div>
                  <div className="p-stats">On board: 1 &nbsp;|&nbsp; Home: 2 &nbsp;|&nbsp; Fin: 1</div>
                  {/* <div class="pip-row">
    <div class="pip fin"></div><div class="pip on"></div>
    <div class="pip home"></div><div class="pip home"></div>
  </div> */}
                  <div className="prog-wrap"><div className="prog-fill w-40pct bg-blue" /></div>
                </div>
                <div className="player-card">
                  <div className="p-name"><div className="p-dot dot-green" />Sara (Green)</div>
                  <div className="p-stats">On board: 1 &nbsp;|&nbsp; Home: 2 &nbsp;|&nbsp; Fin: 1</div>
                  {/* <div class="pip-row">
    <div class="pip fin"></div><div class="pip on"></div>
    <div class="pip home"></div><div class="pip home"></div>
  </div> */}
                  <div className="prog-wrap"><div className="prog-fill w-40pct bg-green" /></div>
                </div>
                <div className="player-card">
                  <div className="p-name"><div className="p-dot dot-yellow" />Zaid (Yellow)</div>
                  <div className="p-stats">On board: 1 &nbsp;|&nbsp; Home: 2 &nbsp;|&nbsp; Fin: 1</div>
                  {/* <div class="pip-row">
    <div class="pip fin"></div><div class="pip on"></div>
    <div class="pip home"></div><div class="pip home"></div>
  </div> */}
                  <div className="prog-wrap"><div className="prog-fill w-40pct bg-yellow" /></div>
                </div>
              </div>
            </div>
          </aside>
          {/* ══ BOARD AREA ══ */}
          <div className="board-area">
            {/* <div class="status-bar">
    <div class="status-msg">
<div class="turn-swatch turning-swatch-red"></div>
<strong>Red's turn</strong>
<span class="opacity-70 text-sm">– Rolled a 6! Select a token to move.</span>
    </div>
    <span class="text-sm opacity-70">Turn 7</span>
  </div> */}
            <div className="ludo-board">
              {/* ══ ROW 1: Red Home | Top Track | Blue Home ══ */}
              <div className="board-row board-row--top">
                {/* Red Home (6×6) */}
                <div className="home home--red">
                  <div className="yard">
                    {/* Slot 1: R3 token (home) */}
                    <div className="token-slot">
                      <div className="token token--red">R3<span className="token-tip">R3 – Home base</span></div>
                    </div>
                    {/* Slot 2: R4 token (home) */}
                    <div className="token-slot">
                      <div className="token token--red">R4<span className="token-tip">R4 – Home base</span></div>
                    </div>
                    {/* Slot 3: empty */}
                    <div className="token-slot" />
                    {/* Slot 4: empty */}
                    <div className="token-slot" />
                  </div>
                </div>
                {/* Top Track: 3 cols × 6 rows
     Col layout (left→right): col A | col B (blue home col) | col C
     Row layout (top→bottom): row 1..6, row 6 is adjacent to middle band

     Track squares in this section (clockwise from Red's perspective):
       Col C rows 6→1 = track squares 3→8  (Red going up the right side of top track)
       Col B row 1    = track sq 9  (safe)
       Col A rows 1→6 = track sq 10→15 (going down left side of top)
       … but col B (rows 1-5) = Blue home column (coloured, not normal track)
       Row 6, col A   = Blue start square

     Simpler static layout for 3×6:
       Positions [row][col] 1-indexed:
         [1][1] = normal track
         [1][2] = blue home col
         [1][3] = normal track (safe: ★)
         [2][1..3] = normal / blue-home / normal
         ...
         [5][1] = BLUE START (entry sq for blue)
         [5][2] = blue home col
         [5][3] = normal
         [6][1..3] = normal track (connects to left/right arms)
*/}
                <div className="track-col track-col--top">
                  {/* Row 1 */}
                  <div className="sq" />
                  <div className="sq" />
                  <div className="sq" />  {/* safe sq */}
                  {/* Row 2 */}
                  <div className="sq" />
                  <div className="sq sq--home-blue" />
                  <div className="sq sq--safe sq--start-blue">
                    {/* <div class="sq sq--start-blue"></div> */}
                    <div className="token token--blue">B2<span className="token-tip">B2 – Start square</span></div>
                  </div>
                  {/* Row 3 */}
                  <div className="sq sq--safe" />
                  <div className="sq sq--home-blue" />
                  <div className="sq" />
                  {/* Row 4 */}
                  <div className="sq" />
                  <div className="sq sq--home-blue" />
                  <div className="sq" />
                  {/* Row 5 — Blue start square in col A; B1 token is here */}
                  <div className="sq" />
                  <div className="sq sq--home-blue" />
                  <div className="sq" />
                  {/* Row 6 — B1 finished token is in home col row 5 above;
       row 6 col B = last home col cell closest to centre (finished token) */}
                  <div className="sq" />
                  <div className="sq sq--home-blue">
                    <div className="token token--blue">B1<span className="token-tip">B1 – Finished</span></div>
                  </div>
                  <div className="sq" />
                </div>
                {/* Blue Home (6×6) */}
                <div className="home home--blue">
                  <div className="yard">
                    <div className="token-slot">
                      <div className="token token--blue">B3<span className="token-tip">B3 – Home base</span></div>
                    </div>
                    <div className="token-slot">
                      <div className="token token--blue">B4<span className="token-tip">B4 – Home base</span></div>
                    </div>
                    <div className="token-slot" />
                    <div className="token-slot" />
                  </div>
                </div>
              </div>{/* /.board-row--top */}
              {/* ══ ROW 2: Left Track | Centre | Right Track ══ */}
              <div className="board-row board-row--mid">
                {/* Left Track: 6 cols × 3 rows
     Row layout (top→bottom): row A | row B (red home col) | row C
     Col layout (left→right): col 1..6, col 6 is adjacent to centre

     Red start square is in col 1, row C (bottom-left of this section).
     Red home column runs across row B (cols 1-5; col 6 is adj to centre = finished pos).

     [rowA][col1..6] = normal track
     [rowB][col1..5] = red home col; [rowB][col6] = adj centre (red finished token here)
     [rowC][col1]    = RED START sq
     [rowC][col2..6] = normal track
*/}
                <div className="track-col track-col--left">
                  {/* Row A (top) */}
                  <div className="sq" />  {/* safe sq */}
                  <div className="sq sq--start-red">
                    <div className="token token--red">R2<span className="token-tip">R2 – Start square</span></div>
                  </div>
                  <div className="sq" />
                  <div className="sq" />
                  <div className="sq" />
                  <div className="sq" />
                  {/* Row B (middle) = Red home column */}
                  <div className="sq" />
                  <div className="sq sq--home-red" />
                  <div className="sq sq--home-red" />
                  <div className="sq sq--home-red" />
                  <div className="sq sq--home-red" />
                  {/* Col 6 of row B = last red home col cell (finished token) */}
                  <div className="sq sq--home-red">
                    <div className="token token--red">R1<span className="token-tip">R1 – Finished</span></div>
                  </div>
                  {/* Row C (bottom) */}
                  {/* Col 1 = Red start square; R2 token is here */}
                  <div className="sq" />
                  <div className="sq" />
                  <div className="sq sq--safe" />
                  <div className="sq" />
                  <div className="sq" />
                  <div className="sq" />
                </div>
                {/* Centre (3×3) — 4 triangles meeting at a point */}
                <div className="centre">
                  <div className="tri tri--top" />
                  <div className="tri tri--right" />
                  <div className="tri tri--bot" />
                  <div className="tri tri--left" />
                  <span className="centre-star">★</span>
                </div>
                {/* Right Track: 6 cols × 3 rows
     Row layout (top→bottom): row A | row B (yellow home col) | row C
     Col layout (left→right): col 1 (adj centre) .. col 6 (rightmost)

     Yellow start square is col 6, row A (top-right of this section).
     Yellow home column runs across row B (cols 2-6; col 1 adj centre = finished pos).

     [rowA][col6]    = YELLOW START sq; Y2 token
     [rowB][col1]    = adj centre (yellow finished token Y1)
     [rowB][col2..6] = yellow home col
     [rowC][col1..6] = normal track
*/}
                <div className="track-col track-col--right">
                  {/* Row A */}
                  <div className="sq" />
                  <div className="sq" />
                  <div className="sq" />
                  <div className="sq sq--safe" />
                  <div className="sq" />
                  {/* Col 6 = Yellow start square; Y2 token */}
                  <div className="sq" />
                  {/* Row B = Yellow home column */}
                  {/* Col 1 of row B = last yellow home col cell closest to centre (finished token) */}
                  <div className="sq sq--home-yellow">
                    <div className="token token--yel">Y1<span className="token-tip">Y1 – Finished</span></div>
                  </div>
                  <div className="sq sq--home-yellow" />
                  <div className="sq sq--home-yellow" />
                  <div className="sq sq--home-yellow" />
                  <div className="sq sq--home-yellow" />
                  <div className="sq" />
                  {/* Row C */}
                  <div className="sq" />
                  <div className="sq" />
                  <div className="sq" />
                  <div className="sq" />
                  <div className="sq sq--start-yellow">
                    <div className="token token--yel">Y2<span className="token-tip">Y2 – Start square</span></div>
                  </div>  {/* safe sq */}
                  <div className="sq" />
                </div>
              </div>{/* /.board-row--mid */}
              {/* ══ ROW 3: Green Home | Bottom Track | Yellow Home ══ */}
              <div className="board-row board-row--bot">
                {/* Green Home (6×6) */}
                <div className="home home--green">
                  <div className="yard">
                    <div className="token-slot">
                      <div className="token token--green">G3<span className="token-tip">G3 – Home base</span></div>
                    </div>
                    <div className="token-slot">
                      <div className="token token--green">G4<span className="token-tip">G4 – Home base</span></div>
                    </div>
                    <div className="token-slot" />
                    <div className="token-slot" />
                  </div>
                </div>
                {/* Bottom Track: 3 cols × 6 rows
     Col layout (left→right): col A | col B (green home col) | col C
     Row layout (top→bottom): row 1 (adj middle band) → row 6 (bottommost)

     Green start square: col C, row 1 (top-right of bottom track).
     Green home column: col B rows 1-5; row 1 col B = adj centre (finished pos).

     [row1][colA]    = normal
     [row1][colB]    = green home col adj centre → G1 finished token
     [row1][colC]    = GREEN START sq; G2 token
     [row2..6][colB] = green home col
     [row6][colA]    = safe sq
*/}
                <div className="track-col track-col--bot">
                  {/* Row 1 */}
                  <div className="sq" />
                  {/* Col B row 1 = last green home col cell (finished token) */}
                  <div className="sq sq--home-green">
                    <div className="token token--green">G1<span className="token-tip">G1 – Finished</span></div>
                  </div>
                  <div className="sq" />
                  {/* Row 2 */}
                  <div className="sq" />
                  <div className="sq sq--home-green" />
                  <div className="sq" />
                  {/* Row 3 */}
                  <div className="sq" />
                  <div className="sq sq--home-green" />
                  <div className="sq" />
                  {/* Row 4 */}
                  <div className="sq" />
                  <div className="sq sq--home-green" />
                  <div className="sq sq--safe" />
                  {/* Row 5 */}
                  <div className="sq sq--start-green">
                    <div className="token token--green">G2<span className="token-tip">G2 – Start square</span></div>
                  </div>
                  <div className="sq sq--home-green" />
                  <div className="sq" />
                  {/* Row 6 */}
                  <div className="sq" />
                  <div className="sq" />
                  <div className="sq" />
                </div>
                {/* Yellow Home (6×6) */}
                <div className="home home--yellow">
                  <div className="yard">
                    <div className="token-slot">
                      <div className="token token--yel">Y3<span className="token-tip">Y3 – Home base</span></div>
                    </div>
                    <div className="token-slot">
                      <div className="token token--yel">Y4<span className="token-tip">Y4 – Home base</span></div>
                    </div>
                    <div className="token-slot" />
                    <div className="token-slot" />
                  </div>
                </div>
              </div>{/* /.board-row--bot */}
            </div>{/* /.ludo-board */}
            {/* <div class="move-options">
    <div class="mo-label">Select a token to move (rolled 6):</div>
    <div class="tok-btns">
<button class="tok-btn"><div class="dot-red-sm"></div>R2 – Start sq.</button>
<button class="tok-btn"><div class="dot-red-sm"></div>R3 – Enter board</button>
<button class="tok-btn"><div class="dot-red-sm"></div>R4 – Enter board</button>
<button class="tok-btn disabled"><div class="dot-gray-sm"></div>R1 – Finished</button>
    </div>
  </div> */}
          </div>
          {/* ══ RIGHT SIDEBAR ══ */}
          <aside>
            <div className="panel">
              <div className="panel-hd">Live Chat</div>
              <div className="chat-window">
                <div className="chat-messages">
                  <div className="chat-msg sys"><div className="msg-bubble">Game started – Good luck everyone!</div></div>
                  <div className="chat-msg">
                    <div className="msg-meta"><span className="msg-sender msg-sender-blue">Ali</span><span className="msg-time">14:02</span></div>
                    <div className="msg-bubble">nice roll lol</div>
                  </div>
                  <div className="chat-msg mine">
                    <div className="msg-meta flex-end-justify"><span className="msg-time">14:03</span><span className="msg-sender msg-sender-red">You</span></div>
                    <div className="msg-bubble">finally a 6!</div>
                  </div>
                  <div className="chat-msg">
                    <div className="msg-meta"><span className="msg-sender msg-sender-green">Sara</span><span className="msg-time">14:03</span></div>
                    <div className="msg-bubble">watch out for my tokens 😈</div>
                  </div>
                  <div className="chat-msg sys"><div className="msg-bubble">Sara's G2 captured Red R2 — sent home!</div></div>
                  <div className="chat-msg">
                    <div className="msg-meta"><span className="msg-sender msg-sender-blue">Ali</span><span className="msg-time">14:04</span></div>
                    <div className="msg-bubble">oof that hurts</div>
                  </div>
                  <div className="chat-msg mine">
                    <div className="msg-meta flex-end-justify"><span className="msg-time">14:04</span><span className="msg-sender msg-sender-red">You</span></div>
                    <div className="msg-bubble">revenge time 😤</div>
                  </div>
                  <div className="chat-msg">
                    <div className="msg-meta"><span className="msg-sender msg-sender-green">Sara</span><span className="msg-time">14:05</span></div>
                    <div className="msg-bubble">good luck catching me lol</div>
                  </div>
                </div>
                <div className="quick-react">
                  <button className="qr-btn">👏</button><button className="qr-btn">😂</button>
                  <button className="qr-btn">😱</button><button className="qr-btn">👍</button>
                  <button className="qr-btn">😬</button><button className="qr-btn">🎉</button>
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
                <div className="log-entry"><span className="log-time">14:01</span><div className="log-dot log-dot-red" /><span className="log-text">Red rolled 6 — R2 entered board.</span></div>
                <div className="log-entry"><span className="log-time">14:01</span><div className="log-dot log-dot-blue" /><span className="log-text">Blue rolled 6 — B2 entered board.</span></div>
                <div className="log-entry capture"><span className="log-time">14:02</span><div className="log-dot log-dot-green" /><span className="log-text">Green G2 captured Blue B2 — home!</span></div>
                <div className="log-entry"><span className="log-time">14:02</span><div className="log-dot log-dot-yellow" /><span className="log-text">Yellow rolled 6 — Y2 entered board.</span></div>
                <div className="log-entry finish"><span className="log-time">14:03</span><div className="log-dot log-dot-red" /><span className="log-text">Red R1 reached the finish! ★</span></div>
                <div className="log-entry finish"><span className="log-time">14:03</span><div className="log-dot log-dot-blue" /><span className="log-text">Blue B1 reached the finish! ★</span></div>
                <div className="log-entry"><span className="log-time">14:04</span><div className="log-dot log-dot-red" /><span className="log-text">Red rolled 6 — extra turn!</span></div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-hd">Scores &amp; Stats</div>
              <div className="panel-bd">
                <div className="score-grid">
                  <div className="score-cell"><div className="sc-label">Tokens Finished</div><div className="sc-value sc-value-green">4</div></div>
                  <div className="score-cell"><div className="sc-label">Captures</div><div className="sc-value" style={{ color: '#c62828' }}>2</div></div>
                  <div className="score-cell"><div className="sc-label">Turns Taken</div><div className="sc-value">12</div></div>
                  <div className="score-cell"><div className="sc-label">6s Rolled</div><div className="sc-value sc-value-blue">5</div></div>
                </div>
                <div className="standings-wrap">
                  <div className="standings-title">Standings</div>
                  <div className="standing-row"><span className="s-rank">1.</span><div className="p-dot dot-red" /><span className="flex-1">You (Red)</span><strong className="standing-strong-red">1 fin</strong></div>
                  <div className="standing-row"><span className="s-rank">1.</span><div className="p-dot dot-blue" /><span className="flex-1">Ali (Blue)</span><strong className="standing-strong-blue">1 fin</strong></div>
                  <div className="standing-row"><span className="s-rank">1.</span><div className="p-dot dot-green" /><span className="flex-1">Sara (Green)</span><strong className="standing-strong-green">1 fin</strong></div>
                  <div className="standing-row"><span className="s-rank">1.</span><div className="p-dot dot-yellow" /><span className="flex-1">Zaid (Yellow)</span><strong className="standing-strong-yellow">1 fin</strong></div>
                </div>
              </div>
            </div>
          </aside>
        </div>{/* /.layout */}
      </div>{/* /.page */}
      {/* Victory overlay */}
      <div className="victory-overlay" id="victory-overlay">
        <div className="victory-card">
          <div className="vc-trophy">🏆</div>
          <h2>Victory!</h2>
          <div className="vc-winner color-red">You (Red) Win!</div>
          <div className="vc-stats">All 4 tokens finished<br />2 captures · 18 turns<br />Duration: 12:44</div>
          <div className="vc-actions">
            <button className="btn btn-success">Play Again</button>
            <button className="btn btn-muted">Main Menu</button>
            <button className="btn btn-primary">View Stats</button>
          </div>
        </div>
      </div>
    </div>
  );
}