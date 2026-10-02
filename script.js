/* =============================================
   THE MYSTERY - complete game script
   ============================================= */

/* =============================================
   GAME DATA (unchanged)
   ============================================= */

const suspects = [
  { id: 'alex',   name: 'Alex Morgan',   role: 'Lab Engineer',
    description: 'Responsible for maintaining laboratory equipment and systems. Has been with the company for 3 years.',
    statement: 'I left the lab at 10:45 PM after running diagnostics. Everything was normal when I left. I was home by 11:15 PM.' },
  { id: 'maya',   name: 'Maya Carter',   role: 'Security Officer',
    description: 'Head of night security with full access to all areas. Known for being thorough and detail-oriented.',
    statement: "I was monitoring the cameras from the security office all night. The system went offline briefly around 11:30 PM, but I didn't notice anything unusual." },
  { id: 'daniel', name: 'Daniel Reed',   role: 'Researcher',
    description: 'Lead researcher on the prototype project. Has intimate knowledge of the device and its value.',
    statement: 'I was working late in my office on the second floor. I sent some project emails around 11:40 PM but never went near the lab that night.' },
  { id: 'sarah',  name: 'Sarah Bennett', role: 'Project Manager',
    description: 'Oversees all research projects and budget allocation. Under pressure to deliver results.',
    statement: "I left the building at 9 PM. I have meeting notes and my car's parking lot timestamp to prove it. I wasn't even in the building." }
];

const evidence = [
  { id: 'camera',  title: 'Security Camera Malfunction',
    description: 'Security camera footage stopped recording at exactly 11:31 PM. The system logs show it was manually disabled from the security terminal using admin credentials.' },
  { id: 'keycard', title: 'Keycard Access Log',
    description: "Maya Carter's security keycard was used to access the laboratory at 11:34 PM. However, Maya claims she was in the security office at that time." },
  { id: 'email',   title: 'Encrypted Email',
    description: "An encrypted email with attachment related to the prototype specifications was sent from Daniel Reed's computer at 11:40 PM to an external address." },
  { id: 'lock',    title: 'Laboratory Lock Status',
    description: 'The laboratory door was recorded as locked and secured at 11:47 PM when the missing prototype was discovered. No signs of forced entry.' }
];

const timeline = [
  { time: '11:31 PM', event: 'Security camera system manually disabled' },
  { time: '11:34 PM', event: "Laboratory accessed using Maya Carter's keycard" },
  { time: '11:40 PM', event: "Encrypted email sent from Daniel Reed's computer" },
  { time: '11:47 PM', event: 'Laboratory found locked, prototype missing' }
];

const interviews = [
  { name: 'Alex Morgan',   role: 'Lab Engineer',
    statement: "I left at 10:45 PM after finishing my diagnostics routine. I always double-check everything before I go. The prototype was secure in its case when I left. I drove straight home." },
  { name: 'Maya Carter',   role: 'Security Officer',
    statement: "I was in the security office all evening. Yes, the cameras went down around 11:30, but that happens sometimes. As for my keycard showing lab access at 11:34 - that's impossible. Someone must have cloned it." },
  { name: 'Daniel Reed',   role: 'Researcher',
    statement: "I was working late in my office. I sent a few project emails around 11:40, but they were routine updates. I never went to the lab that night. The email encryption is standard protocol." },
  { name: 'Sarah Bennett', role: 'Project Manager',
    statement: "I wasn't even in the building. I left at 9 PM - I had dinner plans. Security logs will show my exit time. I don't have the technical knowledge to disable cameras anyway." }
];

const solution = {
  suspect: 'maya', culprit: 'Maya Carter', accomplice: 'Daniel Reed', keyEvidence: 'keycard',
  explanation: "Maya Carter disabled the security cameras using her admin access at 11:31 PM, then used her own keycard to enter the lab at 11:34 PM and take the prototype. Daniel Reed sent the encrypted prototype specifications to external buyers at 11:40 PM. Maya's claim that her keycard was cloned was a lie."
};

/* =============================================
   SCREEN NAVIGATION
   ============================================= */

function navigateTo(screenId) {
  stopGameLoop();
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');
  window.scrollTo(0, 0);
  if (screenId === 'lab') initLab();
}

function startCase()          { navigateTo('case-intro'); }
function beginInvestigation() { navigateTo('lab'); }

function showHowToPlay() {
  alert('HOW TO PLAY\n\n1. Explore Blackwood Research Lab with WASD or arrow keys.\n2. Walk near objects or suspects and press E to interact.\n3. Press J to open your detective journal.\n4. Collect all 4 clues, then make your Final Deduction.');
}

/* =============================================
   STATIC SCREENS (unchanged)
   ============================================= */

function renderSuspects() {
  document.getElementById('suspects-list').innerHTML = suspects.map(s => `
    <div class="suspect-card">
      <div class="suspect-header"><h3 class="suspect-name">${s.name}</h3><p class="suspect-role">${s.role}</p></div>
      <p class="suspect-description">${s.description}</p>
      <blockquote class="suspect-statement">"${s.statement}"</blockquote>
    </div>`).join('');
}

function renderEvidence() {
  document.getElementById('evidence-list').innerHTML = evidence.map((e, i) => `
    <div class="evidence-item">
      <div class="evidence-header"><span class="evidence-number">Evidence ${i+1}</span><h3 class="evidence-title">${e.title}</h3></div>
      <p class="evidence-description">${e.description}</p>
    </div>`).join('');
}

function renderTimeline() {
  document.getElementById('timeline-list').innerHTML = timeline.map(t => `
    <div class="timeline-item">
      <div class="timeline-time">${t.time}</div><div class="timeline-event">${t.event}</div>
    </div>`).join('');
}

function renderInterviews() {
  document.getElementById('interviews-list').innerHTML = interviews.map(i => `
    <div class="interview-item">
      <div class="interview-header"><h3 class="interview-name">${i.name}</h3><p class="interview-role">${i.role}</p></div>
      <p class="interview-statement">${i.statement}</p>
    </div>`).join('');
}

function populateDeductionForm() {
  document.getElementById('suspect-select').innerHTML =
    '<option value="">Select a suspect...</option>' +
    suspects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  document.getElementById('evidence-select').innerHTML =
    '<option value="">Select key evidence...</option>' +
    evidence.map(e => `<option value="${e.id}">${e.title}</option>`).join('');
}

function handleDeductionSubmit(evt) {
  evt.preventDefault();
  const sid   = document.getElementById('suspect-select').value;
  const theory= document.getElementById('theory-input').value;
  const eid   = document.getElementById('evidence-select').value;
  if (!sid || !theory || !eid) { alert('Please complete all fields.'); return; }
  showResult((sid === solution.suspect) && (eid === solution.keyEvidence), sid, eid);
}

function showResult(solved, sid, eid) {
  const sName = suspects.find(s => s.id === sid)?.name || 'Unknown';
  const eName = evidence.find(e => e.id === eid)?.title || 'Unknown';
  document.getElementById('result-display').innerHTML = solved ? `
    <h2 class="result-verdict solved">CASE SOLVED</h2>
    <div class="result-explanation">
      <div><h3 class="result-section-title">Your Deduction</h3><p class="result-section-content">You correctly identified ${solution.culprit} using the ${eName}.</p></div>
      <div><h3 class="result-section-title">What Happened</h3><p class="result-section-content">${solution.explanation}</p></div>
      <div><h3 class="result-section-title">Key Evidence</h3><p class="result-section-content">The keycard log proved Maya entered the lab herself, contradicting her own alibi.</p></div>
    </div>
    <div class="result-actions">
      <button class="btn btn-primary" onclick="resetGame()">Play Again</button>
      <button class="btn btn-secondary" onclick="navigateTo('dashboard')">Review Evidence</button>
    </div>` : `
    <h2 class="result-verdict unsolved">CASE UNSOLVED</h2>
    <div class="result-explanation">
      <div><h3 class="result-section-title">Your Deduction</h3><p class="result-section-content">You suspected ${sName} based on ${eName}, but the evidence points elsewhere.</p></div>
      <div><h3 class="result-section-title">What Actually Happened</h3><p class="result-section-content">${solution.explanation}</p></div>
      <div><h3 class="result-section-title">The Critical Clue</h3><p class="result-section-content">Maya's keycard log and her own alibi directly contradict each other.</p></div>
    </div>
    <div class="result-actions">
      <button class="btn btn-primary" onclick="resetGame()">Try Again</button>
      <button class="btn btn-secondary" onclick="navigateTo('dashboard')">Review Evidence</button>
    </div>`;
  navigateTo('result');
}

function resetGame() {
  gameState.collectedEvidence = [];
  gameState.interactedObjects = new Set();
  document.getElementById('deduction-form').reset();
  navigateTo('home');
}

/* ============================================================
   2D LAB ENGINE
   ============================================================ */

/* --- Constants -------------------------------------------- */
const TILE   = 48;   // larger tiles = bigger, more readable map
const COLS   = 36;
const ROWS   = 26;
const MAP_W  = COLS * TILE;
const MAP_H  = ROWS * TILE;
const PLAYER_SPEED = 180;  // pixels per second (delta-time based)

const C = {
  // Floors
  outerBg:    '#080a0e',
  floorMain:  '#0f1218',
  floorSec:   '#0c0f1c',
  floorRes:   '#0e1118',
  floorStore: '#0b0d11',
  floorCorr:  '#0d1016',
  floorOff:   '#0f1218',
  floorTile:  'rgba(255,255,255,0.018)',
  // Walls
  wallBase:   '#1e2230',
  wallFace:   '#2a2f40',
  wallShadow: '#0a0c12',
  // Doors
  doorOpen:   '#1a1408',
  doorFrame:  '#b89550',
  // Furniture
  deskBody:   '#1c1a14',
  deskSurf:   '#28231a',
  deskEdge:   '#342c20',
  cabinetA:   '#161618',
  cabinetB:   '#1e1e22',
  // Tech
  pcCase:     '#0a101e',
  pcScreen:   '#0c2840',
  pcGlow:     'rgba(60,140,240,0.3)',
  serverA:    '#121820',
  serverB:    '#1a2030',
  serverLED:  '#00c860',
  // Security
  camBody:    '#1a1c22',
  camLens:    '#0a0c14',
  camRed:     '#d03020',
  keypadBody: '#0c1420',
  keypadLit:  '#c8a050',
  // Lab
  labBench:   '#141c1e',
  labEquip:   '#101820',
  labBlue:    '#2a6888',
  // NPC base colors
  npcSkin:    '#c09060',
};

/* ----------------------------------------------------------------
   MAP DEFINITION
   Rooms are tile-coordinate rectangles.
   Walls are built from their borders, with explicit gap tiles
   (door openings) punched through so the player can navigate.
   ---------------------------------------------------------------- */

// Room floor areas  [col, row, widthTiles, heightTiles]
const ROOMS = {
  main:     { x:1,  y:1,  w:13, h:11, color: C.floorMain  },   // Main Laboratory
  security: { x:16, y:1,  w:9,  h:7,  color: C.floorSec   },   // Security Room
  research: { x:27, y:1,  w:8,  h:11, color: C.floorRes   },   // Research Room
  storage:  { x:1,  y:14, w:7,  h:11, color: C.floorStore },   // Storage Area
  corridor: { x:8,  y:14, w:19, h:4,  color: C.floorCorr  },   // Corridor
  office:   { x:27, y:14, w:8,  h:11, color: C.floorOff   }    // Office
};

/* Collision map: 1 = solid, 0 = passable.
   We build this from the room walls + furniture, with door gaps explicitly
   cleared. This makes collision O(1) per check (bitmap lookup). */
let CMAP = null;   // will be built in buildCollisionMap()

/* Door openings — each entry removes a wall segment.
   Format: [col, row]  (a single tile to clear) */
const DOOR_TILES = [
  // Main Lab south wall  -> Corridor (col 7-8, row 12 is the wall row)
  [7, 12], [8, 12],
  // Storage north wall -> Corridor (col 4-5, row 14 is wall row)
  [4, 14], [5, 14],
  // Corridor east -> Office (col 27 is wall col, rows 15-16)
  [27, 15], [27, 16],
  // Research south -> Corridor (col 29-30, row 12)
  [29, 12], [30, 12],
  // Security south -> Corridor (col 19-20, row 8)
  [19, 8], [20, 8],
  // Main Lab east wall -> (hallway between rooms, col 14, rows 4-5)
  [14, 4], [14, 5],
  // Security west wall -> col 16, rows 4-5
  [16, 4], [16, 5],
  // Research west -> col 27, rows 4-5
  [27, 4], [27, 5],
  // Office west -> col 27, rows 16-17
  [27, 16], [27, 17]
];

/* Furniture rects that block movement [col, row, w, h] */
const FURNITURE_RECTS = [
  // Main Lab — two rows of desks
  [2,  3,  3, 1], [2,  5,  3, 1], [2,  8,  3, 1],
  [8,  3,  3, 1], [8,  6,  3, 1], [8,  9,  3, 1],
  // Security Room — main console + filing cabinets
  [17, 2,  6, 1], [17, 4,  2, 2], [21, 4,  2, 2],
  // Research Room — lab benches
  [28, 2,  5, 1], [28, 5,  5, 1], [28, 8,  5, 1],
  // Storage — shelving units
  [2,  15, 5, 1], [2,  17, 5, 1], [2,  19, 5, 1], [2,  21, 5, 1],
  // Corridor — nothing blocking the path
  // Office — desk + shelves
  [28, 15, 5, 1], [28, 18, 5, 1], [28, 21, 5, 1]
];

/* ----------------------------------------------------------------
   BUILD COLLISION BITMAP
   ---------------------------------------------------------------- */
function buildCollisionMap() {
  // Allocate flat Uint8Array: 1=solid, 0=open
  CMAP = new Uint8Array(COLS * ROWS);

  // Helper: mark rect solid
  function solidRect(cx, cy, cw, ch) {
    for (let r = cy; r < cy + ch; r++)
      for (let c = cx; c < cx + cw; c++)
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS)
          CMAP[r * COLS + c] = 1;
  }

  // Everything outside rooms is solid by default
  CMAP.fill(1);

  // Carve out room floors (open)
  for (const rm of Object.values(ROOMS)) {
    for (let r = rm.y; r < rm.y + rm.h; r++)
      for (let c = rm.x; c < rm.x + rm.w; c++)
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS)
          CMAP[r * COLS + c] = 0;
  }

  // Re-stamp furniture as solid
  for (const [fc, fr, fw, fh] of FURNITURE_RECTS) solidRect(fc, fr, fw, fh);

  // Punch door gaps through (re-open door tiles)
  for (const [dc, dr] of DOOR_TILES) {
    if (dr >= 0 && dr < ROWS && dc >= 0 && dc < COLS)
      CMAP[dr * COLS + dc] = 0;
  }
}

/* ----------------------------------------------------------------
   COLLISION CHECK  (pixel-space, AABB vs collision bitmap)
   ---------------------------------------------------------------- */
function isSolid(col, row) {
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return true;
  return CMAP[row * COLS + col] === 1;
}

// Check if a pixel-rect (px,py,pw,ph) overlaps any solid tile
function wouldCollide(px, py) {
  const pw = player.w, ph = player.h;
  // Sample four corners + midpoints of each edge for reliability
  const xs = [px, px + pw - 1, px + pw / 2];
  const ys = [py, py + ph - 1, py + ph / 2];
  for (const x of xs)
    for (const y of ys)
      if (isSolid(Math.floor(x / TILE), Math.floor(y / TILE))) return true;
  return false;
}

/* ============================================================
   INTERACTABLES
   ============================================================ */

const INTERACTABLES = [
  // Evidence objects
  { id:'obj_cam',  type:'evidence', evidenceId:'camera',  tx:13, ty:2,  label:'E \u2014 Examine Camera',    radius:68 },
  { id:'obj_kc',   type:'evidence', evidenceId:'keycard', tx:16, ty:6,  label:'E \u2014 Check Keycard Log', radius:68 },
  { id:'obj_pc',   type:'evidence', evidenceId:'email',   tx:31, ty:6,  label:'E \u2014 Check Computer',    radius:68 },
  { id:'obj_door', type:'evidence', evidenceId:'lock',    tx:7,  ty:12, label:'E \u2014 Inspect Door Lock', radius:68 },
  // NPC suspects
  { id:'npc_alex',   type:'npc', suspectId:'alex',   tx:5,  ty:6,  label:'E \u2014 Talk to Alex',    radius:68, npcColor:'#7a5f38' },
  { id:'npc_maya',   type:'npc', suspectId:'maya',   tx:20, ty:4,  label:'E \u2014 Talk to Maya',    radius:68, npcColor:'#3a5a6a' },
  { id:'npc_daniel', type:'npc', suspectId:'daniel', tx:30, ty:9,  label:'E \u2014 Talk to Daniel',  radius:68, npcColor:'#3a5a3a' },
  { id:'npc_sarah',  type:'npc', suspectId:'sarah',  tx:12, ty:17, label:'E \u2014 Talk to Sarah',   radius:68, npcColor:'#5a3a4a' }
];

/* ============================================================
   GAME STATE
   ============================================================ */

const gameState = {
  collectedEvidence: [],
  interactedObjects: new Set(),
  dialogueOpen:  false,
  journalOpen:   false,
  nearObject:    null,
  loopId:        null,
  lastTime:      0     // for delta-time
};

/* ============================================================
   PLAYER STATE
   ============================================================ */

const player = {
  // Start in main lab open area
  x: 5 * TILE,
  y: 7 * TILE,
  w: 22,
  h: 24,
  vx: 0,
  vy: 0,
  dir:       'down',   // 'up' | 'down' | 'left' | 'right'
  moving:    false,
  // Walk animation
  animStep:  0,        // 0-3 walk cycle index
  animTimer: 0         // accumulates delta time (ms)
};

/* ============================================================
   CAMERA STATE  (smoothed)
   ============================================================ */

const cam = {
  x: 0,
  y: 0,
  // lerp factor per second — higher = snappier
  lerpSpeed: 8
};

/* ============================================================
   INPUT
   ============================================================ */

const keys = {};

function onKeyDown(e) {
  keys[e.code] = true;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();

  if (e.code === 'KeyE') {
    if (gameState.dialogueOpen) { closeDialogue(); return; }
    if (gameState.nearObject && !gameState.journalOpen) triggerInteraction(gameState.nearObject);
  }
  if (e.code === 'KeyJ') {
    if (gameState.dialogueOpen) return;
    gameState.journalOpen ? closeJournal() : openJournal();
  }
  if (e.code === 'Tab') {
    e.preventDefault();
    if (!gameState.dialogueOpen && !gameState.journalOpen) navigateTo('dashboard');
  }
}

function onKeyUp(e) { keys[e.code] = false; }

/* ============================================================
   MOVEMENT  (delta-time based, diagonal normalised)
   ============================================================ */

function updatePlayer(dt) {
  if (gameState.dialogueOpen || gameState.journalOpen) {
    player.moving = false;
    player.vx = 0; player.vy = 0;
    return;
  }

  let dx = 0, dy = 0;
  if (keys['KeyW'] || keys['ArrowUp'])    dy = -1;
  if (keys['KeyS'] || keys['ArrowDown'])  dy =  1;
  if (keys['KeyA'] || keys['ArrowLeft'])  dx = -1;
  if (keys['KeyD'] || keys['ArrowRight']) dx =  1;

  // Normalise diagonal
  if (dx !== 0 && dy !== 0) { dx *= 0.7071; dy *= 0.7071; }

  const speed = PLAYER_SPEED * dt;   // pixels this frame
  player.vx = dx * speed;
  player.vy = dy * speed;
  player.moving = (dx !== 0 || dy !== 0);

  // Direction — prefer the dominant axis
  if (Math.abs(dy) >= Math.abs(dx)) {
    if (dy < 0) player.dir = 'up';
    else if (dy > 0) player.dir = 'down';
  } else {
    if (dx < 0) player.dir = 'left';
    else if (dx > 0) player.dir = 'right';
  }

  // Move X then Y separately so we slide along walls
  const nx = player.x + player.vx;
  if (!wouldCollide(nx, player.y)) {
    player.x = nx;
  }
  const ny = player.y + player.vy;
  if (!wouldCollide(player.x, ny)) {
    player.y = ny;
  }

  // Walk animation — advance every 120 ms when moving
  if (player.moving) {
    player.animTimer += dt * 1000;
    if (player.animTimer >= 120) {
      player.animTimer = 0;
      player.animStep = (player.animStep + 1) % 4;
    }
  } else {
    player.animStep  = 0;
    player.animTimer = 0;
  }

  // Proximity to interactables
  const pcx = player.x + player.w / 2;
  const pcy = player.y + player.h / 2;
  let nearest = null, nearDist = Infinity;
  for (const obj of INTERACTABLES) {
    const ox = obj.tx * TILE + TILE / 2;
    const oy = obj.ty * TILE + TILE / 2;
    const d  = Math.hypot(pcx - ox, pcy - oy);
    if (d < obj.radius && d < nearDist) { nearDist = d; nearest = obj; }
  }
  gameState.nearObject = nearest;
}

/* ============================================================
   CAMERA UPDATE  (smooth follow)
   ============================================================ */

function updateCamera(dt) {
  if (!canvas) return;
  const vw = canvas.width, vh = canvas.height;

  // Target: player centred in viewport
  const targetX = player.x + player.w / 2 - vw / 2;
  const targetY = player.y + player.h / 2 - vh / 2;

  // Clamp to map
  const clampedX = Math.max(0, Math.min(MAP_W - vw, targetX));
  const clampedY = Math.max(0, Math.min(MAP_H - vh, targetY));

  // Exponential lerp — feels smooth, no jitter
  const alpha = 1 - Math.exp(-cam.lerpSpeed * dt);
  cam.x += (clampedX - cam.x) * alpha;
  cam.y += (clampedY - cam.y) * alpha;

  // Sub-pixel snap when very close to avoid floating-point drift
  if (Math.abs(cam.x - clampedX) < 0.1) cam.x = clampedX;
  if (Math.abs(cam.y - clampedY) < 0.1) cam.y = clampedY;
}

/* ============================================================
   RENDERING
   ============================================================ */

let canvas, ctx;

/* ---- Helpers ---- */
function hex2rgb(hex) {
  const n = parseInt(hex.replace('#',''), 16);
  return [(n>>16)&255, (n>>8)&255, n&255];
}
function lighten(hex, amt) {
  const [r,g,b] = hex2rgb(hex);
  return `rgb(${Math.min(255,r+amt)},${Math.min(255,g+amt)},${Math.min(255,b+amt)})`;
}
function darken(hex, amt) { return lighten(hex, -amt); }
function rgba(hex, a) {
  const [r,g,b] = hex2rgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}
function rgba(hex, a) {
  const [r,g,b] = hex2rgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

/* ---- Floor ---- */
function drawFloors() {
  // Void outside rooms
  ctx.fillStyle = C.outerBg;
  ctx.fillRect(0, 0, MAP_W, MAP_H);

  // Per-room floor with unique visual identity
  for (const [name, rm] of Object.entries(ROOMS)) {
    const rx = rm.x * TILE, ry = rm.y * TILE;
    const rw = rm.w * TILE, rh = rm.h * TILE;

    // Base fill
    ctx.fillStyle = rm.color;
    ctx.fillRect(rx, ry, rw, rh);

    // Room-specific floor patterns
    if (name === 'main') {
      // Large square lab tiles — dark grout lines
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 1;
      const tSize = TILE;
      for (let r = rm.y; r < rm.y + rm.h; r++)
        for (let c = rm.x; c < rm.x + rm.w; c++)
          ctx.strokeRect(c*tSize + 1, r*tSize + 1, tSize - 2, tSize - 2);
      // Faint inner highlight on each tile
      ctx.fillStyle = 'rgba(255,255,255,0.012)';
      for (let r = rm.y; r < rm.y + rm.h; r++)
        for (let c = rm.x; c < rm.x + rm.w; c++)
          ctx.fillRect(c*tSize + 2, r*tSize + 2, tSize - 4, 8);

    } else if (name === 'security') {
      // Diagonal stripe pattern — high-security feel
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.strokeStyle = 'rgba(0,180,255,0.04)';
      ctx.lineWidth = 2;
      for (let i = -rh; i < rw + rh; i += 18) {
        ctx.beginPath();
        ctx.moveTo(rx + i, ry);
        ctx.lineTo(rx + i + rh, ry + rh);
        ctx.stroke();
      }
      ctx.restore();
      // Fine grid overlay
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 0.5;
      for (let r = rm.y; r < rm.y + rm.h; r++)
        for (let c = rm.x; c < rm.x + rm.w; c++)
          ctx.strokeRect(c*TILE, r*TILE, TILE, TILE);

    } else if (name === 'research') {
      // Clean white-lab look — bright tile borders
      ctx.strokeStyle = 'rgba(180,220,255,0.07)';
      ctx.lineWidth = 1;
      for (let r = rm.y; r < rm.y + rm.h; r++)
        for (let c = rm.x; c < rm.x + rm.w; c++)
          ctx.strokeRect(c*TILE + 1, r*TILE + 1, TILE - 2, TILE - 2);
      // Slight blue tint overlay
      ctx.fillStyle = 'rgba(20,60,100,0.06)';
      ctx.fillRect(rx, ry, rw, rh);

    } else if (name === 'storage') {
      // Rough concrete look — irregular dots
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      for (let i = 0; i < 60; i++) {
        const sx = rx + (i * 97 % rw);
        const sy = ry + (i * 61 % rh);
        ctx.fillRect(sx, sy, 2, 2);
      }
      // Basic grid
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 1;
      for (let r = rm.y; r < rm.y + rm.h; r++)
        for (let c = rm.x; c < rm.x + rm.w; c++)
          ctx.strokeRect(c*TILE, r*TILE, TILE, TILE);

    } else if (name === 'corridor') {
      // Narrow directional lines suggesting a walkway
      ctx.strokeStyle = 'rgba(200,169,110,0.05)';
      ctx.lineWidth = 1;
      for (let c = rm.x; c < rm.x + rm.w; c++) {
        const lx = c * TILE + TILE / 2;
        ctx.beginPath();
        ctx.moveTo(lx, ry);
        ctx.lineTo(lx, ry + rh);
        ctx.stroke();
      }
      // Dashed centre line
      ctx.setLineDash([6, 10]);
      ctx.strokeStyle = 'rgba(200,169,110,0.12)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rx, ry + rh/2);
      ctx.lineTo(rx + rw, ry + rh/2);
      ctx.stroke();
      ctx.setLineDash([]);

    } else {
      // Office / default — simple small grid
      ctx.strokeStyle = C.floorTile;
      ctx.lineWidth = 0.5;
      for (let r = rm.y; r < rm.y + rm.h; r++)
        for (let c = rm.x; c < rm.x + rm.w; c++)
          ctx.strokeRect(c*TILE, r*TILE, TILE, TILE);
    }

    // Thin inner border around each room (room boundary)
    ctx.strokeStyle = 'rgba(200,169,110,0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(rx + 0.5, ry + 0.5, rw - 1, rh - 1);
  }
}

/* ---- Walls ---- */
function drawWalls() {
  // Draw each solid tile from the collision map
  // Group adjacent horizontal runs for fewer fillRect calls
  for (let r = 0; r < ROWS; r++) {
    let runStart = -1;
    for (let c = 0; c <= COLS; c++) {
      const solid = c < COLS && CMAP[r * COLS + c] === 1;
      if (solid && runStart === -1) { runStart = c; }
      else if (!solid && runStart !== -1) {
        const wx = runStart * TILE, wy = r * TILE;
        const ww  = (c - runStart) * TILE;
        // Wall body
        ctx.fillStyle = C.wallBase;
        ctx.fillRect(wx, wy, ww, TILE);
        // Top highlight
        ctx.fillStyle = C.wallFace;
        ctx.fillRect(wx, wy, ww, 5);
        // Bottom shadow
        ctx.fillStyle = C.wallShadow;
        ctx.fillRect(wx, wy + TILE - 3, ww, 3);
        runStart = -1;
      }
    }
  }
}

/* ---- Door openings ---- */
function drawDoors() {
  for (const [dc, dr] of DOOR_TILES) {
    const dx = dc * TILE, dy = dr * TILE;
    // Dark floor colour in the opening
    ctx.fillStyle = C.doorOpen;
    ctx.fillRect(dx, dy, TILE, TILE);
    // Thin gold frame strips on the sides
    ctx.fillStyle = C.doorFrame;
    ctx.fillRect(dx,          dy, 3, TILE);
    ctx.fillRect(dx+TILE-3,   dy, 3, TILE);
  }
}

/* ---- Furniture ---- */
function drawFurniture() {
  for (const [fc, fr, fw, fh] of FURNITURE_RECTS) {
    const fx = fc*TILE, fy = fr*TILE, fwp = fw*TILE, fhp = fh*TILE;
    // Body
    ctx.fillStyle = C.deskBody;
    ctx.fillRect(fx, fy, fwp, fhp);
    // Surface highlight
    ctx.fillStyle = C.deskSurf;
    ctx.fillRect(fx+2, fy+2, fwp-4, 7);
    // Front edge
    ctx.fillStyle = C.deskEdge;
    ctx.fillRect(fx, fy+fhp-4, fwp, 4);
  }
}

/* ---- Computers ---- */
function drawComputers() {
  // Positions: [col, row]
  const pcPos = [
    // Main Lab
    [2,3],[5,3],[2,5],[5,5],[2,8],[5,8],[8,3],[8,6],[8,9],[10,3],[10,6],
    // Security
    [17,2],[19,2],[21,2],[23,2],
    // Research
    [28,2],[30,2],[28,5],[30,5],[28,8],[30,8],
    // Office
    [28,15],[30,15],[28,18]
  ];
  for (const [c, r] of pcPos) {
    const px = c*TILE+4, py = r*TILE+6;
    // Case
    ctx.fillStyle = C.pcCase;
    ctx.fillRect(px, py, 24, 18);
    // Screen
    ctx.fillStyle = C.pcScreen;
    ctx.fillRect(px+3, py+3, 18, 11);
    // Screen glow top strip
    ctx.fillStyle = C.pcGlow;
    ctx.fillRect(px+3, py+3, 18, 3);
    // Small status LED
    ctx.fillStyle = '#00b858';
    ctx.fillRect(px+1, py+1, 3, 3);
  }
}

/* ---- Security equipment ---- */
function drawSecurityEquipment() {
  // Camera unit — top-right corner of Main Lab
  const cam0 = INTERACTABLES.find(o => o.id === 'obj_cam');
  if (cam0) {
    const cx = cam0.tx*TILE + TILE/2, cy = cam0.ty*TILE + TILE/2;
    // Housing
    ctx.fillStyle = C.camBody;
    ctx.fillRect(cx-14, cy-7, 28, 14);
    // Lens
    ctx.fillStyle = C.camLens;
    ctx.beginPath(); ctx.arc(cx+9, cy, 5, 0, Math.PI*2); ctx.fill();
    // Red LED
    ctx.fillStyle = C.camRed;
    ctx.beginPath(); ctx.arc(cx-10, cy-3, 3, 0, Math.PI*2); ctx.fill();
    // Bracket
    ctx.fillStyle = C.camBody;
    ctx.fillRect(cx-3, cy-14, 6, 8);
  }

  // Keycard reader — on Security Room wall
  const kc = INTERACTABLES.find(o => o.id === 'obj_kc');
  if (kc) {
    const kx = kc.tx*TILE+8, ky = kc.ty*TILE+6;
    ctx.fillStyle = C.keypadBody;
    ctx.fillRect(kx, ky, 22, 32);
    // Lit panel
    ctx.fillStyle = C.keypadLit;
    ctx.fillRect(kx+4, ky+4, 14, 8);
    // Small dots (buttons)
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    for (let row = 0; row < 3; row++)
      for (let col = 0; col < 3; col++)
        ctx.fillRect(kx+5+col*5, ky+16+row*4, 3, 3);
  }
}

/* ---- Lab equipment ---- */
function drawLabEquipment() {
  // Benchtop instruments in Research Room
  const positions = [[29,4],[32,4],[29,7],[32,7],[29,10],[32,10]];
  for (const [c, r] of positions) {
    const ex = c*TILE+4, ey = r*TILE+8;
    ctx.fillStyle = C.labEquip;
    ctx.fillRect(ex, ey, 30, 20);
    ctx.fillStyle = C.labBlue;
    ctx.fillRect(ex+4, ey+4, 10, 6);
    ctx.fillStyle = 'rgba(40,180,255,0.2)';
    ctx.fillRect(ex+4, ey+4, 10, 2);
  }

  // Server rack in Security Room
  const sx = 22*TILE+4, sy = 4*TILE+4;
  ctx.fillStyle = C.serverA;
  ctx.fillRect(sx, sy, 36, 76);
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = C.serverB;
    ctx.fillRect(sx+3, sy+4+i*14, 30, 10);
    ctx.fillStyle = C.serverLED;
    ctx.fillRect(sx+5, sy+8+i*14, 4, 3);
  }

  // Storage shelving labels
  const shelfPositions = [[2,15],[2,17],[2,19],[2,21]];
  for (const [c, r] of shelfPositions) {
    const sx2 = c*TILE+2, sy2 = r*TILE+2;
    ctx.fillStyle = C.cabinetA;
    ctx.fillRect(sx2, sy2, TILE*4, TILE-4);
    // Shelf dividers
    ctx.fillStyle = C.cabinetB;
    for (let i = 1; i < 4; i++) ctx.fillRect(sx2 + i*TILE-1, sy2, 2, TILE-4);
  }
}

/* ---- Door lock (evidence object marker) ---- */
function drawDoorLock() {
  const door = INTERACTABLES.find(o => o.id === 'obj_door');
  if (!door) return;
  const dx = door.tx*TILE, dy = door.ty*TILE;
  ctx.fillStyle = C.doorOpen;
  ctx.fillRect(dx, dy-6, TILE, 12);
  ctx.fillStyle = C.doorFrame;
  ctx.fillRect(dx, dy-6, TILE, 3);
  ctx.fillRect(dx, dy+3,  TILE, 3);
  // Lock icon (small rectangle + circle)
  const lx = dx + TILE/2 - 5, ly = dy - 2;
  ctx.fillStyle = '#c8a050';
  ctx.fillRect(lx, ly, 10, 8);
  ctx.fillStyle = C.floorMain;
  ctx.beginPath(); ctx.arc(lx+5, ly+3, 2.5, 0, Math.PI*2); ctx.fill();
}

/* ---- Room labels ---- */
function drawRoomLabels() {
  ctx.font = 'bold 9px "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'rgba(200,169,110,0.30)';
  const labels = [
    ['MAIN LABORATORY',  (1 + 13/2)*TILE, (1+0.6)*TILE ],
    ['SECURITY ROOM',    (16 + 9/2)*TILE, (1+0.6)*TILE ],
    ['RESEARCH ROOM',    (27 + 8/2)*TILE, (1+0.6)*TILE ],
    ['STORAGE AREA',     (1 + 7/2)*TILE,  (14+0.6)*TILE],
    ['CORRIDOR',         (8 + 19/2)*TILE, (14+0.6)*TILE],
    ['OFFICE',           (27 + 8/2)*TILE, (14+0.6)*TILE]
  ];
  for (const [name, lx, ly] of labels) ctx.fillText(name, lx, ly);
  ctx.textAlign   = 'left';
  ctx.textBaseline = 'alphabetic';
}

/* ---- Evidence object highlights ---- */
function drawEvidenceMarkers() {
  const t = performance.now();
  for (const obj of INTERACTABLES.filter(o => o.type === 'evidence')) {
    const ox = obj.tx*TILE + TILE/2;
    const oy = obj.ty*TILE + TILE/2;
    const collected = gameState.collectedEvidence.includes(obj.evidenceId);
    const isNearest = gameState.nearObject?.id === obj.id;

    if (collected) {
      // Subtle green tint — already examined
      ctx.fillStyle = 'rgba(50,140,60,0.18)';
      ctx.beginPath(); ctx.arc(ox, oy, 14, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = 'rgba(60,180,70,0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(ox, oy, 14, 0, Math.PI*2); ctx.stroke();
    } else {
      // Pulsing gold dot — undiscovered
      const pulse = 0.6 + 0.4 * Math.sin(t / 700);
      ctx.fillStyle = `rgba(200,169,110,${0.12 * pulse})`;
      ctx.beginPath(); ctx.arc(ox, oy, 12, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = `rgba(200,169,110,${0.5 * pulse})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(ox, oy, 12, 0, Math.PI*2); ctx.stroke();
    }

    // Hover ring when player is near
    if (isNearest) {
      ctx.strokeStyle = collected ? 'rgba(80,200,90,0.8)' : 'rgba(220,185,100,0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(ox, oy, 20, 0, Math.PI*2); ctx.stroke();
    }
  }
}

/* ---- NPCs ---- */
function drawNPCs() {
  for (const obj of INTERACTABLES.filter(o => o.type === 'npc')) {
    const nx = obj.tx*TILE + TILE/2;
    const ny = obj.ty*TILE + TILE/2;
    const isNearest = gameState.nearObject?.id === obj.id;
    const suspect = suspects.find(s => s.id === obj.suspectId);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(nx, ny+14, 10, 4, 0, 0, Math.PI*2); ctx.fill();

    // Body (coat)
    ctx.fillStyle = darken(obj.npcColor, 10);
    ctx.fillRect(nx-10, ny-6, 20, 20);
    // Coat lapel
    ctx.fillStyle = lighten(obj.npcColor, 15);
    ctx.fillRect(nx-4, ny-6, 8, 6);

    // Head
    ctx.fillStyle = C.npcSkin;
    ctx.beginPath(); ctx.arc(nx, ny-14, 9, 0, Math.PI*2); ctx.fill();
    // Hair
    ctx.fillStyle = darken(obj.npcColor, 20);
    ctx.fillRect(nx-9, ny-22, 18, 9);

    // Name tag
    if (suspect) {
      ctx.font = '600 8px "Helvetica Neue", Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = 'rgba(232,228,220,0.8)';
      ctx.fillText(suspect.name, nx, ny+16);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
    }

    // Proximity ring
    if (isNearest) {
      ctx.strokeStyle = 'rgba(200,169,110,0.75)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(nx, ny, 22, 0, Math.PI*2); ctx.stroke();
    }
  }
}

/* ---- Player ---- */
// Walk cycle: 4 frames. Each entry = [leftLegOffset, rightLegOffset, armSwing, bodyBob]
const WALK_FRAMES = [
  [0,  0,  0,  0],
  [4, -4,  3, -1],
  [0,  0,  0,  0],
  [-4, 4, -3, -1]
];
// Idle breath: sine driven, very subtle
function getIdleBob(t) { return Math.sin(t / 900) * 1.2; }

function drawPlayer() {
  const t   = performance.now();
  const dir = player.dir;
  const cx  = player.x + player.w / 2;
  const cy  = player.y + player.h / 2;

  // Animation values
  const frame  = WALK_FRAMES[player.animStep];
  const lLeg   = player.moving ? frame[0] : 0;
  const rLeg   = player.moving ? frame[1] : 0;
  const armSwg = player.moving ? frame[2] : 0;
  const bob    = player.moving ? frame[3] : getIdleBob(t);

  // All drawing relative to character centre
  const bx = cx;
  const by = cy + bob;  // vertical bob applied to whole character

  // ── Ground shadow ──
  ctx.fillStyle = 'rgba(0,0,0,0.38)';
  ctx.beginPath();
  ctx.ellipse(bx, by + 14, 11, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  if (dir === 'up') {
    // ── BACK VIEW ──

    // Legs (behind coat)
    ctx.fillStyle = '#14141e';
    ctx.fillRect(bx - 8, by + 2,  6, 12 + lLeg);
    ctx.fillRect(bx + 2, by + 2,  6, 12 - rLeg);
    // Shoes
    ctx.fillStyle = '#0c0c14';
    ctx.fillRect(bx - 9, by + 12 + lLeg, 8, 4);
    ctx.fillRect(bx + 1, by + 12 - rLeg, 8, 4);

    // Coat body (back)
    ctx.fillStyle = '#1e2632';
    ctx.fillRect(bx - 10, by - 8, 20, 16);
    ctx.strokeStyle = '#121820';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(bx - 10, by - 8, 20, 16);

    // Arms (back view — sides)
    ctx.fillStyle = '#232b38';
    ctx.fillRect(bx - 14, by - 7 + armSwg, 5, 14);   // left arm
    ctx.fillRect(bx + 9,  by - 7 - armSwg, 5, 14);   // right arm

    // Collar / back of neck
    ctx.fillStyle = '#2e3848';
    ctx.fillRect(bx - 4, by - 9, 8, 4);

    // Head (back)
    ctx.fillStyle = '#b08050';
    ctx.beginPath(); ctx.arc(bx, by - 17, 8, 0, Math.PI * 2); ctx.fill();
    // Hair (back)
    ctx.fillStyle = '#3a2810';
    ctx.beginPath();
    ctx.arc(bx, by - 17, 8, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(bx - 8, by - 22, 16, 6);

    // Hat crown (back)
    ctx.fillStyle = '#1c1c28';
    ctx.fillRect(bx - 9, by - 30, 18, 10);
    // Hat brim (back)
    ctx.fillStyle = '#14141c';
    ctx.fillRect(bx - 11, by - 22, 22, 4);
    // Hat band
    ctx.fillStyle = '#b89030';
    ctx.fillRect(bx - 9, by - 23, 18, 2);

  } else if (dir === 'down') {
    // ── FRONT VIEW ──

    // Legs
    ctx.fillStyle = '#14141e';
    ctx.fillRect(bx - 8, by + 2,  6, 12 + lLeg);
    ctx.fillRect(bx + 2, by + 2,  6, 12 - rLeg);
    // Shoes
    ctx.fillStyle = '#0c0c14';
    ctx.fillRect(bx - 9, by + 12 + lLeg, 8, 4);
    ctx.fillRect(bx + 1, by + 12 - rLeg, 8, 4);

    // Arms
    ctx.fillStyle = '#232b38';
    ctx.fillRect(bx - 14, by - 7 - armSwg, 5, 13);
    ctx.fillRect(bx + 9,  by - 7 + armSwg, 5, 13);
    // Hands
    ctx.fillStyle = '#c09060';
    ctx.beginPath(); ctx.arc(bx - 12, by + 6 - armSwg, 3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(bx + 12, by + 6 + armSwg, 3, 0, Math.PI*2); ctx.fill();

    // Coat body (front)
    ctx.fillStyle = '#1e2632';
    ctx.fillRect(bx - 10, by - 8, 20, 16);
    ctx.strokeStyle = '#121820';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(bx - 10, by - 8, 20, 16);

    // Lapels
    ctx.fillStyle = '#2a3244';
    ctx.beginPath();
    ctx.moveTo(bx - 5, by - 8);
    ctx.lineTo(bx,     by - 1);
    ctx.lineTo(bx + 5, by - 8);
    ctx.closePath();
    ctx.fill();

    // Belt
    ctx.fillStyle = '#b89030';
    ctx.fillRect(bx - 10, by + 5, 20, 3);
    // Belt buckle
    ctx.fillStyle = '#d4a840';
    ctx.fillRect(bx - 3, by + 4, 6, 5);

    // Head
    ctx.fillStyle = '#c09060';
    ctx.beginPath(); ctx.arc(bx, by - 17, 8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#8a6040';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(bx, by - 17, 8, 0, Math.PI * 2); ctx.stroke();

    // Hair (front — top tuft)
    ctx.fillStyle = '#3a2810';
    ctx.fillRect(bx - 7, by - 25, 14, 7);

    // Eyes
    ctx.fillStyle = '#2a1808';
    ctx.fillRect(bx - 5, by - 19, 3, 3);
    ctx.fillRect(bx + 2, by - 19, 3, 3);
    // Eye whites
    ctx.fillStyle = '#e0c8a0';
    ctx.fillRect(bx - 4, by - 18, 2, 2);
    ctx.fillRect(bx + 3, by - 18, 2, 2);

    // Nose
    ctx.fillStyle = '#a07040';
    ctx.fillRect(bx - 1, by - 15, 2, 3);

    // Mouth (thin line)
    ctx.strokeStyle = '#6a4028';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bx - 3, by - 11);
    ctx.lineTo(bx + 3, by - 11);
    ctx.stroke();

    // Hat crown
    ctx.fillStyle = '#1c1c28';
    ctx.fillRect(bx - 9, by - 30, 18, 10);
    // Hat brim
    ctx.fillStyle = '#14141c';
    ctx.fillRect(bx - 11, by - 22, 22, 4);
    // Hat band
    ctx.fillStyle = '#b89030';
    ctx.fillRect(bx - 9, by - 23, 18, 2);

  } else {
    // ── SIDE VIEW (left or right) ──
    const flip = (dir === 'left') ? -1 : 1;

    // Back leg
    ctx.fillStyle = '#0e0e18';
    ctx.fillRect(bx - 3*flip, by + 2, 6, 12 - rLeg * flip);
    ctx.fillStyle = '#0a0a10';
    ctx.fillRect(bx - 3*flip, by + 12 - rLeg * flip, 8 * flip, 4);

    // Coat body
    ctx.fillStyle = '#1e2632';
    ctx.fillRect(bx - 10, by - 8, 20, 16);
    ctx.strokeStyle = '#121820';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(bx - 10, by - 8, 20, 16);

    // Front lapel edge
    ctx.fillStyle = '#2a3244';
    ctx.fillRect(bx + 8*flip, by - 8, 3*flip, 14);

    // Belt
    ctx.fillStyle = '#b89030';
    ctx.fillRect(bx - 10, by + 5, 20, 3);

    // Front arm (direction of movement side)
    ctx.fillStyle = '#232b38';
    ctx.fillRect(bx + 6*flip, by - 6 + armSwg, 5 * flip, 12);
    // Front hand
    ctx.fillStyle = '#c09060';
    ctx.beginPath(); ctx.arc(bx + 9*flip, by + 6 + armSwg, 3, 0, Math.PI*2); ctx.fill();

    // Front leg
    ctx.fillStyle = '#14141e';
    ctx.fillRect(bx + 2*flip, by + 2, 6, 12 + lLeg);
    ctx.fillStyle = '#0c0c14';
    ctx.fillRect(bx + flip, by + 12 + lLeg, 9 * flip, 4);

    // Head (side)
    ctx.fillStyle = '#c09060';
    ctx.beginPath(); ctx.arc(bx + 2*flip, by - 17, 8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#8a6040';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(bx + 2*flip, by - 17, 8, 0, Math.PI * 2); ctx.stroke();

    // Hair (side profile)
    ctx.fillStyle = '#3a2810';
    ctx.fillRect(bx - 6, by - 25, 16, 7);

    // Eye (single, direction-facing side)
    ctx.fillStyle = '#2a1808';
    ctx.fillRect(bx + 5*flip, by - 19, 3, 3);
    ctx.fillStyle = '#e0c8a0';
    ctx.fillRect(bx + 6*flip, by - 18, 2, 2);

    // Nose tip
    ctx.fillStyle = '#a07040';
    ctx.fillRect(bx + 8*flip, by - 14, 3, 2);

    // Hat crown
    ctx.fillStyle = '#1c1c28';
    ctx.fillRect(bx - 7, by - 30, 18, 10);
    // Hat brim (slightly longer toward facing direction)
    ctx.fillStyle = '#14141c';
    ctx.fillRect(bx - 8, by - 22, 20, 4);
    ctx.fillRect(bx + 10*flip, by - 22, 4*flip, 4);
    // Hat band
    ctx.fillStyle = '#b89030';
    ctx.fillRect(bx - 7, by - 23, 18, 2);
  }
}

/* ---- Lighting ---- */
function drawLighting() {
  const vw = canvas.width, vh = canvas.height;
  // Player screen position (centre of character)
  const px = player.x + player.w / 2 - cam.x;
  const py = player.y + player.h / 2 - cam.y;

  // 1. Dark ambient fog over the whole viewport
  ctx.fillStyle = 'rgba(4,6,10,0.52)';
  ctx.fillRect(0, 0, vw, vh);

  // 2. Player torch — warm radial gradient around the player
  const torchR = 220;
  const torch = ctx.createRadialGradient(px, py, 0, px, py, torchR);
  torch.addColorStop(0,    'rgba(255,220,150,0.18)');
  torch.addColorStop(0.35, 'rgba(200,160,80,0.08)');
  torch.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = torch;
  ctx.fillRect(px - torchR, py - torchR, torchR * 2, torchR * 2);

  // 3. Equipment ambient glow spots (dim, fixed)
  const glowSpots = [
    // Security cameras — red
    { tx:13, ty:2,  r:60, color:[220,40,20]  },
    // Computer screens — blue
    { tx:2,  ty:3,  r:40, color:[30,100,200] },
    { tx:8,  ty:3,  r:40, color:[30,100,200] },
    { tx:28, ty:2,  r:40, color:[30,120,220] },
    { tx:31, ty:6,  r:50, color:[20,90,180]  },
    // Server LEDs — green
    { tx:22, ty:4,  r:55, color:[0,160,80]   },
    // Keypad — gold
    { tx:16, ty:6,  r:45, color:[200,150,50] }
  ];
  for (const g of glowSpots) {
    const gx = g.tx * TILE + TILE/2 - cam.x;
    const gy = g.ty * TILE + TILE/2 - cam.y;
    // Skip if off screen
    if (gx < -g.r || gx > vw + g.r || gy < -g.r || gy > vh + g.r) continue;
    const grd = ctx.createRadialGradient(gx, gy, 0, gx, gy, g.r);
    grd.addColorStop(0,   `rgba(${g.color[0]},${g.color[1]},${g.color[2]},0.15)`);
    grd.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(gx - g.r, gy - g.r, g.r * 2, g.r * 2);
  }

  // 4. Subtle vignette at viewport edges
  const vig = ctx.createRadialGradient(vw/2, vh/2, vh * 0.3, vw/2, vh/2, vh * 0.85);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, vw, vh);
}

/* ---- Full frame ---- */
function renderFrame() {
  if (!ctx) return;

  // Sync canvas resolution to element size
  const cw = canvas.offsetWidth  || window.innerWidth;
  const ch = canvas.offsetHeight || window.innerHeight;
  if (canvas.width !== cw || canvas.height !== ch) {
    canvas.width  = cw;
    canvas.height = ch;
  }

  // Clear
  ctx.fillStyle = C.outerBg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(-Math.round(cam.x), -Math.round(cam.y));

  drawFloors();
  drawWalls();
  drawDoors();
  drawFurniture();
  drawComputers();
  drawSecurityEquipment();
  drawLabEquipment();
  drawDoorLock();
  drawRoomLabels();
  drawEvidenceMarkers();
  drawNPCs();
  drawPlayer();

  ctx.restore();

  // Lighting is drawn in screen-space (after world translate is restored)
  drawLighting();
}

/* ============================================================
   GAME LOOP  (delta-time)
   ============================================================ */

function gameLoop(timestamp) {
  const dt = Math.min((timestamp - (gameState.lastTime || timestamp)) / 1000, 0.1);
  gameState.lastTime = timestamp;

  updatePlayer(dt);
  updateCamera(dt);
  renderFrame();
  updateHUD();
  updatePrompt();

  gameState.loopId = requestAnimationFrame(gameLoop);
}

function stopGameLoop() {
  if (gameState.loopId) { cancelAnimationFrame(gameState.loopId); gameState.loopId = null; }
  document.removeEventListener('keydown', onKeyDown);
  document.removeEventListener('keyup',   onKeyUp);
}

/* ============================================================
   HUD / PROMPT
   ============================================================ */

function updateHUD() {
  const prog = document.getElementById('hud-progress');
  const txt  = document.getElementById('hud-text');
  if (!prog || !txt) return;
  const n = gameState.collectedEvidence.length;
  const total = evidence.length;
  prog.textContent = n + ' / ' + total + ' clues discovered';
  if (n === total) {
    txt.textContent  = 'All clues found. Open Journal [J] to make your deduction.';
    prog.style.color = '#80c880';
  } else {
    txt.textContent  = 'Investigate the laboratory and collect evidence.';
    prog.style.color = '#c8a96e';
  }
}

function updatePrompt() {
  const el = document.getElementById('interact-prompt');
  if (!el) return;
  if (gameState.nearObject && !gameState.dialogueOpen && !gameState.journalOpen) {
    el.textContent = gameState.nearObject.label;
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}

/* ============================================================
   INTERACTION
   ============================================================ */

function triggerInteraction(obj) {
  if (obj.type === 'evidence') {
    const ev = evidence.find(e => e.id === obj.evidenceId);
    if (!ev) return;
    if (!gameState.collectedEvidence.includes(ev.id))
      gameState.collectedEvidence.push(ev.id);
    gameState.interactedObjects.add(obj.id);
    showDialogue('EVIDENCE FOUND', 'Physical Clue', ev.description);
  } else if (obj.type === 'npc') {
    const s = suspects.find(s => s.id === obj.suspectId);
    if (s) showDialogue(s.name, s.role, s.statement);
  }
}

/* ============================================================
   DIALOGUE
   ============================================================ */

function showDialogue(speaker, role, text) {
  document.getElementById('dialogue-speaker').textContent = speaker;
  document.getElementById('dialogue-role').textContent    = role;
  document.getElementById('dialogue-text').textContent    = text;
  document.getElementById('dialogue-panel').classList.remove('hidden');
  gameState.dialogueOpen = true;
}

function closeDialogue() {
  document.getElementById('dialogue-panel').classList.add('hidden');
  gameState.dialogueOpen = false;
}

/* ============================================================
   JOURNAL
   ============================================================ */

function openJournal() {
  updateJournalContent();
  document.getElementById('journal-panel').classList.remove('hidden');
  gameState.journalOpen = true;
}

function closeJournal() {
  document.getElementById('journal-panel').classList.add('hidden');
  gameState.journalOpen = false;
}

function closeJournalAndDeduce()    { closeJournal(); navigateTo('deduction'); }
function closeJournalToDashboard()  { closeJournal(); navigateTo('dashboard'); }

function switchJournalTab(tabId, btn) {
  document.querySelectorAll('.journal-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.journal-tab').forEach(el => el.classList.remove('active'));
  document.getElementById('journal-' + tabId).classList.add('active');
  btn.classList.add('active');
}

function updateJournalContent() {
  const evEl = document.getElementById('journal-evidence');
  evEl.innerHTML = gameState.collectedEvidence.length === 0
    ? '<p class="journal-empty">No evidence collected yet. Explore the lab.</p>'
    : gameState.collectedEvidence.map(id => {
        const ev = evidence.find(e => e.id === id);
        return ev
          ? `<div class="journal-evidence-item">
               <div class="journal-evidence-title">${ev.title}</div>
               <div class="journal-evidence-desc">${ev.description}</div>
             </div>`
          : '';
      }).join('');

  document.getElementById('journal-suspects-tab').innerHTML =
    suspects.map(s =>
      `<div class="journal-suspect-entry">
         <div class="journal-suspect-name">${s.name}</div>
         <div class="journal-suspect-role">${s.role}</div>
       </div>`).join('');

  document.getElementById('journal-timeline-tab').innerHTML =
    timeline.map(t =>
      `<div class="journal-timeline-item">
         <div class="journal-time">${t.time}</div>
         <div class="journal-event">${t.event}</div>
       </div>`).join('');
}

/* ============================================================
   LAB INIT
   ============================================================ */

function initLab() {
  // Build collision map once (or rebuild if called again)
  buildCollisionMap();

  // Reset player to safe start position
  player.x   = 5 * TILE;
  player.y   = 7 * TILE;
  player.dir = 'down';
  player.moving = false;
  player.animStep = 0;
  player.animTimer = 0;

  // Reset camera to player position instantly (no lerp on first frame)
  canvas = document.getElementById('lab-canvas');
  ctx    = canvas.getContext('2d');
  canvas.width  = canvas.offsetWidth  || window.innerWidth;
  canvas.height = canvas.offsetHeight || window.innerHeight;
  cam.x = Math.max(0, Math.min(MAP_W - canvas.width,  player.x + player.w/2 - canvas.width/2));
  cam.y = Math.max(0, Math.min(MAP_H - canvas.height, player.y + player.h/2 - canvas.height/2));

  // Close any open overlays
  document.getElementById('dialogue-panel').classList.add('hidden');
  document.getElementById('journal-panel').classList.add('hidden');
  gameState.dialogueOpen = false;
  gameState.journalOpen  = false;
  gameState.lastTime     = 0;

  // Register input (remove first to prevent duplicate listeners)
  document.removeEventListener('keydown', onKeyDown);
  document.removeEventListener('keyup',   onKeyUp);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup',   onKeyUp);

  // Start loop
  if (gameState.loopId) cancelAnimationFrame(gameState.loopId);
  gameState.loopId = requestAnimationFrame(gameLoop);
}

/* ============================================================
   DOM INIT
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  renderSuspects();
  renderEvidence();
  renderTimeline();
  renderInterviews();
  populateDeductionForm();
  document.getElementById('deduction-form').addEventListener('submit', handleDeductionSubmit);
});






