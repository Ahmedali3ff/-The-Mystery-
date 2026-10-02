/* =============================================
   THE MYSTERY — game logic
   ============================================= */

/* --- GAME DATA --- */

const suspects = [
  {
    id: 'alex',
    name: 'Alex Morgan',
    role: 'Lab Engineer',
    description: 'Responsible for maintaining laboratory equipment and systems. Has been with the company for 3 years.',
    statement: 'I left the lab at 10:45 PM after running diagnostics. Everything was normal when I left. I was home by 11:15 PM.'
  },
  {
    id: 'maya',
    name: 'Maya Carter',
    role: 'Security Officer',
    statement: 'I was monitoring the cameras from the security office all night. The system went offline briefly around 11:30 PM, but I didn\'t notice anything unusual.',
    description: 'Head of night security with full access to all areas. Known for being thorough and detail-oriented.'
  },
  {
    id: 'daniel',
    name: 'Daniel Reed',
    role: 'Researcher',
    description: 'Lead researcher on the prototype project. Has intimate knowledge of the device and its value.',
    statement: 'I was working late in my office on the second floor. I sent some project emails around 11:40 PM but never went near the lab that night.'
  },
  {
    id: 'sarah',
    name: 'Sarah Bennett',
    role: 'Project Manager',
    description: 'Oversees all research projects and budget allocation. Under pressure to deliver results.',
    statement: 'I left the building at 9 PM. I have meeting notes and my car\'s parking lot timestamp to prove it. I wasn\'t even in the building.'
  }
];

const evidence = [
  {
    id: 'camera',
    title: 'Security Camera Malfunction',
    description: 'Security camera footage stopped recording at exactly 11:31 PM. The system logs show it was manually disabled from the security terminal using admin credentials.'
  },
  {
    id: 'keycard',
    title: 'Keycard Access Log',
    description: 'Maya Carter\'s security keycard was used to access the laboratory at 11:34 PM. However, Maya claims she was in the security office at that time.'
  },
  {
    id: 'email',
    title: 'Encrypted Email',
    description: 'An encrypted email with attachment related to the prototype specifications was sent from Daniel Reed\'s computer at 11:40 PM to an external address.'
  },
  {
    id: 'lock',
    title: 'Laboratory Lock Status',
    description: 'The laboratory door was recorded as locked and secured at 11:47 PM when the missing prototype was discovered. No signs of forced entry.'
  }
];

const timeline = [
  { time: '11:31 PM', event: 'Security camera system manually disabled' },
  { time: '11:34 PM', event: 'Laboratory accessed using Maya Carter\'s keycard' },
  { time: '11:40 PM', event: 'Encrypted email sent from Daniel Reed\'s computer' },
  { time: '11:47 PM', event: 'Laboratory found locked, prototype missing' }
];

const interviews = [
  {
    name: 'Alex Morgan',
    role: 'Lab Engineer',
    statement: 'I left at 10:45 PM after finishing my diagnostics routine. I always double-check everything before I go. The prototype was secure in its case when I left. I drove straight home—you can check my building\'s parking garage timestamp if you need proof.'
  },
  {
    name: 'Maya Carter',
    role: 'Security Officer',
    statement: 'I was in the security office all evening. Yes, the cameras went down around 11:30, but that happens sometimes with power fluctuations. I reported it immediately. As for my keycard showing lab access at 11:34—that\'s impossible. I never left my post. Someone must have cloned it.'
  },
  {
    name: 'Daniel Reed',
    role: 'Researcher',
    statement: 'I was working late in my office, compiling research notes. I sent a few project emails around 11:40, but they were routine progress updates to my team. I never went to the lab that night. The email encryption is standard protocol for sensitive research data.'
  },
  {
    name: 'Sarah Bennett',
    role: 'Project Manager',
    statement: 'I wasn\'t even in the building. I left at 9 PM sharp—I had dinner plans. Security logs will show my exit time. I don\'t have the technical knowledge to disable cameras or access the lab systems anyway. This is completely absurd.'
  }
];

// Solution: Maya Carter used her own keycard after disabling the cameras,
// while Daniel Reed was her accomplice who sent the prototype data to buyers
const solution = {
  suspect: 'maya',
  culprit: 'Maya Carter',
  accomplice: 'Daniel Reed',
  keyEvidence: 'keycard',
  explanation: 'Maya Carter disabled the security cameras using her admin access at 11:31 PM, then used her own keycard to enter the lab at 11:34 PM and take the prototype. Daniel Reed, working as her accomplice, sent the encrypted prototype specifications to external buyers at 11:40 PM from his computer. Maya\'s claim that her keycard was cloned was a lie—she used it herself. The coordination between the camera shutdown and the data transfer reveals their partnership.'
};

/* --- NAVIGATION --- */

function navigateTo(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  window.scrollTo(0, 0);
}

/* --- HOME SCREEN --- */

function startCase() {
  navigateTo('case-intro');
}

function showHowToPlay() {
  alert(
    "HOW TO PLAY\n\n" +
    "1. Read the case introduction carefully.\n" +
    "2. Examine suspects, evidence, and the timeline.\n" +
    "3. Review interview transcripts for contradictions.\n" +
    "4. Make your final deduction—and find out if you're right."
  );
}

/* --- CASE INTRODUCTION --- */

function beginInvestigation() {
  navigateTo('dashboard');
}

/* --- SUSPECTS SCREEN --- */

function renderSuspects() {
  const container = document.getElementById('suspects-list');
  container.innerHTML = suspects.map(suspect => `
    <div class="suspect-card">
      <div class="suspect-header">
        <h3 class="suspect-name">${suspect.name}</h3>
        <p class="suspect-role">${suspect.role}</p>
      </div>
      <p class="suspect-description">${suspect.description}</p>
      <blockquote class="suspect-statement">"${suspect.statement}"</blockquote>
    </div>
  `).join('');
}

/* --- EVIDENCE SCREEN --- */

function renderEvidence() {
  const container = document.getElementById('evidence-list');
  container.innerHTML = evidence.map((item, index) => `
    <div class="evidence-item">
      <div class="evidence-header">
        <span class="evidence-number">Evidence ${index + 1}</span>
        <h3 class="evidence-title">${item.title}</h3>
      </div>
      <p class="evidence-description">${item.description}</p>
    </div>
  `).join('');
}

/* --- TIMELINE SCREEN --- */

function renderTimeline() {
  const container = document.getElementById('timeline-list');
  container.innerHTML = timeline.map(item => `
    <div class="timeline-item">
      <div class="timeline-time">${item.time}</div>
      <div class="timeline-event">${item.event}</div>
    </div>
  `).join('');
}

/* --- INTERVIEWS SCREEN --- */

function renderInterviews() {
  const container = document.getElementById('interviews-list');
  container.innerHTML = interviews.map(interview => `
    <div class="interview-item">
      <div class="interview-header">
        <h3 class="interview-name">${interview.name}</h3>
        <p class="interview-role">${interview.role}</p>
      </div>
      <p class="interview-statement">${interview.statement}</p>
    </div>
  `).join('');
}

/* --- DEDUCTION SCREEN --- */

function populateDeductionForm() {
  const suspectSelect = document.getElementById('suspect-select');
  const evidenceSelect = document.getElementById('evidence-select');

  suspectSelect.innerHTML = '<option value="">Select a suspect...</option>' +
    suspects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

  evidenceSelect.innerHTML = '<option value="">Select key evidence...</option>' +
    evidence.map(e => `<option value="${e.id}">${e.title}</option>`).join('');
}

function handleDeductionSubmit(event) {
  event.preventDefault();

  const suspectId = document.getElementById('suspect-select').value;
  const theory = document.getElementById('theory-input').value;
  const evidenceId = document.getElementById('evidence-select').value;

  if (!suspectId || !theory || !evidenceId) {
    alert('Please complete all fields before submitting your deduction.');
    return;
  }

  // Check if deduction matches solution
  const isSolved = (suspectId === solution.suspect) && (evidenceId === solution.keyEvidence);

  showResult(isSolved, suspectId, evidenceId);
}

/* --- RESULT SCREEN --- */

function showResult(isSolved, selectedSuspect, selectedEvidence) {
  const selectedSuspectName = suspects.find(s => s.id === selectedSuspect)?.name || 'Unknown';
  const selectedEvidenceName = evidence.find(e => e.id === selectedEvidence)?.title || 'Unknown';

  const resultDisplay = document.getElementById('result-display');

  if (isSolved) {
    resultDisplay.innerHTML = `
      <h2 class="result-verdict solved">CASE SOLVED</h2>
      <div class="result-explanation">
        <div>
          <h3 class="result-section-title">Your Deduction</h3>
          <p class="result-section-content">You correctly identified ${solution.culprit} as the primary culprit using the ${selectedEvidenceName}.</p>
        </div>
        <div>
          <h3 class="result-section-title">What Happened</h3>
          <p class="result-section-content">${solution.explanation}</p>
        </div>
        <div>
          <h3 class="result-section-title">Key Evidence</h3>
          <p class="result-section-content">The keycard access log proved that Maya used her own credentials to access the lab, contradicting her claim that she never left the security office.</p>
        </div>
      </div>
      <div class="result-actions">
        <button class="btn btn-primary" onclick="resetGame()">Play Again</button>
        <button class="btn btn-secondary" onclick="navigateTo('dashboard')">Review Evidence</button>
      </div>
    `;
  } else {
    resultDisplay.innerHTML = `
      <h2 class="result-verdict unsolved">CASE UNSOLVED</h2>
      <div class="result-explanation">
        <div>
          <h3 class="result-section-title">Your Deduction</h3>
          <p class="result-section-content">You suspected ${selectedSuspectName} based on ${selectedEvidenceName}, but the evidence points elsewhere.</p>
        </div>
        <div>
          <h3 class="result-section-title">What Actually Happened</h3>
          <p class="result-section-content">${solution.explanation}</p>
        </div>
        <div>
          <h3 class="result-section-title">The Critical Clue</h3>
          <p class="result-section-content">The keycard access log was the key. Maya's claim that someone cloned her card was false—she used her own credentials, and the timing matched perfectly with the camera shutdown she orchestrated.</p>
        </div>
      </div>
      <div class="result-actions">
        <button class="btn btn-primary" onclick="resetGame()">Try Again</button>
        <button class="btn btn-secondary" onclick="navigateTo('dashboard')">Review Evidence</button>
      </div>
    `;
  }

  navigateTo('result');
}

function resetGame() {
  document.getElementById('deduction-form').reset();
  navigateTo('home');
}

/* --- INITIALIZATION --- */

document.addEventListener('DOMContentLoaded', function() {
  // Render all content
  renderSuspects();
  renderEvidence();
  renderTimeline();
  renderInterviews();
  populateDeductionForm();

  // Set up form submission
  document.getElementById('deduction-form').addEventListener('submit', handleDeductionSubmit);
});
