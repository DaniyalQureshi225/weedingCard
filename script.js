/**
 * PAKISTANI DHOLKI NIGHT DIGITAL INVITATION — JAVASCRIPT ENGINE
 * Handles:
 * - Interactive Dholak percussion synthesizer & tap unlock experience
 * - Replay / Reopen opening animation
 * - Floating marigold & jasmine petals canvas animation
 * - English / Urdu language switching with RTL layout
 * - Theme switching (Warm Festive Cream / Midnight Jamuni)
 * - Live countdown timer to wedding event
 * - Google Calendar & Apple/Outlook .ics export
 * - Interactive gold scratch-to-reveal surprise card
 * - Interactive RSVP form & WhatsApp RSVP generation
 * - WhatsApp sharing link generation & Web Share API
 */

document.addEventListener('DOMContentLoaded', () => {
  // Load Central Configuration
  const config = window.DHOLKI_CONFIG || window.QAWWALI_CONFIG || {};

  // 1. Initialize Language Switcher (EN / Urdu RTL)
  const langController = initLanguageSwitcher(config);

  // 2. Initialize Floating Marigold & Jasmine Petals Canvas
  initPetalsCanvas(config);

  // 3. Bind Dynamic Text & Event Config
  bindDynamicContent(config);

  // 4. Initialize Web Audio API Drum Synthesizer & Background Music
  const audioSystem = initAudioSystem(config);

  // 5. Initialize Dholak Opening Screen & Replay Experience
  initDholakIntro(audioSystem, config);

  // 6. Initialize Theme Switcher (Bright / Dark)
  initThemeSwitcher();

  // 7. Initialize Save the Date & Live Countdown Timer
  initCountdown(config.eventDateISO);

  // 8. Initialize Calendar Exports (Google & .ics)
  initCalendarActions(config);

  // 9. Initialize Venue Actions (Directions & Copy Address)
  initVenueActions(config);

  // 10. Initialize Interactive Mobile Scratch Card
  initScratchCard(config);

  // 11. Initialize RSVP Form & WhatsApp RSVP
  initRSVPForm(config, langController);

  // 12. Initialize WhatsApp Sharing & Web Share API
  initShareActions(config, langController);

  // 13. Suppress Netlify badge & drawer widgets
  removeNetlifyBadge();
});

/* ==========================================================================
   1. ENGLISH / URDU LANGUAGE SWITCHER ENGINE (RTL & DICTIONARY)
   ========================================================================== */
function initLanguageSwitcher(config) {
  const langBtn = document.getElementById('lang-toggle-btn');
  const htmlEl = document.documentElement;
  const translations = config.translations || {};

  let currentLang = localStorage.getItem('dholki_lang') || 'en';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('dholki_lang', lang);

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

    // 1. Update text for elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // 2. Update placeholders for elements with data-i18n-placeholder
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
      showToast(nextLang === 'ur' ? 'اردو زبان منتخب کی گئی 🌸' : 'Switched to English 🌸');
    });
  }

  applyLanguage(currentLang);

  return {
    getLang: () => currentLang
  };
}

/* ==========================================================================
   2. FLOATING MARIGOLD & JASMINE PETALS CANVAS
   ========================================================================== */
function initPetalsCanvas(config) {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const petalCount = window.innerWidth < 600 ? 14 : 26;

  // Colors: Marigold Orange, Sunflower Yellow, Rose Pink, Fragrant Jasmine White
  const petalColors = [
    { color: '#FF6F00', type: 'marigold' },
    { color: '#FFA000', type: 'marigold' },
    { color: '#FFD54F', type: 'marigold' },
    { color: '#E91E63', type: 'rose' },
    { color: '#F48FB1', type: 'rose' },
    { color: '#FFFDE7', type: 'jasmine' }
  ];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      this.size = Math.random() * 8 + 8;
      this.speedY = Math.random() * 0.9 + 0.6;
      this.speedX = Math.random() * 0.7 - 0.35;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
      this.swing = Math.random() * 2;
      this.swingSpeed = Math.random() * 0.02 + 0.01;
      this.opacity = Math.random() * 0.35 + 0.55;
      const c = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.color = c.color;
      this.type = c.type;
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.swing) * 0.6 + this.speedX;
      this.swing += this.swingSpeed;
      this.rotation += this.rotSpeed;

      if (this.y > height + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      ctx.beginPath();
      if (this.type === 'jasmine') {
        // Starry 4-petal jasmine bud
        ctx.ellipse(0, 0, this.size * 0.5, this.size * 0.8, 0, 0, Math.PI * 2);
      } else {
        // Curved petal leaf shape
        ctx.moveTo(0, -this.size);
        ctx.quadraticCurveTo(this.size * 0.7, -this.size * 0.3, this.size * 0.4, this.size * 0.6);
        ctx.quadraticCurveTo(0, this.size * 0.9, -this.size * 0.4, this.size * 0.6);
        ctx.quadraticCurveTo(-this.size * 0.7, -this.size * 0.3, 0, -this.size);
      }
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
  }

  let animId;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach((p) => {
      p.update();
      p.draw();
    });
    animId = requestAnimationFrame(animate);
  }

  animate();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      animate();
    }
  });
}

/* ==========================================================================
   3. BIND DYNAMIC CONTENT FROM CONFIG
   ========================================================================== */
function bindDynamicContent(config) {
  setText('.bind-bride-name', config.brideName || 'Ayesha');
  setText('.bind-hosts', config.hostNames || 'The Malik & Khan Family');
  setText('.bind-date', config.dateText || 'Friday, December 18, 2026');
  setText('.bind-time', config.timeText || '7:30 PM onwards');
  setText('.bind-venue-short', config.venueName || 'The Haveli Courtyard');
  setText('.bind-venue-name', config.venueName || 'The Haveli Courtyard');
  setText('.bind-full-address', config.fullAddress || 'Gulberg III, Lahore, Pakistan');
  setText('.bind-arrival', config.arrivalInstructions || 'Valet parking available.');
  setText('.bind-dress-code', config.dressCode || 'Vibrant Mehndi & Dholki Attire');
  setText('.bind-rsvp-contact', config.rsvpContact || '+92 300 123 4567');
  setText('.bind-rsvp-deadline', config.rsvpDeadlineText || 'Please RSVP by December 10, 2026');
  setText('.bind-scratch-title', config.scratchTitle || 'A Special Dholki Note');
  setText('.bind-scratch-message', config.scratchMessage || 'Get ready with your finest thumkas and dholak rhythms!');

  // Format Save the Date Highlights
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
   4. WEB AUDIO API DHOLAK SYNTHESIZER & BACKGROUND AUDIO
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

  // Synthesizes authentic Pakistani Dholak drum hits
  function playDholakBeat(type = 'bass') {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'bass' || type === 'both') {
      // 1. Deep resonant Dholak bass drum (Dha / Ge)
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();

      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(140, now);
      bassOsc.frequency.exponentialRampToValueAtTime(50, now + 0.32);

      bassGain.gain.setValueAtTime(0.75, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);

      bassOsc.start(now);
      bassOsc.stop(now + 0.38);
    }

    if (type === 'treble' || type === 'both') {
      // 2. High snappy Dholak treble drum rim slap (Ta / Na)
      const trebOsc = ctx.createOscillator();
      const trebGain = ctx.createGain();

      trebOsc.type = 'triangle';
      trebOsc.frequency.setValueAtTime(420, now);
      trebOsc.frequency.exponentialRampToValueAtTime(280, now + 0.15);

      trebGain.gain.setValueAtTime(0.55, now);
      trebGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      trebOsc.connect(trebGain);
      trebGain.connect(ctx.destination);

      trebOsc.start(now);
      trebOsc.stop(now + 0.18);
    }
  }

  // Celebratory fast Dholak roll rhythm when opening invitation
  function playCelebrationRoll() {
    if (isMuted) return;
    const pattern = [
      { time: 0, type: 'bass' },
      { time: 100, type: 'treble' },
      { time: 200, type: 'treble' },
      { time: 320, type: 'bass' },
      { time: 440, type: 'both' },
      { time: 560, type: 'both' }
    ];

    pattern.forEach((p) => {
      setTimeout(() => playDholakBeat(p.type), p.time);
    });
  }

  function startBackgroundMusic() {
    if (isMuted || isPlaying) return;
    getAudioContext();
    bgAudio.play().then(() => {
      isPlaying = true;
      updateMusicFabUI(true);
    }).catch(() => {
      isPlaying = false;
      updateMusicFabUI(false);
    });
  }

  function toggleMusic() {
    if (isPlaying) {
      bgAudio.pause();
      isPlaying = false;
      updateMusicFabUI(false);
    } else {
      isMuted = false;
      startBackgroundMusic();
    }
  }

  function toggleMuteAll() {
    isMuted = !isMuted;
    if (isMuted) {
      bgAudio.pause();
      isPlaying = false;
      updateMusicFabUI(false);
    } else {
      startBackgroundMusic();
    }
    return isMuted;
  }

  function updateMusicFabUI(active) {
    const fab = document.getElementById('music-fab');
    if (fab) {
      fab.classList.toggle('playing', active);
      const icon = fab.querySelector('.music-icon');
      if (icon) {
        icon.className = active ? 'fa-solid fa-volume-high music-icon' : 'fa-solid fa-volume-xmark music-icon';
      }
    }

    const introSoundToggle = document.getElementById('intro-sound-toggle');
    if (introSoundToggle) {
      const icon = introSoundToggle.querySelector('i');
      if (icon) {
        icon.className = isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
      }
    }
  }

  const musicFab = document.getElementById('music-fab');
  if (musicFab) {
    musicFab.addEventListener('click', toggleMusic);
  }

  const introSoundToggle = document.getElementById('intro-sound-toggle');
  if (introSoundToggle) {
    introSoundToggle.addEventListener('click', () => {
      const muted = toggleMuteAll();
      showToast(muted ? 'Sound Muted 🔇' : 'Sound Enabled 🔊');
    });
  }

  return {
    playBeat: playDholakBeat,
    playRoll: playCelebrationRoll,
    startBgMusic: startBackgroundMusic,
    toggleMusic: toggleMusic
  };
}

/* ==========================================================================
   5. INTERACTIVE DHOLAK OPENING SCREEN & REPLAY
   ========================================================================== */
function initDholakIntro(audioSystem, config) {
  const introScreen = document.getElementById('dholak-intro-screen');
  const mainInvitation = document.getElementById('main-invitation');
  const dholakTrigger = document.getElementById('dholak-trigger');
  const dholakCard = document.querySelector('.dholak-drum-card');
  const btnOpen = document.getElementById('btn-open-invitation');
  const btnSkip = document.getElementById('skip-intro-btn');
  const beatCountText = document.getElementById('beat-count-text');
  const rippleCanvas = document.getElementById('dholak-ripple-canvas');
  const reopenBtn = document.getElementById('reopen-intro-btn');
  const footerReplayLink = document.getElementById('footer-replay-link');

  let beatsCount = 0;
  const maxBeats = 3;
  let isUnlocked = false;

  // Initialize Canvas Ripples
  let rCtx = null;
  const ripples = [];
  if (rippleCanvas) {
    rippleCanvas.width = 280;
    rippleCanvas.height = 280;
    rCtx = rippleCanvas.getContext('2d');
  }

  function addRipple(x, y) {
    if (!rCtx) return;
    ripples.push({
      x: x || 140,
      y: y || 140,
      radius: 10,
      maxRadius: 110,
      alpha: 0.8
    });
  }

  function animateRipples() {
    if (!rCtx) return;
    rCtx.clearRect(0, 0, 280, 280);

    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += 4;
      r.alpha -= 0.025;

      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        ripples.splice(i, 1);
      } else {
        rCtx.save();
        rCtx.beginPath();
        rCtx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        rCtx.strokeStyle = `rgba(229, 169, 16, ${r.alpha})`;
        rCtx.lineWidth = 3;
        rCtx.stroke();
        rCtx.restore();
      }
    }
    requestAnimationFrame(animateRipples);
  }
  animateRipples();

  function triggerBeatHit(e) {
    if (isUnlocked) return;

    beatsCount++;
    if (beatCountText) {
      beatCountText.textContent = `${beatsCount} / ${maxBeats}`;
    }

    // Audio & visuals
    const beatTypes = ['bass', 'treble', 'both'];
    audioSystem.playBeat(beatTypes[(beatsCount - 1) % 3]);

    if (dholakCard) {
      dholakCard.classList.add('hit');
      setTimeout(() => dholakCard.classList.remove('hit'), 150);
    }

    addRipple(140, 140);

    if (beatsCount >= maxBeats) {
      setTimeout(unlockInvitation, 250);
    }
  }

  function unlockInvitation() {
    if (isUnlocked) return;
    isUnlocked = true;

    // Play celebration roll & launch confetti
    audioSystem.playRoll();
    launchFestiveConfetti();

    // Start background festive audio
    setTimeout(() => {
      audioSystem.startBgMusic();
    }, 400);

    // Fade out intro screen
    if (introScreen) {
      introScreen.classList.add('unlocked');
    }

    // Reveal main invitation card smoothly
    if (mainInvitation) {
      mainInvitation.classList.remove('hidden-until-unlocked');
    }

    document.body.classList.remove('lock-scroll');
    showToast('✨ Welcome to Dholki Night! Let’s Celebrate ✨');
  }

  function reopenInvitation() {
    isUnlocked = false;
    beatsCount = 0;
    if (beatCountText) {
      beatCountText.textContent = `0 / ${maxBeats}`;
    }

    if (introScreen) {
      introScreen.classList.remove('unlocked');
    }
    document.body.classList.add('lock-scroll');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('🪘 Opening Invitation Experience Replayed 🪘');
  }

  if (dholakTrigger) {
    dholakTrigger.addEventListener('click', triggerBeatHit);
    dholakTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerBeatHit(e);
      }
    });
  }

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      unlockInvitation();
    });
  }

  if (btnSkip) {
    btnSkip.addEventListener('click', () => {
      unlockInvitation();
    });
  }

  if (reopenBtn) {
    reopenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      reopenInvitation();
    });
  }

  if (footerReplayLink) {
    footerReplayLink.addEventListener('click', (e) => {
      e.preventDefault();
      reopenInvitation();
    });
  }
}

/* ==========================================================================
   FESTIVE WEDDING CONFETTI EFFECT
   ========================================================================== */
function launchFestiveConfetti() {
  const count = 50;
  const colors = ['#E5A910', '#D81B60', '#7CB342', '#FF6F00', '#FFD54F', '#4A154B'];

  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'festive-confetti';
    confetti.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: ${Math.random() * 8 + 6}px;
      height: ${Math.random() * 12 + 6}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      z-index: 9999;
      pointer-events: none;
      transform: translate(-50%, -50%);
      transition: transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.2s ease-out;
    `;
    document.body.appendChild(confetti);

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 340 + 100;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance - 80;
    const rotate = Math.random() * 720;

    requestAnimationFrame(() => {
      confetti.style.transform = `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) rotate(${rotate}deg)`;
      confetti.style.opacity = '0';
    });

    setTimeout(() => {
      confetti.remove();
    }, 1300);
  }
}

/* ==========================================================================
   6. THEME SWITCHER (FESTIVE BRIGHT / MIDNIGHT JAMUNI)
   ========================================================================== */
function initThemeSwitcher() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const htmlEl = document.documentElement;

  let currentTheme = localStorage.getItem('dholki_theme') || 'bright';

  function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('dholki_theme', theme);
    htmlEl.setAttribute('data-theme', theme);
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const nextTheme = currentTheme === 'bright' ? 'dark' : 'bright';
      applyTheme(nextTheme);
      showToast(nextTheme === 'dark' ? 'Midnight Theme Enabled 🌙' : 'Festive Bright Theme Enabled ☀️');
    });
  }

  applyTheme(currentTheme);
}

/* ==========================================================================
   7. LIVE REAL-TIME COUNTDOWN TIMER
   ========================================================================== */
function initCountdown(eventDateISO) {
  const targetDate = new Date(eventDateISO || '2026-12-18T19:30:00').getTime();

  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');
  const elExpired = document.getElementById('countdown-expired');
  const elWrapper = document.getElementById('countdown-wrapper');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (elWrapper) elWrapper.classList.add('hidden');
      if (elExpired) elExpired.classList.remove('hidden');
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (elDays) elDays.textContent = String(days).padStart(2, '0');
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMinutes) elMinutes.textContent = String(minutes).padStart(2, '0');
    if (elSeconds) elSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ==========================================================================
   8. CALENDAR EXPORTS (GOOGLE & .ICS)
   ========================================================================== */
function initCalendarActions(config) {
  const googleBtn = document.getElementById('add-google-cal');
  const icsBtn = document.getElementById('download-ics-cal');

  const title = `Dholki Night | Honoring ${config.brideName || 'Ayesha'}`;
  const details = `${config.invitationText || 'Join us for a colorful Pakistani Dholki Night filled with music, traditions, and celebration.'}\n\nHosted by: ${config.hostNames || 'The Malik & Khan Family'}\nVenue: ${config.fullAddress || 'The Haveli Courtyard, Lahore'}`;
  const location = config.fullAddress || 'The Haveli Courtyard, 12-B Gulberg III, Lahore, Pakistan';

  // 2026-12-18 19:30 PKT (14:30 UTC)
  const startTime = '20261218T143000Z';
  const endTime = '20261218T193000Z';

  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      const gUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
      window.open(gUrl, '_blank', 'noopener,noreferrer');
    });
  }

  if (icsBtn) {
    icsBtn.addEventListener('click', () => {
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Pakistani Dholki Night//EN',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        `SUMMARY:${title}`,
        `DESCRIPTION:${details.replace(/\n/g, '\\n')}`,
        `LOCATION:${location}`,
        `DTSTART:${startTime}`,
        `DTEND:${endTime}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dholki-night-invitation.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Downloaded .ics calendar file 📅');
    });
  }
}

/* ==========================================================================
   9. VENUE ACTIONS (DIRECTIONS & COPY ADDRESS)
   ========================================================================== */
function initVenueActions(config) {
  const dirBtn = document.getElementById('btn-get-directions');
  const copyBtn = document.getElementById('btn-copy-address');

  if (dirBtn) {
    dirBtn.href = config.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(config.fullAddress || 'Gulberg III Lahore')}`;
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const addr = config.fullAddress || 'The Haveli Courtyard, 12-B Gulberg III, Lahore, Punjab, Pakistan';
      navigator.clipboard.writeText(addr).then(() => {
        showToast('Venue address copied to clipboard! 📋');
      }).catch(() => {
        showToast('Venue address: ' + addr);
      });
    });
  }
}

/* ==========================================================================
   10. INTERACTIVE MOBILE SCRATCH CARD CANVAS
   ========================================================================== */
function initScratchCard(config) {
  const canvas = document.getElementById('scratch-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const container = canvas.parentElement;
  let isScratching = false;
  let scratchedPercent = 0;
  let isRevealed = false;

  function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    drawGoldFoil();
  }

  function drawGoldFoil() {
    if (isRevealed) return;
    const w = canvas.width;
    const h = canvas.height;

    // Metallic gold & marigold foil gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#E5A910');
    grad.addColorStop(0.25, '#FFD54F');
    grad.addColorStop(0.5, '#F5A623');
    grad.addColorStop(0.75, '#D81B60');
    grad.addColorStop(1, '#FF6F00');

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle sparkles pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (let i = 0; i < 40; i++) {
      const sx = (i * 37) % w;
      const sy = (i * 23) % h;
      ctx.beginPath();
      ctx.arc(sx, sy, (i % 3) + 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Centered label text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ Scratch Here to Reveal Secret Message ✨', w / 2, h / 2);
  }

  function scratch(x, y) {
    if (isRevealed) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    checkProgress();
  }

  function checkProgress() {
    if (isRevealed) return;
    // Check every few moves
    if (Math.random() > 0.4) return;

    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    let transparentCount = 0;

    for (let i = 3; i < data.length; i += 32) {
      if (data[i] === 0) transparentCount++;
    }

    scratchedPercent = transparentCount / (data.length / 32);
    if (scratchedPercent > 0.42) {
      revealAll();
    }
  }

  function revealAll() {
    isRevealed = true;
    canvas.style.transition = 'opacity 0.6s ease';
    canvas.style.opacity = '0';
    setTimeout(() => {
      canvas.style.display = 'none';
    }, 600);
    showToast('✨ Surprise Message Revealed! ✨');
  }

  function getCoords(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  // Pointer events
  canvas.addEventListener('mousedown', (e) => {
    isScratching = true;
    const { x, y } = getCoords(e);
    scratch(x, y);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isScratching) return;
    const { x, y } = getCoords(e);
    scratch(x, y);
  });

  window.addEventListener('mouseup', () => {
    isScratching = false;
  });

  canvas.addEventListener('touchstart', (e) => {
    isScratching = true;
    const { x, y } = getCoords(e);
    scratch(x, y);
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (!isScratching) return;
    const { x, y } = getCoords(e);
    scratch(x, y);
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    isScratching = false;
  });

  const fallbackBtn = document.getElementById('btn-reveal-scratch');
  if (fallbackBtn) {
    fallbackBtn.addEventListener('click', revealAll);
  }

  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 100);
}

/* ==========================================================================
   11. RSVP FORM & WHATSAPP RSVP
   ========================================================================== */
function initRSVPForm(config, langController) {
  const form = document.getElementById('rsvp-form');
  const btnAttending = document.getElementById('btn-attending');
  const btnDeclined = document.getElementById('btn-declined');
  const btnSubmitOnline = document.getElementById('btn-submit-online');
  const btnSubmitWa = document.getElementById('btn-submit-whatsapp');
  const guestCountGroup = document.getElementById('group-guest-count');
  const successState = document.getElementById('rsvp-success');
  const btnRsvpAgain = document.getElementById('btn-rsvp-again');

  let currentStatus = 'attending';

  if (btnAttending && btnDeclined) {
    btnAttending.addEventListener('click', () => {
      currentStatus = 'attending';
      btnAttending.classList.add('active');
      btnDeclined.classList.remove('active');
      if (guestCountGroup) guestCountGroup.style.display = 'block';
    });

    btnDeclined.addEventListener('click', () => {
      currentStatus = 'declined';
      btnDeclined.classList.add('active');
      btnAttending.classList.remove('active');
      if (guestCountGroup) guestCountGroup.style.display = 'none';
    });
  }

  function getFormData() {
    const name = document.getElementById('guest-name')?.value.trim() || '';
    const count = document.getElementById('guest-count')?.value || '1';
    const phone = document.getElementById('guest-phone')?.value.trim() || '';
    const notes = document.getElementById('guest-notes')?.value.trim() || '';
    return { name, count, phone, notes, status: currentStatus };
  }

  if (btnSubmitWa) {
    btnSubmitWa.addEventListener('click', () => {
      const data = getFormData();
      if (!data.name) {
        showToast('Please enter your name ⚠️');
        document.getElementById('guest-name')?.focus();
        return;
      }

      const waPhone = config.whatsappNumber || '923001234567';
      const statusText = data.status === 'attending' ? 'Attending with Joy! ✨' : 'Unable to Attend 🌹';
      
      const msg = `🪘 *Dholki Night RSVP | Honoring ${config.brideName || 'Ayesha'}*\n\n` +
        `👤 *Guest Name:* ${data.name}\n` +
        `✨ *Status:* ${statusText}\n` +
        (data.status === 'attending' ? `👥 *Guests:* ${data.count} Person(s)\n` : '') +
        (data.phone ? `📱 *Phone:* ${data.phone}\n` : '') +
        (data.notes ? `🎶 *Favorite Song / Wishes:* ${data.notes}\n` : '') +
        `\nSent via Dholki Night Digital Invitation`;

      const waUrl = `https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      showToast('Opening WhatsApp RSVP... 💬');
    });
  }

  if (btnSubmitOnline) {
    btnSubmitOnline.addEventListener('click', (e) => {
      e.preventDefault();
      const data = getFormData();
      if (!data.name) {
        showToast('Please enter your name ⚠️');
        document.getElementById('guest-name')?.focus();
        return;
      }

      // Save to localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('dholki_rsvps') || '[]');
        stored.push({ ...data, date: new Date().toISOString() });
        localStorage.setItem('dholki_rsvps', JSON.stringify(stored));
      } catch (err) {
        // graceful ignore
      }

      if (form) form.classList.add('hidden');
      if (successState) successState.classList.remove('hidden');
      showToast('✨ RSVP recorded successfully! Thank you. ✨');
    });
  }

  if (btnRsvpAgain) {
    btnRsvpAgain.addEventListener('click', () => {
      if (form) {
        form.reset();
        form.classList.remove('hidden');
      }
      if (successState) successState.classList.add('hidden');
    });
  }
}

/* ==========================================================================
   12. WHATSAPP SHARING & SOCIAL PREVIEWS
   ========================================================================== */
function initShareActions(config, langController) {
  const btnWa = document.getElementById('btn-share-whatsapp');
  const btnNative = document.getElementById('btn-share-native');
  const btnCopy = document.getElementById('btn-copy-link');

  const publicUrl = config.siteUrl || window.location.origin;

  function getShareMessage() {
    const lang = langController.getLang();
    const dict = config.translations?.[lang] || config.translations?.en || {};
    const template = dict.whatsappShareTemplate || config.translations?.en?.whatsappShareTemplate || '';

    return template
      .replace(/{{BRIDE}}/g, config.brideName || 'Ayesha')
      .replace(/{{DATE}}/g, config.dateText || 'Friday, Dec 18, 2026')
      .replace(/{{TIME}}/g, config.timeText || '7:30 PM onwards')
      .replace(/{{VENUE}}/g, config.venueName || 'The Haveli Courtyard, Lahore')
      .replace(/{{HOSTS}}/g, config.hostNames || 'The Malik & Khan Family')
      .replace(/{{URL}}/g, publicUrl);
  }

  if (btnWa) {
    btnWa.addEventListener('click', () => {
      const msg = getShareMessage();
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  if (btnNative) {
    btnNative.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: `Dholki Night Invitation | ${config.brideName || 'Ayesha'}`,
          text: `Join us for a colorful Pakistani Dholki Night celebration!`,
          url: publicUrl
        }).catch(() => {
          // cancelled or unsupported
        });
      } else {
        copyLinkToClipboard();
      }
    });
  }

  function copyLinkToClipboard() {
    navigator.clipboard.writeText(publicUrl).then(() => {
      showToast('Invitation link copied to clipboard! 🔗');
    }).catch(() => {
      showToast('Invitation Link: ' + publicUrl);
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener('click', copyLinkToClipboard);
  }
}

/* ==========================================================================
   13. TOAST NOTIFICATION UTILITY
   ========================================================================== */
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.remove('hidden');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3200);
}

/* ==========================================================================
   14. SUPPRESS NETLIFY BADGE & DRAWER WIDGETS
   ========================================================================== */
function removeNetlifyBadge() {
  const selectors = [
    'iframe[src*="netlify"]',
    'iframe[title*="Netlify" i]',
    'iframe[id*="netlify" i]',
    'netlify-drawer',
    'netlify-feedback-drawer',
    'div[data-netlify-deploy-id]',
    '[data-netlify-deploy-id]',
    '.netlify-badge',
    '#netlify-badge',
    '[class*="netlify-drawer"]',
    '[class*="netlify-feedback"]',
    '[id*="netlify-drawer"]',
    '[id*="netlify-feedback"]',
    '[data-netlify-preview]',
    'a[href*="netlify.com"][class*="badge"]',
    'a[href*="netlify.app"][class*="badge"]',
    'div[class*="netlify-badge"]'
  ];

  function purge() {
    selectors.forEach((sel) => {
      try {
        const els = document.querySelectorAll(sel);
        els.forEach((el) => {
          try {
            el.remove();
          } catch (e) {
            el.style.setProperty('display', 'none', 'important');
            el.style.setProperty('visibility', 'hidden', 'important');
            el.style.setProperty('opacity', '0', 'important');
            el.style.setProperty('pointer-events', 'none', 'important');
          }
        });
      } catch (err) {}
    });
  }

  // Purge immediately
  purge();

  // Watch for any dynamically injected Netlify elements
  if (typeof MutationObserver !== 'undefined') {
    try {
      const observer = new MutationObserver(() => {
        purge();
      });
      const rootTarget = document.documentElement || document.body;
      if (rootTarget) {
        observer.observe(rootTarget, {
          childList: true,
          subtree: true
        });
      }
    } catch (err) {}
  }

  // Fallback lifecycle checks
  window.addEventListener('DOMContentLoaded', purge);
  window.addEventListener('load', purge);
  setTimeout(purge, 500);
  setTimeout(purge, 1500);
  setTimeout(purge, 3500);
}

