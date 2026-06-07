'use strict';

/* ─────────────────────────────────────────────────────────────────
   RAPIDAPI CONFIGURATION
   These credentials are kept server-side in production.
   For this client-side demo, values are stored here only.
   Never expose or log these values in the UI.
   ───────────────────────────────────────────────────────────────── */
const RAPIDAPI_CONFIG = {
  key:      'd214969bf9msh11dfd09841cb55dp1a2dfcjsn42d8fd0984ed', // X-RapidAPI-Key
  host:     'spotify-downloader9.p.rapidapi.com',                 // X-RapidAPI-Host
  // Endpoint: /downloadSong  |  Required param: songId=<trackId only, NOT full URL>
  endpoint: 'https://spotify-downloader9.p.rapidapi.com/downloadSong',
};


/* ═══════════════════════════════════════════════════════
   CANVAS PARTICLE SYSTEM
   ═══════════════════════════════════════════════════════ */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() { this.reset(true); }
  reset(randomY = false) {
    this.x = Math.random() * canvas.width;
    this.y = randomY ? Math.random() * canvas.height : canvas.height + 10;
    this.r = Math.random() * 1.6 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.22;
    this.vy = -(Math.random() * 0.3 + 0.05);
    this.life = 0;
    this.maxLife = Math.random() * 220 + 80;
    const pal = ['167,139,250', '52,211,153', '34,211,238', '248,113,113', '251,191,36'];
    this.color = pal[Math.floor(Math.random() * pal.length)];
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.life++;
    if (this.life > this.maxLife || this.y < -10) this.reset();
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
  }
  draw() {
    const t = this.life / this.maxLife;
    const a = Math.sin(t * Math.PI) * 0.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${a})`;
    ctx.fill();
  }
}

function drawWeb() {
  const max = 90;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.hypot(dx, dy);
      if (d < max) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(167,139,250,${0.05 * (1 - d / max)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function initParticles() {
  particles = Array.from({ length: 100 }, () => new Particle());
}

(function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWeb();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(loop);
})();

window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
resizeCanvas();
initParticles();


/* ═══════════════════════════════════════════════════════
   NAVBAR SCROLL
   ═══════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  document.getElementById('navbar')
    .classList.toggle('scrolled', window.scrollY > 20);
});


/* ═══════════════════════════════════════════════════════
   SECTION SWITCHER
   ═══════════════════════════════════════════════════════ */
function switchSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(`section-${name}`).classList.add('active');

  document.querySelectorAll('.hero-inner').forEach(h => h.classList.add('hidden'));
  document.getElementById(`hero-${name}`).classList.remove('hidden');

  document.querySelectorAll('.switcher-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${name}`).classList.add('active');
}


/* ═══════════════════════════════════════════════════════
   PASSWORD TOGGLE
   ═══════════════════════════════════════════════════════ */
function togglePassword() {
  const inp = document.getElementById('loginPassword');
  const icon = document.getElementById('eyeIcon');
  const open = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
  const shut = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>`;
  if (inp.type === 'password') { inp.type = 'text'; icon.innerHTML = shut; }
  else { inp.type = 'password'; icon.innerHTML = open; }
}


/* ═══════════════════════════════════════════════════════
   PASSWORD STRENGTH
   ═══════════════════════════════════════════════════════ */
document.getElementById('loginPassword').addEventListener('input', function () {
  const val = this.value;
  const bar = document.getElementById('strengthBar');
  const fill = document.getElementById('strengthFill');
  const lbl = document.getElementById('strengthLabel');

  if (!val) {
    bar.classList.remove('visible'); lbl.classList.remove('visible'); return;
  }
  bar.classList.add('visible'); lbl.classList.add('visible');

  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/\d/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    { pct: '20%', color: '#f43f5e', txt: 'Weak' },
    { pct: '45%', color: '#fb923c', txt: 'Fair' },
    { pct: '70%', color: '#fbbf24', txt: 'Good' },
    { pct: '100%', color: '#34d399', txt: 'Strong' },
  ];
  const lvl = levels[Math.max(0, score - 1)];
  fill.style.width = lvl.pct;
  fill.style.background = lvl.color;
  lbl.textContent = lvl.txt;
  lbl.style.color = lvl.color;
});


/* ═══════════════════════════════════════════════════════
   LOGIN FORM VALIDATION
   Uses browser alert() for both errors and success
   ═══════════════════════════════════════════════════════ */
function setField(id, state, msg = '') {
  const inp = document.getElementById(`login${id}`);
  const msgEl = document.getElementById(`msg-${id.toLowerCase()}`);
  const chk = document.getElementById(`chk-${id.toLowerCase()}`);
  if (!inp) return;

  inp.classList.remove('is-error', 'is-ok');
  if (msgEl) { msgEl.textContent = ''; msgEl.className = 'field-msg'; }
  if (chk) chk.classList.add('hidden');

  if (state === 'error') {
    inp.classList.add('is-error');
    if (msgEl) msgEl.textContent = msg;
  } else if (state === 'ok') {
    inp.classList.add('is-ok');
    if (chk) chk.classList.remove('hidden');
    if (msgEl && msg) { msgEl.textContent = msg; msgEl.classList.add('ok'); }
  }
}

function validateForm() {
  const name = document.getElementById('loginName').value.trim();
  const email = document.getElementById('loginEmail').value.trim();
  const pw = document.getElementById('loginPassword').value;
  const errs = [];

  ['Name', 'Email', 'Password'].forEach(f => setField(f, ''));

  // Full Name
  if (!name) {
    setField('Name', 'error', 'Full name is required.');
    errs.push('• Full name cannot be empty.');
  } else if (name.length < 2) {
    setField('Name', 'error', 'Name must be at least 2 characters.');
    errs.push('• Full name is too short.');
  } else { setField('Name', 'ok'); }

  // Email
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    setField('Email', 'error', 'Email address is required.');
    errs.push('• Email address cannot be empty.');
  } else if (!emailRx.test(email)) {
    setField('Email', 'error', 'Enter a valid email address.');
    errs.push('• Email address format is invalid.');
  } else { setField('Email', 'ok'); }

  // Password
  if (!pw) {
    setField('Password', 'error', 'Password is required.');
    errs.push('• Password cannot be empty.');
  } else if (pw.length < 8) {
    setField('Password', 'error', 'Password must be at least 8 characters.');
    errs.push('• Password is too short (minimum 8 characters).');
  } else if (!/[A-Z]/.test(pw)) {
    setField('Password', 'error', 'Include at least one uppercase letter.');
    errs.push('• Password must contain at least one uppercase letter.');
  } else if (!/\d/.test(pw)) {
    setField('Password', 'error', 'Include at least one number.');
    errs.push('• Password must contain at least one number.');
  } else { setField('Password', 'ok'); }

  return errs;
}

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const errs = validateForm();
  if (errs.length) {
    alert('❌  Login Failed\n\nPlease fix the following:\n\n' + errs.join('\n'));
    return;
  }

  // Loading state
  const btn = document.getElementById('loginBtn');
  const loader = document.getElementById('loginLoader');
  const lbl = btn.querySelector('.btn-label');
  const icon = btn.querySelector('.btn-icon');

  btn.disabled = true;
  lbl.textContent = 'Signing in…';
  loader.classList.remove('hidden');
  icon.classList.add('hidden');

  setTimeout(() => {
    btn.disabled = false;
    lbl.textContent = 'Sign In';
    loader.classList.add('hidden');
    icon.classList.remove('hidden');

    const name = document.getElementById('loginName').value.trim();
    alert(`✅  Login Successful!\n\nWelcome back, ${name}!\nYou have been securely signed in.`);

    document.getElementById('loginForm').reset();
    ['Name', 'Email', 'Password'].forEach(f => setField(f, ''));
    document.getElementById('strengthBar').classList.remove('visible');
    document.getElementById('strengthLabel').classList.remove('visible');
  }, 1800);
});


/* ═══════════════════════════════════════════════════════
   SPOTIFY DOWNLOADER
   ═══════════════════════════════════════════════════════ */

function isValidSpotifyUrl(url) {
  return /^https?:\/\/open\.spotify\.com\/(intl-[a-z]{2}\/)?track\/[A-Za-z0-9]+/.test(url);
}

function extractTrackId(url) {
  const m = url.match(/track\/([A-Za-z0-9]+)/);
  return m ? m[1] : null;
}

function resetDownloader() {
  document.getElementById('trackResult').classList.add('hidden');
  document.getElementById('trackError').classList.add('hidden');
  document.getElementById('spotifyLink').value = '';
  document.getElementById('msg-spotify').textContent = '';
  document.getElementById('spotifyLink').classList.remove('is-error', 'is-ok');
  // Reset drop zone
  document.getElementById('dropZone').classList.remove('has-link');
}

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    const input = document.getElementById('spotifyLink');
    input.value = text;
    input.focus();
    if (text) animateDropZone();
  } catch {
    alert('Could not read clipboard.\nPlease paste the link manually using Ctrl+V.');
  }
}

function animateDropZone() {
  const dz = document.getElementById('dropZone');
  dz.classList.add('drag-over');
  setTimeout(() => dz.classList.remove('drag-over'), 600);
}

// Live input feedback on the drop zone
document.getElementById('spotifyLink').addEventListener('input', function () {
  const dz = document.getElementById('dropZone');
  if (this.value.trim()) { dz.classList.add('drag-over'); }
  else { dz.classList.remove('drag-over'); }
});
document.getElementById('spotifyLink').addEventListener('blur', function () {
  document.getElementById('dropZone').classList.remove('drag-over');
});

// Enter key support
document.getElementById('spotifyLink').addEventListener('keydown', e => {
  if (e.key === 'Enter') fetchSpotifyTrack();
});

async function fetchSpotifyTrack() {
  const input = document.getElementById('spotifyLink');
  const url = input.value.trim();
  const msgEl = document.getElementById('msg-spotify');
  const fetchBtn = document.getElementById('fetchBtn');
  const loader = document.getElementById('fetchLoader');
  const lbl = fetchBtn.querySelector('.btn-label');
  const ico = fetchBtn.querySelector('svg');

  // Reset UI
  input.classList.remove('is-error', 'is-ok');
  msgEl.textContent = '';
  document.getElementById('trackResult').classList.add('hidden');
  document.getElementById('trackError').classList.add('hidden');

  // Validate input
  if (!url) {
    input.classList.add('is-error');
    msgEl.textContent = 'Please paste a Spotify track URL first.';
    alert('⚠️  No URL Entered\n\nPlease paste a Spotify track link.\n\nExample:\nhttps://open.spotify.com/track/4iJyoBOLtHqaWYs3vyWess');
    return;
  }
  if (!isValidSpotifyUrl(url)) {
    input.classList.add('is-error');
    msgEl.textContent = 'This does not look like a valid Spotify track URL.';
    alert('⚠️  Invalid URL\n\nOnly Spotify track links are supported.\n\nFormat:\nhttps://open.spotify.com/track/...');
    return;
  }

  // Loading state
  input.classList.add('is-ok');
  fetchBtn.disabled = true;
  lbl.textContent = 'Fetching…';
  loader.classList.remove('hidden');
  ico.classList.add('hidden');

  const trackId = extractTrackId(url);

  try {
    // ── RapidAPI request ──
    // Endpoint: /downloadSong | Param: songId=<Spotify track ID only, e.g. 4iJyoBOLtHqaWYs3vyWess>
    const apiUrl = `${RAPIDAPI_CONFIG.endpoint}?songId=${encodeURIComponent(trackId)}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key':  RAPIDAPI_CONFIG.key,
        'X-RapidAPI-Host': RAPIDAPI_CONFIG.host,
      },
    });

    if (!response.ok) {
      const msg = response.status === 403 ? 'API key is invalid or subscription has expired.'
                : response.status === 429 ? 'Rate limit reached. Please wait a moment and try again.'
                : response.status === 404 ? 'Track not found or the Spotify link is invalid.'
                : `Request failed (HTTP ${response.status}).`;
      throw new Error(msg);
    }

    const json = await response.json();

    // spotify-downloader9 returns: { status: 'success', data: { title, artist, cover, downloadLink, ... } }
    // Unwrap the nested 'data' object if present
    const d = (json && json.data) ? json.data : json;

    const track = {
      title:    d.title        || d.name         || d.trackName    || 'Unknown Title',
      artist:   d.artist       || d.artists       || d.artistName   || 'Unknown Artist',
      album:    d.album        || d.albumName     || '',
      image:    d.cover        || d.image         || d.albumArt     || d.thumbnail    || '',
      audioUrl: d.downloadLink || d.download_link || d.audio        || d.audioUrl
                               || d.download      || d.downloadUrl  || d.link         || '',
    };

    if (!track.audioUrl) {
      throw new Error('No downloadable audio URL was returned. Try a different track.');
    }

    renderTrack(track);

  } catch (err) {
    console.error('[Spotify DL]', err);
    renderError(err.message || 'An unexpected error occurred.');
    alert(`❌  Download Failed\n\n${err.message}`);
  } finally {
    fetchBtn.disabled = false;
    lbl.textContent = 'Fetch & Download';
    loader.classList.add('hidden');
    ico.classList.remove('hidden');
  }
}

function renderTrack(track) {
  document.getElementById('trackName').textContent = track.title;
  document.getElementById('trackArtist').textContent = track.artist;
  document.getElementById('trackAlbum').textContent = track.album || '';

  const thumb = document.getElementById('trackThumbnail');
  thumb.src = track.image || '';
  thumb.style.display = track.image ? 'block' : 'none';

  document.getElementById('audioPreview').src = track.audioUrl;

  const dl = document.getElementById('downloadLink');
  dl.href = track.audioUrl;
  dl.download = `${track.title} - ${track.artist}.mp3`;

  document.getElementById('trackResult').classList.remove('hidden');
}

function renderError(msg) {
  document.getElementById('errorText').textContent = msg;
  document.getElementById('trackError').classList.remove('hidden');
}


/* ═══════════════════════════════════════════════════════
   MISC
   ═══════════════════════════════════════════════════════ */
document.getElementById('yr').textContent = new Date().getFullYear();
