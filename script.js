/**
 * QAWWALI NIGHT DIGITAL INVITATION — JAVASCRIPT ENGINE
 * Handles Tabla intro beat unlock, audio synthesis, ambient canvas particles,
 * minimal floating US dollar bills, English/Urdu language switching with full RTL support,
 * theme switching, live countdown, calendar exports, mobile scratch card,
 * RSVP validation, WhatsApp link generation, and Web Share API.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Load Central Configuration
  const config = window.QAWWALI_CONFIG || window.ANNIVERSARY_CONFIG || {};

  // 1. Initialize Language Switcher (EN / Urdu RTL)
  const langController = initLanguageSwitcher(config);

  // 2. Initialize Ambient Particle Canvas
  initAmbientParticles();

  // 3. Initialize Subtle Floating Small US Dollar Bills Animation
  const currencyController = initCurrencyAnimation(config);

  // 4. Bind Dynamic Text & Event Config
  bindDynamicContent(config);

  // 5. Initialize Audio System & Synthesizer
  const audioSystem = initAudioSystem(config);

  // 6. Initialize Tabla Intro Unlock Experience
  initTablaIntro(audioSystem, currencyController);

  // 7. Initialize Theme Switcher (Dark/Bright)
  initThemeSwitcher();

  // 8. Initialize Save the Date & Countdown Timer
  initCountdown(config.eventDateISO);

  // 9. Initialize Calendar Exports (Google & .ics)
  initCalendarActions(config);

  // 10. Initialize Venue Actions (Maps & Copy Address)
  initVenueActions(config);

  // 11. Initialize Interactive Mobile Scratch Card Canvas
  initScratchCard(config);

  // 12. Initialize RSVP Form & WhatsApp RSVP
  initRSVPForm(config, langController);

  // 13. Initialize WhatsApp Sharing & Web Share API
  initShareActions(config, langController);
});

/* ==========================================================================
   1. ENGLISH / URDU LANGUAGE SWITCHER ENGINE (RTL & DICTIONARY)
   ========================================================================== */
function initLanguageSwitcher(config) {
  const langBtn = document.getElementById('lang-toggle-btn');
  const htmlEl = document.documentElement;
  const translations = config.translations || {};

  let currentLang = localStorage.getItem('qawwali_lang') || 'en';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('qawwali_lang', lang);

    htmlEl.setAttribute('lang', lang);
    htmlEl.setAttribute('dir', lang === 'ur' ? 'rtl' : 'ltr');

    // Update Language Toggle Button UI
    if (langBtn) {
      const enLabel = langBtn.querySelector('.lang-en');
      const urLabel = langBtn.querySelector('.lang-ur');
      if (enLabel) enLabel.classList.toggle('active', lang === 'en');
      if (urLabel) urLabel.classList.toggle('active', lang === 'ur');
    }

    const dict = translations[lang] || translations.en || {};

    // 1. Update text for all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // 2. Update placeholders for all elements with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.placeholder = dict[key];
      }
    });
  }

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const nextLang = currentLang === 'en' ? 'ur' : 'en';
      applyLanguage(nextLang);
      showToast(nextLang === 'ur' ? 'اردو زبان منتخب کی گئی' : 'Switched to English');
    });
  }

  applyLanguage(currentLang);

  return {
    getLang: () => currentLang
  };
}

/* ==========================================================================
   2. AMBIENT GOLDEN PARTICLES CANVAS
   ========================================================================== */
function initAmbientParticles() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const particleCount = width < 768 ? 16 : 38;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.5,
      speedY: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * 0.02 + 0.005,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.opacity += Math.sin(Date.now() * p.pulse) * 0.01;

      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 164, 93, ${Math.max(0.1, Math.min(1, p.opacity))})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#C8A45D';
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. SUBTLE FLOATING SMALL US DOLLAR BILLS ANIMATION ENGINE
   ========================================================================== */
function initCurrencyAnimation(config) {
  const container = document.getElementById('currency-container');
  if (!container) return { setIntroMode: () => {} };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    container.style.display = 'none';
    return { setIntroMode: () => {} };
  }

  const defaults = config.currencyDefaults || {};
  let isIntroActive = true;

  const denominations = defaults.denominations || ['1', '5', '10', '20', '50', '100'];

  // Minimal, subtle density: 3-5 bills mobile, 5-8 bills desktop
  function getSubtleCount() {
    return window.innerWidth < 768 ? 7 : 15;
  }

  function renderNotes() {
    container.innerHTML = '';

    let count = getSubtleCount();
    if (isIntroActive) {
      count = 3; // Restrained during tabla intro screen
    }

    for (let i = 0; i < count; i++) {
      const note = document.createElement('div');
      note.className = 'banknote';

      const leftPos = Math.random() * 88 + 4; // 4% to 92%
      const fallDuration = Math.random() * 4 + 7; // 7s to 11s slow calm drift
      const fallDelay = Math.random() * 8; // 0s to 8s
      const driftX = (Math.random() - 0.5) * 100; // -50px to 50px
      const spinDeg = Math.random() * 240 + 120; // 120deg to 360deg
      const baseOpacity = Math.random() * 0.25 + 0.65; // 0.65 to 0.90 transparency

      note.style.left = `${leftPos}%`;
      note.style.setProperty('--fall-duration', `${fallDuration}s`);
      note.style.setProperty('--fall-delay', `${fallDelay}s`);
      note.style.setProperty('--drift-x', `${driftX}px`);
      note.style.setProperty('--spin-deg', `${spinDeg}deg`);
      note.style.setProperty('--base-opacity', baseOpacity);

      container.appendChild(note);
    }
  }

  // Handle Visibility Change (Pause animations when tab is hidden)
  document.addEventListener('visibilitychange', () => {
    container.style.display = document.hidden ? 'none' : 'block';
  });

  renderNotes();

  return {
    setIntroMode: (active) => {
      isIntroActive = active;
      renderNotes();
    }
  };
}

/* ==========================================================================
   4. BIND DYNAMIC CONTENT FROM CONFIG
   ========================================================================== */
function bindDynamicContent(config) {
  setText('.bind-hosts', config.hostNames || 'The Qureshi Family');
  setText('.bind-event-title', config.eventTitle || 'Qawwali Night');
  setText('.bind-urdu-title', config.urduTitle || 'شبِ قوالی و محفلِ سماع');
  setText('.bind-tagline', config.tagline || 'An Evening of Soul, Sufi Melodies & Timeless Traditions');
  setText('.bind-date', config.dateText || 'Saturday, November 21, 2026');
  setText('.bind-time', config.timeText || '8:00 PM onwards');
  setText('.bind-venue-short', config.venueName || 'The Royal Palm Mehfil Hall');
  setText('.bind-venue-name', config.venueName || 'The Royal Palm Mehfil Hall');
  setText('.bind-full-address', config.fullAddress || 'Lahore, Pakistan');
  setText('.bind-arrival', config.arrivalInstructions || 'Valet parking available.');
  setText('.bind-dress-code', config.dressCode || 'Royal Mehfil Attire');
  setText('.bind-scratch-title', config.scratchTitle || 'An Exclusive Mehfil Surprise');
  setText('.bind-scratch-message', config.scratchMessage || 'Your presence will add unmatched grace to our Mehfil.');
  setText('.bind-rsvp-deadline', config.rsvpDeadlineText || 'Please RSVP by November 10, 2026');

  // Format Date Card
  if (config.eventDateISO) {
    const d = new Date(config.eventDateISO);
    if (!isNaN(d.getTime())) {
      const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
      
      const dayName = document.getElementById('display-day-name');
      const dayNum = document.getElementById('display-day-num');
      const monthYear = document.getElementById('display-month-year');

      if (dayName) dayName.textContent = dayNames[d.getDay()];
      if (dayNum) dayNum.textContent = d.getDate();
      if (monthYear) monthYear.textContent = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    }
  }
}

function setText(selector, val) {
  document.querySelectorAll(selector).forEach((el) => {
    el.textContent = val;
  });
}

/* ==========================================================================
   5. WEB AUDIO API SYNTHESIZER & BACKGROUND AUDIO
   ========================================================================== */
function initAudioSystem(config) {
  let audioCtx = null;
  let bgAudio = new Audio(config.musicUrl || 'assets/sound/bkw.mp3');
  bgAudio.loop = true;
  let isMuted = false;
  let isPlaying = false;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Synthesize Realistic Classical Tabla Sound (Dayan & Bayyan)
  function playTablaBeat(beatIndex) {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Low Pitch Sub-Bass Bayyan Drum (Bass pitch bend down)
    const bayyanOsc = ctx.createOscillator();
    const bayyanGain = ctx.createGain();

    bayyanOsc.type = 'sine';
    bayyanOsc.frequency.setValueAtTime(130, now);
    bayyanOsc.frequency.exponentialRampToValueAtTime(55, now + 0.35);

    bayyanGain.gain.setValueAtTime(0.7, now);
    bayyanGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    bayyanOsc.connect(bayyanGain);
    bayyanGain.connect(ctx.destination);

    bayyanOsc.start(now);
    bayyanOsc.stop(now + 0.4);

    // 2. High Resonant Dayan Drum (Tuning rim hit)
    const dayanOsc = ctx.createOscillator();
    const dayanGain = ctx.createGain();

    const baseFreq = beatIndex === 3 ? 440 : (beatIndex === 2 ? 360 : 320);
    dayanOsc.type = 'triangle';
    dayanOsc.frequency.setValueAtTime(baseFreq, now);
    dayanOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + 0.2);

    dayanGain.gain.setValueAtTime(0.5, now);
    dayanGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    dayanOsc.connect(dayanGain);
    dayanGain.connect(ctx.destination);

    dayanOsc.start(now);
    dayanOsc.stop(now + 0.25);
  }

  function toggleMusic() {
    isMuted = !isMuted;
    const fab = document.getElementById('music-fab');

    if (isMuted) {
      bgAudio.pause();
      isPlaying = false;
      if (fab) fab.classList.add('muted');
      showToast('Audio muted');
    } else {
      bgAudio.play().then(() => {
        isPlaying = true;
        if (fab) fab.classList.remove('muted');
        showToast('Playing Sufi music');
      }).catch((e) => {
        console.warn('Audio playback restricted:', e);
      });
    }
  }

  const musicFab = document.getElementById('music-fab');
  if (musicFab) {
    musicFab.addEventListener('click', toggleMusic);
  }

  const introSoundToggle = document.getElementById('intro-sound-toggle');
  if (introSoundToggle) {
    introSoundToggle.addEventListener('click', () => {
      isMuted = !isMuted;
      introSoundToggle.innerHTML = isMuted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
      showToast(isMuted ? 'Sound turned off' : 'Sound turned on');
    });
  }

  return {
    playTablaBeat,
    getAudioContext,
    startBackgroundMusic: () => {
      if (!isMuted && !isPlaying) {
        bgAudio.play().then(() => { isPlaying = true; }).catch(() => {});
      }
    }
  };
}

/* ==========================================================================
   6. TABLA INTRO BEAT UNLOCK SYSTEM
   ========================================================================== */
function initTablaIntro(audioSystem, currencyController) {
  const introScreen = document.getElementById('tabla-intro-screen');
  const mainInv = document.getElementById('main-invitation');
  const tablaTrigger = document.getElementById('tabla-trigger');
  const skipBtn = document.getElementById('skip-intro-btn');
  const beatLabel = document.getElementById('beat-label');
  const rippleCanvas = document.getElementById('tabla-ripple-canvas');

  if (!introScreen || !tablaTrigger) return;

  let beatCount = 0;
  let lastTapTime = 0;
  const DEBOUNCE_MS = 250;

  // Canvas Ripple Renderer
  let ctx = rippleCanvas ? rippleCanvas.getContext('2d') : null;
  if (rippleCanvas) {
    rippleCanvas.width = 360;
    rippleCanvas.height = 360;
  }

  function triggerRipple() {
    if (!ctx) return;
    let radius = 10;
    let opacity = 1;

    function draw() {
      ctx.clearRect(0, 0, 360, 360);
      if (opacity <= 0) return;

      ctx.beginPath();
      ctx.arc(180, 180, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(200, 164, 93, ${opacity})`;
      ctx.lineWidth = 4;
      ctx.stroke();

      radius += 8;
      opacity -= 0.04;
      requestAnimationFrame(draw);
    }
    draw();
  }

  function handleBeat() {
    const now = Date.now();
    if (now - lastTapTime < DEBOUNCE_MS) return;
    lastTapTime = now;

    beatCount++;
    audioSystem.playTablaBeat(beatCount);
    triggerRipple();

    // Update Dots
    const dot = document.getElementById(`dot-${beatCount}`);
    if (dot) dot.classList.add('active');

    if (beatLabel) {
      const currentLang = localStorage.getItem('qawwali_lang') || 'en';
      const beatText = currentLang === 'ur' ? 'ضربیں' : 'Beats';
      beatLabel.innerHTML = `${beatCount} / 3 <span data-i18n="beatLabel">${beatText}</span>`;
    }

    if (beatCount >= 3) {
      unlockMehfil();
    }
  }

  function unlockMehfil() {
    audioSystem.startBackgroundMusic();
    if (currencyController && currencyController.setIntroMode) {
      currencyController.setIntroMode(false); // Unlocks full subtle currency flow
    }
    introScreen.classList.add('unlocked');
    document.body.classList.remove('lock-scroll');
    
    if (mainInv) {
      mainInv.classList.remove('hidden-until-unlocked');
    }

    const currentLang = localStorage.getItem('qawwali_lang') || 'en';
    const msg = currentLang === 'ur' ? '✨ محفل میں خوش آمدید! ✨' : '✨ The Mehfil is Unlocked! Welcome. ✨';
    showToast(msg);
  }

  tablaTrigger.addEventListener('click', handleBeat);
  tablaTrigger.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleBeat();
  }, { passive: false });

  if (skipBtn) {
    skipBtn.addEventListener('click', unlockMehfil);
  }
}

/* ==========================================================================
   7. THEME SWITCHER (DARK / BRIGHT)
   ========================================================================== */
function initThemeSwitcher() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const htmlEl = document.documentElement;

  const savedTheme = localStorage.getItem('qawwali_theme') || 'dark';
  htmlEl.setAttribute('data-theme', savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme');
      const nextTheme = current === 'dark' ? 'bright' : 'dark';
      htmlEl.setAttribute('data-theme', nextTheme);
      localStorage.setItem('qawwali_theme', nextTheme);

      const currentLang = localStorage.getItem('qawwali_lang') || 'en';
      if (currentLang === 'ur') {
        showToast(nextTheme === 'bright' ? 'روشن موڈ منتخب کیا گیا' : 'ڈارک موڈ منتخب کیا گیا');
      } else {
        showToast(nextTheme === 'bright' ? 'Switched to Royal Ivory Theme' : 'Switched to Midnight Mehfil Theme');
      }
    });
  }
}

/* ==========================================================================
   8. COUNTDOWN TIMER
   ========================================================================== */
function initCountdown(targetISO) {
  if (!targetISO) return;

  const targetDate = new Date(targetISO).getTime();
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-minutes');
  const secsEl = document.getElementById('cd-seconds');
  const expiredMsg = document.getElementById('countdown-expired');
  const wrapper = document.getElementById('countdown-wrapper');

  function update() {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (wrapper) wrapper.classList.add('hidden');
      if (expiredMsg) expiredMsg.classList.remove('hidden');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   9. CALENDAR EXPORTS (GOOGLE & .ICS)
   ========================================================================== */
function initCalendarActions(config) {
  const btnGoogle = document.getElementById('add-google-cal');
  const btnIcs = document.getElementById('download-ics-cal');

  if (btnGoogle) {
    btnGoogle.addEventListener('click', () => {
      const title = encodeURIComponent(config.eventTitle || 'Qawwali Night');
      const details = encodeURIComponent(config.invitationSubtitle || 'Qawwali Night Digital Invitation');
      const location = encodeURIComponent(config.fullAddress || config.venueName || 'Lahore');
      
      const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261121T150000Z/20261121T200000Z&details=${details}&location=${location}`;
      window.open(gCalUrl, '_blank');
    });
  }

  if (btnIcs) {
    btnIcs.addEventListener('click', () => {
      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Qawwali Night//Invitation//EN
BEGIN:VEVENT
SUMMARY:${config.eventTitle || 'Qawwali Night'}
DESCRIPTION:${config.invitationSubtitle || 'Qawwali Night Digital Invitation'}
LOCATION:${config.fullAddress || config.venueName || 'Lahore'}
DTSTART:20261121T150000Z
DTEND:20261121T200000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'Qawwali_Night_Invitation.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const currentLang = localStorage.getItem('qawwali_lang') || 'en';
      const msg = currentLang === 'ur' ? 'کیلنڈر فائل ڈاؤن لوڈ ہو گئی' : 'Downloaded .ics calendar file';
      showToast(msg);
    });
  }
}

/* ==========================================================================
   10. VENUE ACTIONS
   ========================================================================== */
function initVenueActions(config) {
  const btnDirections = document.getElementById('btn-get-directions');
  const btnCopyAddress = document.getElementById('btn-copy-address');

  if (btnDirections && config.googleMapsUrl) {
    btnDirections.href = config.googleMapsUrl;
  }

  if (btnCopyAddress) {
    btnCopyAddress.addEventListener('click', () => {
      const addr = config.fullAddress || 'The Royal Palm Mehfil Hall, Lahore';
      navigator.clipboard.writeText(addr).then(() => {
        const currentLang = localStorage.getItem('qawwali_lang') || 'en';
        const msg = currentLang === 'ur' ? 'مقام کا پتہ کاپی ہو گیا! 📋' : 'Venue address copied to clipboard! 📋';
        showToast(msg);
      }).catch(() => {
        showToast('Copied address');
      });
    });
  }
}

/* ==========================================================================
   11. INTERACTIVE CANVAS SCRATCH CARD (MOBILE RESPONSIVE)
   ========================================================================== */
function initScratchCard(config) {
  const canvas = document.getElementById('scratch-canvas');
  const fallbackBtn = document.getElementById('btn-reveal-scratch');

  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function setupFoil() {
    canvas.width = canvas.offsetWidth || 600;
    canvas.height = canvas.offsetHeight || 320;

    // Metallic Gold Gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#C8A45D');
    grad.addColorStop(0.3, '#E8D6A3');
    grad.addColorStop(0.6, '#B08B42');
    grad.addColorStop(1, '#8C6827');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative Text on Gold Foil
    const currentLang = localStorage.getItem('qawwali_lang') || 'en';
    const topText = currentLang === 'ur' ? '✦ ایک خاص پیغام ✦' : '✦ AN EXCLUSIVE SURPRISE AWAITS ✦';
    const subText = currentLang === 'ur' ? 'پیغام دیکھنے کے لیے یہاں کھرچیں' : 'Scratch here with your finger or cursor to reveal';

    ctx.fillStyle = '#080808';
    ctx.font = 'bold clamp(16px, 4vw, 20px) "Cormorant Garamond", serif';
    ctx.textAlign = 'center';
    ctx.fillText(topText, canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = 'clamp(12px, 3vw, 14px) "Outfit", sans-serif';
    ctx.fillText(subText, canvas.width / 2, canvas.height / 2 + 20);
  }

  setupFoil();
  window.addEventListener('resize', () => {
    if (canvas.style.opacity !== '0') {
      setupFoil();
    }
  });

  let isDrawing = false;

  function scratch(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 32, 0, Math.PI * 2);
    ctx.fill();

    checkPercent();
  }

  function checkPercent() {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;

    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) transparentCount++;
    }

    const percent = (transparentCount / (pixels.length / 16)) * 100;
    if (percent > 45) {
      canvas.style.opacity = '0';
      canvas.style.pointerEvents = 'none';
      const currentLang = localStorage.getItem('qawwali_lang') || 'en';
      const msg = currentLang === 'ur' ? '✨ دعوتی پیغام کھل گیا! ✨' : '✨ Secret invitation message revealed! ✨';
      showToast(msg);
    }
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  canvas.addEventListener('mousedown', (e) => { isDrawing = true; const p = getPos(e); scratch(p.x, p.y); });
  canvas.addEventListener('mousemove', (e) => { if (isDrawing) { const p = getPos(e); scratch(p.x, p.y); } });
  window.addEventListener('mouseup', () => { isDrawing = false; });

  canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    const p = getPos(e);
    scratch(p.x, p.y);
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (isDrawing) {
      const p = getPos(e);
      scratch(p.x, p.y);
    }
  }, { passive: true });

  window.addEventListener('touchend', () => { isDrawing = false; });

  if (fallbackBtn) {
    fallbackBtn.addEventListener('click', () => {
      canvas.style.opacity = '0';
      canvas.style.pointerEvents = 'none';
      const currentLang = localStorage.getItem('qawwali_lang') || 'en';
      const msg = currentLang === 'ur' ? 'دعوتی پیغام کھل گیا!' : 'Surprise message revealed!';
      showToast(msg);
    });
  }
}

/* ==========================================================================
   12. RSVP FORM & WHATSAPP GENERATOR
   ========================================================================== */
function initRSVPForm(config, langController) {
  const btnAttending = document.getElementById('btn-attending');
  const btnDeclined = document.getElementById('btn-declined');
  const groupGuestCount = document.getElementById('group-guest-count');
  const form = document.getElementById('rsvp-form');
  const btnWhatsapp = document.getElementById('btn-submit-whatsapp');
  const rsvpSuccess = document.getElementById('rsvp-success');
  const btnRsvpAgain = document.getElementById('btn-rsvp-again');

  let rsvpStatus = 'attending';

  if (btnAttending && btnDeclined) {
    btnAttending.addEventListener('click', () => {
      rsvpStatus = 'attending';
      btnAttending.classList.add('active');
      btnDeclined.classList.remove('active');
      if (groupGuestCount) groupGuestCount.style.display = 'block';
    });

    btnDeclined.addEventListener('click', () => {
      rsvpStatus = 'declined';
      btnDeclined.classList.add('active');
      btnAttending.classList.remove('active');
      if (groupGuestCount) groupGuestCount.style.display = 'none';
    });
  }

  function getFormData() {
    return {
      name: document.getElementById('guest-name')?.value || '',
      count: document.getElementById('guest-count')?.value || '1',
      phone: document.getElementById('guest-phone')?.value || '',
      notes: document.getElementById('guest-notes')?.value || '',
      status: rsvpStatus
    };
  }

  if (btnWhatsapp) {
    btnWhatsapp.addEventListener('click', () => {
      const data = getFormData();
      const currentLang = langController.getLang();

      if (!data.name.trim()) {
        showToast(currentLang === 'ur' ? 'براہ کرم اپنا نام درج کریں' : 'Please enter your full name');
        return;
      }

      let msg = '';
      if (currentLang === 'ur') {
        const statusText = data.status === 'attending' ? '✅ باخوشی شرکت کروں گا/گی' : '🌹 معذرت، شرکت ممکن نہیں';
        msg = `السلام علیکم! محفلِ قوالی کے لیے شرکت کی تصدیق:\n\n👤 نام: ${data.name}\n📌 شرکت کی صورتحال: ${statusText}\n👥 مہمانوں کی تعداد: ${data.count}\n📞 رابطہ نمبر: ${data.phone}\n📝 خاص پیغام: ${data.notes || 'کوئی نہیں'}`;
      } else {
        const statusText = data.status === 'attending' ? '✅ Attending with joy!' : '🌹 Regretfully unable to attend';
        msg = `Assalam-o-Alaikum! RSVP for Qawwali Night:\n\n👤 Name: ${data.name}\n📌 RSVP Status: ${statusText}\n👥 Guest Count: ${data.count}\n📞 Contact: ${data.phone}\n📝 Notes: ${data.notes || 'N/A'}`;
      }

      const waNumber = config.whatsappNumber || '923001234567';
      const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
      showToast(currentLang === 'ur' ? 'واٹس ایپ RSVP کھل رہا ہے...' : 'Opening WhatsApp RSVP...');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = getFormData();
      const currentLang = langController.getLang();

      if (!data.name.trim()) {
        showToast(currentLang === 'ur' ? 'براہ کرم اپنا نام درج کریں' : 'Please enter your full name');
        return;
      }

      form.classList.add('hidden');
      if (rsvpSuccess) rsvpSuccess.classList.remove('hidden');

      const msg = currentLang === 'ur' ? '✨ شرکت کی تصدیق موصول ہو گئی۔ شکریہ! ✨' : '✨ RSVP submitted successfully! Thank you. ✨';
      showToast(msg);
    });
  }

  if (btnRsvpAgain) {
    btnRsvpAgain.addEventListener('click', () => {
      if (rsvpSuccess) rsvpSuccess.classList.add('hidden');
      if (form) form.classList.remove('hidden');
    });
  }
}

/* ==========================================================================
   13. SHARE INVITATION & WEB SHARE API
   ========================================================================== */
function initShareActions(config, langController) {
  const btnWa = document.getElementById('btn-share-whatsapp');
  const btnNative = document.getElementById('btn-share-native');
  const btnCopy = document.getElementById('btn-copy-link');

  function getShareMessage() {
    const lang = langController.getLang();
    const translations = config.translations || {};
    const dict = translations[lang] || translations.en || {};
    
    if (dict.whatsappShareTemplate) {
      return dict.whatsappShareTemplate;
    }

    if (lang === 'ur') {
      return `آپ کو محفلِ قوالی میں شرکت کی دعوت دی جاتی ہے۔ آئیے، روح پرور موسیقی اور خوبصورت روایات سے سجی اس شام کا حصہ بنیے۔ دعوت نامہ دیکھیں: ${window.location.href}`;
    }

    return `You are invited to our Qawwali Night! Join us for a beautiful evening of soulful music and tradition. View your digital invitation: ${window.location.href}`;
  }

  if (btnWa) {
    btnWa.addEventListener('click', () => {
      const shareText = getShareMessage();
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(url, '_blank');
    });
  }

  if (btnNative) {
    btnNative.addEventListener('click', () => {
      const shareText = getShareMessage();
      const lang = langController.getLang();

      if (navigator.share) {
        navigator.share({
          title: lang === 'ur' ? 'محفلِ قوالی دعوت نامہ' : 'Qawwali Night Digital Invitation',
          text: lang === 'ur' ? 'آپ کو محفلِ قوالی میں شرکت کی دعوت دی جاتی ہے۔' : 'You are invited to Qawwali Night!',
          url: window.location.href
        }).catch(() => {});
      } else {
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank');
      }
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        const lang = langController.getLang();
        const msg = lang === 'ur' ? 'دعوت نامے کا لنک کاپی ہو گیا! 🔗' : 'Invitation link copied to clipboard! 🔗';
        showToast(msg);
      }).catch(() => {
        showToast('Copied link');
      });
    });
  }
}

/* Helper Toast Notification */
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}
