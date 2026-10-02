/* =============================================
   THE MYSTERY - complete game script
   ============================================= */

/* =============================================
   GAME DATA
   ============================================= */

const suspects = [
  { id: 'alex',   name: 'Alex Morgan',   role: 'Lab Engineer',     description: 'Responsible for maintaining laboratory equipment and systems. Has been with the company for 3 years.', statement: 'I left the lab at 10:45 PM after running diagnostics. Everything was normal when I left. I was home by 11:15 PM.' },
  { id: 'maya',   name: 'Maya Carter',   role: 'Security Officer', description: 'Head of night security with full access to all areas. Known for being thorough and detail-oriented.',   statement: "I was monitoring the cameras from the security office all night. The system went offline briefly around 11:30 PM, but I didn't notice anything unusual." },
  { id: 'daniel', name: 'Daniel Reed',   role: 'Researcher',       description: 'Lead researcher on the prototype project. Has intimate knowledge of the device and its value.',          statement: 'I was working late in my office on the second floor. I sent some project emails around 11:40 PM but never went near the lab that night.' },
  { id: 'sarah',  name: 'Sarah Bennett', role: 'Project Manager',  description: 'Oversees all research projects and budget allocation. Under pressure to deliver results.',              statement: "I left the building at 9 PM. I have meeting notes and my car's parking lot timestamp to prove it. I wasn't even in the building." }
];

const evidence = [
  { id: 'camera',  title: 'Security Camera Malfunction', description: 'Security camera footage stopped recording at exactly 11:31 PM. The system logs show it was manually disabled from the security terminal using admin credentials.' },
  { id: 'keycard', title: 'Keycard Access Log',          description: "Maya Carter's security keycard was used to access the laboratory at 11:34 PM. However, Maya claims she was in the security office at that time." },
  { id: 'email',   title: 'Encrypted Email',             description: "An encrypted email with attachment related to the prototype specifications was sent from Daniel Reed's computer at 11:40 PM to an external address." },
  { id: 'lock',    title: 'Laboratory Lock Status',      description: 'The laboratory door was recorded as locked and secured at 11:47 PM when the missing prototype was discovered. No signs of forced entry.' }
];

const timeline = [
  { time: '11:31 PM', event: 'Security camera system manually disabled' },
  { time: '11:34 PM', event: "Laboratory accessed using Maya Carter's keycard" },
  { time: '11:40 PM', event: "Encrypted email sent from Daniel Reed's computer" },
  { time: '11:47 PM', event: 'Laboratory found locked, prototype missing' }
];

const interviews = [
  { name: 'Alex Morgan',   role: 'Lab Engineer',     statement: "I left at 10:45 PM after finishing my diagnostics routine. I always double-check everything before I go. The prototype was secure in its case when I left. I drove straight home." },
  { name: 'Maya Carter',   role: 'Security Officer', statement: "I was in the security office all evening. Yes, the cameras went down around 11:30, but that happens sometimes. As for my keycard showing lab access at 11:34 - that's impossible. Someone must have cloned it." },
  { name: 'Daniel Reed',   role: 'Researcher',       statement: "I was working late in my office. I sent a few project emails around 11:40, but they were routine updates. I never went to the lab that night. The email encryption is standard protocol." },
  { name: 'Sarah Bennett', role: 'Project Manager',  statement: "I wasn't even in the building. I left at 9 PM - I had dinner plans. Security logs will show my exit time. I don't have the technical knowledge to disable cameras anyway." }
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

/* =============================================
   HOME / INTRO
   ============================================= */

function startCase() { navigateTo('case-intro'); }

function showHowToPlay() {
  alert('HOW TO PLAY\n\n1. Explore Blackwood Research Lab with WASD or arrow keys.\n2. Press E near objects or suspects to interact.\n3. Press J to open your detective journal.\n4. Collect all 4 clues then make your Final Deduction.');
}

function beginInvestigation() { navigateTo('lab'); }

/* =============================================
   STATIC SCREENS
   ============================================= */

function renderSuspects() {
  document.getElementById('suspects-list').innerHTML = suspects.map(s => `
    <div class="suspect-card"><div class="suspect-header"><h3 class="suspect-name">${s.name}</h3><p class="suspect-role">${s.role}</p></div>
    <p class="suspect-description">${s.description}</p><blockquote class="suspect-statement">"${s.statement}"</blockquote></div>`).join('');
}

function renderEvidence() {
  document.getElementById('evidence-list').innerHTML = evidence.map((e, i) => `
    <div class="evidence-item"><div class="evidence-header"><span class="evidence-number">Evidence ${i+1}</span><h3 class="evidence-title">${e.title}</h3></div>
    <p class="evidence-description">${e.description}</p></div>`).join('');
}

function renderTimeline() {
  document.getElementById('timeline-list').innerHTML = timeline.map(t => `
    <div class="timeline-item"><div class="timeline-time">${t.time}</div><div class="timeline-event">${t.event}</div></div>`).join('');
}

function renderInterviews() {
  document.getElementById('interviews-list').innerHTML = interviews.map(i => `
    <div class="interview-item"><div class="interview-header"><h3 class="interview-name">${i.name}</h3><p class="interview-role">${i.role}</p></div>
    <p class="interview-statement">${i.statement}</p></div>`).join('');
}

function populateDeductionForm() {
  document.getElementById('suspect-select').innerHTML = '<option value="">Select a suspect...</option>' + suspects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  document.getElementById('evidence-select').innerHTML = '<option value="">Select key evidence...</option>' + evidence.map(e => `<option value="${e.id}">${e.title}</option>`).join('');
}

function handleDeductionSubmit(evt) {
  evt.preventDefault();
  const sid = document.getElementById('suspect-select').value;
  const theory = document.getElementById('theory-input').value;
  const eid = document.getElementById('evidence-select').value;
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
    <div class="result-actions"><button class="btn btn-primary" onclick="resetGame()">Play Again</button><button class="btn btn-secondary" onclick="navigateTo('dashboard')">Review Evidence</button></div>`
  : `
    <h2 class="result-verdict unsolved">CASE UNSOLVED</h2>
    <div class="result-explanation">
      <div><h3 class="result-section-title">Your Deduction</h3><p class="result-section-content">You suspected ${sName} based on ${eName}, but the evidence points elsewhere.</p></div>
      <div><h3 class="result-section-title">What Actually Happened</h3><p class="result-section-content">${solution.explanation}</p></div>
      <div><h3 class="result-section-title">The Critical Clue</h3><p class="result-section-content">Maya's keycard log and her own alibi directly contradict each other.</p></div>
    </div>
    <div class="result-actions"><button class="btn btn-primary" onclick="resetGame()">Try Again</button><button class="btn btn-secondary" onclick="navigateTo('dashboard')">Review Evidence</button></div>`;
  navigateTo('result');
}

function resetGame() {
  gameState.collectedEvidence = [];
  gameState.interactedObjects = new Set();
  document.getElementById('deduction-form').reset();
  navigateTo('home');
}

/* =============================================
   2D LAB - CONSTANTS
   ============================================= */

const TILE = 40;
const COLS = 40;
const ROWS = 28;
const MAP_W = COLS * TILE;
const MAP_H = ROWS * TILE;

const COLORS = {
  floorA: '#10121a', floorB: '#0d0f16',
  wall: '#1c1f28', wallTop: '#262a36',
  desk: '#1a1714', deskTop: '#252018',
  computer: '#08101e', screen: '#0d2a44',
  cabinet: '#181818',
  camBody: '#1c1c22', camLight: '#cc2020',
  keypad: '#0c1520', keypadLight: '#c8a96e',
  door: '#1e1608', doorFrame: '#c8a96e',
  labEq: '#121820', labLight: '#3a7a9a',
  npc: ['#7a5f38','#4a6a7a','#5a7a4a','#7a4a5a']
};

/* =============================================
   2D LAB - MAP
   ============================================= */

// Wall collision rects [col, row, w, h]
const WALLS = [
  // Border
  [0,0,COLS,1],[0,ROWS-1,COLS,1],[0,0,1,ROWS],[COLS-1,0,1,ROWS],
  // Main lab
  [2,2,14,1],[2,13,14,1],[2,2,1,12],[15,2,1,12],
  // Security room
  [18,2,10,1],[18,9,10,1],[18,2,1,8],[27,2,1,8],
  // Research room
  [30,2,8,1],[30,13,8,1],[30,2,1,12],[37,2,1,12],
  // Storage
  [2,16,8,1],[2,25,8,1],[2,16,1,10],[9,16,1,10],
  // Corridor
  [10,16,20,1],[10,19,20,1],
  // Office
  [30,16,8,1],[30,25,8,1],[30,16,1,10],[37,16,1,10]
];

// Furniture collision rects [col, row, w, h]
const FURNITURE = [
  [3,3,4,2],[3,7,4,2],[10,3,4,2],[10,7,4,2],  // main lab desks
  [19,3,7,2],[19,6,3,2],                         // security desk+cabinet
  [31,3,5,2],[31,7,5,2],                         // research desks
  [3,17,6,2],[3,21,6,2],                         // storage cabinets
  [31,17,5,2],[31,21,5,2]                        // office desk
];

// Interactable objects
const INTERACTABLES = [
  { id:'obj_cam',     type:'evidence', evidenceId:'camera',  tx:14, ty:3,  label:'E - Examine Camera',       radius:72 },
  { id:'obj_kc',      type:'evidence', evidenceId:'keycard', tx:19, ty:8,  label:'E - Check Keycard Log',    radius:72 },
  { id:'obj_pc',      type:'evidence', evidenceId:'email',   tx:32, ty:8,  label:'E - Check Computer',       radius:72 },
  { id:'obj_door',    type:'evidence', evidenceId:'lock',    tx:8,  ty:13, label:'E - Inspect Door Lock',    radius:72 },
  { id:'npc_alex',    type:'npc',      suspectId:'alex',    tx:6,  ty:5,  label:'E - Talk to Alex',         radius:72, color:COLORS.npc[0] },
  { id:'npc_maya',    type:'npc',      suspectId:'maya',    tx:22, ty:5,  label:'E - Talk to Maya',         radius:72, color:COLORS.npc[1] },
  { id:'npc_daniel',  type:'npc',      suspectId:'daniel',  tx:34, ty:5,  label:'E - Talk to Daniel',       radius:72, color:COLORS.npc[2] },
  { id:'npc_sarah',   type:'npc',      suspectId:'sarah',   tx:14, ty:18, label:'E - Talk to Sarah',        radius:72, color:COLORS.npc[3] }
];

/* =============================================
   2D LAB - GAME STATE
   ============================================= */

const gameState = {
  collectedEvidence: [],
  interactedObjects: new Set(),
  dialogueOpen: false,
  journalOpen: false,
  nearObject: null,
  loopId: null
};

const player = { x: 8*TILE, y:10*TILE, w:18, h:18, speed:3, dir:'down', moving:false, animFrame:0, animTimer:0 };
const keys = {};
let canvas, ctx;

/* =============================================
   2D LAB - INPUT
   ============================================= */

function onKeyDown(e) {
  keys[e.code] = true;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
  if (e.code === 'KeyE') {
    if (gameState.dialogueOpen) { closeDialogue(); return; }
    if (gameState.nearObject) triggerInteraction(gameState.nearObject);
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

/* =============================================
   2D LAB - COLLISION
   ============================================= */

function overlaps(ax,ay,aw,ah, bx,by,bw,bh) {
  return ax < bx+bw && ax+aw > bx && ay < by+bh && ay+ah > by;
}

function wouldCollide(nx, ny) {
  const pw = player.w, ph = player.h;
  for (const [c,r,w,h] of WALLS)
    if (overlaps(nx,ny,pw,ph, c*TILE,r*TILE,w*TILE,h*TILE)) return true;
  for (const [c,r,w,h] of FURNITURE)
    if (overlaps(nx,ny,pw,ph, c*TILE,r*TILE,w*TILE,h*TILE)) return true;
  if (nx < 0 || ny < 0 || nx+pw > MAP_W || ny+ph > MAP_H) return true;
  return false;
}

/* =============================================
   2D LAB - UPDATE
   ============================================= */

function updatePlayer() {
  if (gameState.dialogueOpen || gameState.journalOpen) return;
  let dx = 0, dy = 0;
  if (keys['KeyW'] || keys['ArrowUp'])    dy = -player.speed;
  if (keys['KeyS'] || keys['ArrowDown'])  dy =  player.speed;
  if (keys['KeyA'] || keys['ArrowLeft'])  dx = -player.speed;
  if (keys['KeyD'] || keys['ArrowRight']) dx =  player.speed;
  if (dx && dy) { dx *= 0.707; dy *= 0.707; }
  player.moving = (dx !== 0 || dy !== 0);
  if (dx) { player.dir = dx > 0 ? 'right' : 'left'; if (!wouldCollide(player.x+dx, player.y)) player.x += dx; }
  if (dy) { player.dir = dy > 0 ? 'down'  : 'up';   if (!wouldCollide(player.x, player.y+dy)) player.y += dy; }
  if (player.moving) { player.animTimer++; if (player.animTimer >= 10) { player.animTimer=0; player.animFrame=(player.animFrame+1)%4; } }
  else player.animFrame = 0;

  // Proximity check
  const pcx = player.x + player.w/2, pcy = player.y + player.h/2;
  let nearest = null, nearDist = Infinity;
  for (const obj of INTERACTABLES) {
    const ox = obj.tx*TILE+TILE/2, oy = obj.ty*TILE+TILE/2;
    const d = Math.hypot(pcx-ox, pcy-oy);
    if (d < obj.radius && d < nearDist) { nearDist = d; nearest = obj; }
  }
  gameState.nearObject = nearest;
}

/* =============================================
   2D LAB - RENDER
   ============================================= */

function getCamera() {
  const vw = canvas.width, vh = canvas.height;
  const cx = Math.max(0, Math.min(MAP_W-vw, player.x+player.w/2 - vw/2));
  const cy = Math.max(0, Math.min(MAP_H-vh, player.y+player.h/2 - vh/2));
  return { cx, cy };
}

function drawMap(cx, cy) {
  // Floor base
  ctx.fillStyle = COLORS.floorA;
  ctx.fillRect(0, 0, MAP_W, MAP_H);

  // Room floors
  const rooms = [
    { x:2,y:2,w:14,h:12, c:'#0f1218' }, { x:18,y:2,w:10,h:8,c:'#0c0f1a' },
    { x:30,y:2,w:8,h:12, c:'#0f1218' }, { x:2,y:16,w:8,h:10,c:'#0b0d10' },
    { x:10,y:16,w:20,h:4,c:'#0d1015' },{ x:30,y:16,w:8,h:10,c:'#0f1218' }
  ];
  for (const r of rooms) { ctx.fillStyle = r.c; ctx.fillRect(r.x*TILE,r.y*TILE,r.w*TILE,r.h*TILE); }

  // Floor grid
  ctx.strokeStyle = 'rgba(255,255,255,0.025)';
  ctx.lineWidth = 0.5;
  for (let c=0;c<COLS;c++) for (let r=0;r<ROWS;r++) ctx.strokeRect(c*TILE,r*TILE,TILE,TILE);

  // Walls
  for (const [c,r,w,h] of WALLS) {
    ctx.fillStyle = COLORS.wall; ctx.fillRect(c*TILE,r*TILE,w*TILE,h*TILE);
    ctx.fillStyle = COLORS.wallTop; ctx.fillRect(c*TILE,r*TILE,w*TILE,4);
  }

  // Furniture
  for (const [c,r,w,h] of FURNITURE) {
    const px=c*TILE,py=r*TILE,pw=w*TILE,ph=h*TILE;
    ctx.fillStyle=COLORS.desk; ctx.fillRect(px,py,pw,ph);
    ctx.fillStyle=COLORS.deskTop; ctx.fillRect(px+2,py+2,pw-4,5);
  }

  // Computers
  const pcPositions = [[3,3],[7,3],[10,3],[10,7],[19,3],[23,3],[31,3],[31,7],[31,17]];
  for (const [c,r] of pcPositions) {
    const px=c*TILE+4,py=r*TILE+4;
    ctx.fillStyle=COLORS.computer; ctx.fillRect(px,py,20,14);
    ctx.fillStyle=COLORS.screen; ctx.fillRect(px+2,py+2,16,9);
    ctx.fillStyle='rgba(80,160,255,0.25)'; ctx.fillRect(px+2,py+2,16,2);
  }

  // Security camera
  const cam = INTERACTABLES.find(o=>o.id==='obj_cam');
  if (cam) {
    const cx2=cam.tx*TILE+TILE/2, cy2=cam.ty*TILE+TILE/2;
    ctx.fillStyle=COLORS.camBody; ctx.fillRect(cx2-12,cy2-6,24,12);
    ctx.fillStyle=COLORS.camLight; ctx.beginPath(); ctx.arc(cx2+10,cy2,4,0,Math.PI*2); ctx.fill();
  }

  // Keypad
  const kc = INTERACTABLES.find(o=>o.id==='obj_kc');
  if (kc) {
    ctx.fillStyle=COLORS.keypad; ctx.fillRect(kc.tx*TILE+4,kc.ty*TILE+4,20,28);
    ctx.fillStyle=COLORS.keypadLight; ctx.fillRect(kc.tx*TILE+8,kc.ty*TILE+8,12,6);
  }

  // Door marker
  const door = INTERACTABLES.find(o=>o.id==='obj_door');
  if (door) {
    const dx=door.tx*TILE;
    ctx.fillStyle=COLORS.door; ctx.fillRect(dx,door.ty*TILE-4,TILE,8);
    ctx.fillStyle=COLORS.doorFrame; ctx.fillRect(dx,door.ty*TILE-4,TILE,2); ctx.fillRect(dx,door.ty*TILE+2,TILE,2);
  }

  // Lab equipment
  for (const [c,r] of [[31,10],[35,10]]) {
    ctx.fillStyle=COLORS.labEq; ctx.fillRect(c*TILE+2,r*TILE+6,28,22);
    ctx.fillStyle=COLORS.labLight; ctx.fillRect(c*TILE+6,r*TILE+10,8,4);
  }

  // Room labels
  ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.font='bold 10px Arial,sans-serif';
  ctx.fillStyle='rgba(200,169,110,0.35)';
  const labels=[
    ['MAIN LABORATORY',(2+7)*TILE,(2+0.7)*TILE], ['SECURITY ROOM',(18+5)*TILE,(2+0.7)*TILE],
    ['RESEARCH ROOM',(30+4)*TILE,(2+0.7)*TILE],  ['STORAGE',(2+4)*TILE,(16+0.7)*TILE],
    ['CORRIDOR',(10+10)*TILE,(16+2)*TILE],        ['OFFICE',(30+4)*TILE,(16+0.7)*TILE]
  ];
  for (const [name,lx,ly] of labels) ctx.fillText(name,lx,ly);
  ctx.textAlign='left'; ctx.textBaseline='alphabetic';
}

function drawNPCs() {
  for (const obj of INTERACTABLES.filter(o=>o.type==='npc')) {
    const ox=obj.tx*TILE+TILE/2, oy=obj.ty*TILE+TILE/2;
    // Body
    ctx.fillStyle=obj.color; ctx.fillRect(ox-9,oy-8,18,20);
    // Head
    ctx.fillStyle=shiftColor(obj.color,25); ctx.beginPath(); ctx.arc(ox,oy-14,9,0,Math.PI*2); ctx.fill();
    // Name
    ctx.font='600 9px Arial'; ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.fillStyle='rgba(232,228,220,0.75)';
    ctx.fillText(obj.suspectId ? suspects.find(s=>s.id===obj.suspectId)?.name || '' : '', ox, oy+14);
    ctx.textAlign='left'; ctx.textBaseline='alphabetic';
    // Highlight ring
    if (gameState.nearObject?.id===obj.id) {
      ctx.strokeStyle='rgba(200,169,110,0.7)'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(ox,oy-4,17,0,Math.PI*2); ctx.stroke();
    }
  }
}

function drawEvidenceHighlights() {
  for (const obj of INTERACTABLES.filter(o=>o.type==='evidence')) {
    const ox=obj.tx*TILE+TILE/2, oy=obj.ty*TILE+TILE/2;
    const collected=gameState.collectedEvidence.includes(obj.evidenceId);
    if (gameState.nearObject?.id===obj.id) {
      ctx.strokeStyle=collected?'rgba(80,180,80,0.6)':'rgba(200,169,110,0.8)';
      ctx.lineWidth=2; ctx.beginPath(); ctx.arc(ox,oy,19,0,Math.PI*2); ctx.stroke();
    }
    if (collected) {
      ctx.fillStyle='rgba(60,140,60,0.2)'; ctx.beginPath(); ctx.arc(ox,oy,12,0,Math.PI*2); ctx.fill();
    } else {
      ctx.fillStyle='rgba(200,169,110,0.15)'; ctx.beginPath(); ctx.arc(ox,oy,8,0,Math.PI*2); ctx.fill();
    }
  }
}

function drawPlayer() {
  const px=player.x, py=player.y, pw=player.w, ph=player.h;
  // Shadow
  ctx.fillStyle='rgba(0,0,0,0.35)';
  ctx.beginPath(); ctx.ellipse(px+pw/2,py+ph+2,pw/2,3,0,0,Math.PI*2); ctx.fill();
  // Body coat
  ctx.fillStyle='#28303e'; ctx.fillRect(px+2,py+7,pw-4,ph-7);
  ctx.fillStyle='#343c4a'; ctx.fillRect(px+pw/2-3,py+7,6,5);
  // Head
  ctx.fillStyle='#c0906a'; ctx.beginPath(); ctx.arc(px+pw/2,py+5,6,0,Math.PI*2); ctx.fill();
  // Hat brim + crown
  ctx.fillStyle='#181820'; ctx.fillRect(px+1,py-1,pw-2,4); ctx.fillRect(px+4,py-6,pw-8,6);
  // Legs
  const lo = player.moving ? Math.sin(player.animFrame*Math.PI/2)*3 : 0;
  ctx.fillStyle='#181820';
  ctx.fillRect(px+3,py+ph-5,5,5+lo); ctx.fillRect(px+pw-8,py+ph-5,5,5-lo);
}

function shiftColor(hex, amt) {
  const n=parseInt(hex.replace('#',''),16);
  const r=Math.min(255,(n>>16)+amt), g=Math.min(255,((n>>8)&0xff)+amt), b=Math.min(255,(n&0xff)+amt);
  return `rgb(${r},${g},${b})`;
}

function renderFrame() {
  if (!ctx) return;
  // Resize canvas to match element
  if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
    canvas.width = canvas.offsetWidth || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
  }
  const { cx, cy } = getCamera();
  ctx.save();
  ctx.translate(-cx, -cy);
  drawMap(cx, cy);
  drawEvidenceHighlights();
  drawNPCs();
  drawPlayer();
  ctx.restore();
}

/* =============================================
   2D LAB - GAME LOOP
   ============================================= */

function gameLoop() {
  updatePlayer();
  renderFrame();
  updateHUD();
  updatePrompt();
  gameState.loopId = requestAnimationFrame(gameLoop);
}

function stopGameLoop() {
  if (gameState.loopId) { cancelAnimationFrame(gameState.loopId); gameState.loopId=null; }
  document.removeEventListener('keydown', onKeyDown);
  document.removeEventListener('keyup',   onKeyUp);
}

/* =============================================
   2D LAB - HUD / PROMPT
   ============================================= */

function updateHUD() {
  const prog = document.getElementById('hud-progress');
  const txt  = document.getElementById('hud-text');
  if (!prog) return;
  const n = gameState.collectedEvidence.length, total = evidence.length;
  prog.textContent = n + ' / ' + total + ' clues discovered';
  if (n === total) {
    txt.textContent = 'All clues found. Open Journal (J) to deduce.';
    prog.style.color = '#80c880';
  } else {
    txt.textContent = 'Investigate the laboratory and find clues.';
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

/* =============================================
   2D LAB - INTERACTION
   ============================================= */

function triggerInteraction(obj) {
  if (obj.type === 'evidence') {
    const ev = evidence.find(e=>e.id===obj.evidenceId);
    if (!ev) return;
    if (!gameState.collectedEvidence.includes(ev.id)) gameState.collectedEvidence.push(ev.id);
    gameState.interactedObjects.add(obj.id);
    showDialogue('EVIDENCE FOUND', 'Physical Clue', ev.description);
  } else if (obj.type === 'npc') {
    const s = suspects.find(s=>s.id===obj.suspectId);
    if (s) showDialogue(s.name, s.role, s.statement);
  }
}

/* =============================================
   2D LAB - DIALOGUE
   ============================================= */

function showDialogue(speaker, role, text) {
  document.getElementById('dialogue-speaker').textContent = speaker;
  document.getElementById('dialogue-role').textContent = role;
  document.getElementById('dialogue-text').textContent = text;
  document.getElementById('dialogue-panel').classList.remove('hidden');
  gameState.dialogueOpen = true;
}

function closeDialogue() {
  document.getElementById('dialogue-panel').classList.add('hidden');
  gameState.dialogueOpen = false;
}

/* =============================================
   2D LAB - JOURNAL
   ============================================= */

function openJournal() {
  updateJournalContent();
  document.getElementById('journal-panel').classList.remove('hidden');
  gameState.journalOpen = true;
}

function closeJournal() {
  document.getElementById('journal-panel').classList.add('hidden');
  gameState.journalOpen = false;
}

function closeJournalAndDeduce() { closeJournal(); navigateTo('deduction'); }
function closeJournalToDashboard() { closeJournal(); navigateTo('dashboard'); }

function switchJournalTab(tabId, btn) {
  document.querySelectorAll('.journal-content').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.journal-tab').forEach(el=>el.classList.remove('active'));
  document.getElementById('journal-'+tabId).classList.add('active');
  btn.classList.add('active');
}

function updateJournalContent() {
  // Evidence
  const evEl = document.getElementById('journal-evidence');
  evEl.innerHTML = gameState.collectedEvidence.length === 0
    ? '<p class="journal-empty">No evidence collected yet. Explore the lab.</p>'
    : gameState.collectedEvidence.map(id => {
        const ev = evidence.find(e=>e.id===id);
        return ev ? `<div class="journal-evidence-item"><div class="journal-evidence-title">${ev.title}</div><div class="journal-evidence-desc">${ev.description}</div></div>` : '';
      }).join('');
  // Suspects
  document.getElementById('journal-suspects-tab').innerHTML = suspects.map(s =>
    `<div class="journal-suspect-entry"><div class="journal-suspect-name">${s.name}</div><div class="journal-suspect-role">${s.role}</div></div>`).join('');
  // Timeline
  document.getElementById('journal-timeline-tab').innerHTML = timeline.map(t =>
    `<div class="journal-timeline-item"><div class="journal-time">${t.time}</div><div class="journal-event">${t.event}</div></div>`).join('');
}

/* =============================================
   2D LAB - INIT
   ============================================= */

function initLab() {
  player.x = 8*TILE; player.y = 10*TILE; player.dir = 'down';
  document.getElementById('dialogue-panel').classList.add('hidden');
  document.getElementById('journal-panel').classList.add('hidden');
  gameState.dialogueOpen = false; gameState.journalOpen = false;

  canvas = document.getElementById('lab-canvas');
  ctx = canvas.getContext('2d');
  canvas.width  = canvas.offsetWidth  || window.innerWidth;
  canvas.height = canvas.offsetHeight || window.innerHeight;

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup',   onKeyUp);

  if (gameState.loopId) cancelAnimationFrame(gameState.loopId);
  gameLoop();
}

/* =============================================
   INITIALIZATION
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {
  renderSuspects();
  renderEvidence();
  renderTimeline();
  renderInterviews();
  populateDeductionForm();
  document.getElementById('deduction-form').addEventListener('submit', handleDeductionSubmit);
});
