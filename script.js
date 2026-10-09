/**
 * Romantic Anniversary Digital Invitation Script
 * Controls canvas particles, love letter reveal, music player, timeline, gallery lightbox, 
 * love notes, surprise gift box, countdown, RSVP modal, and calendar generation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Load Configuration
  const config = window.ANNIVERSARY_CONFIG || {
    partner1: "Alexander",
    partner2: "Sophia",
    coupleTitle: "Alexander & Sophia",
    anniversaryYears: "5th",
    tagline: "Every Love Story Is Beautiful, But Ours Is My Favorite ❤️",
    invitationTitle: "You're Invited to Celebrate Our Anniversary",
    heroSubtitle: "Another year of laughter, countless memories, and a love that grows stronger with every passing day.",
    musicUrl: "assets/sound/bkw.mp3",
    musicTitle: "A Thousand Years",
    eventDateISO: "2026-11-20T19:00:00",
    dateText: "Saturday, November 20, 2026",
    timeText: "7:00 PM – 11:00 PM",
    venueName: "Le Jardin Romantic Dining & Ballroom",
    venueAddress: "742 Evergreen Terrace, Suite 500, New York, NY 10001",
    googleMapsUrl: "https://maps.google.com/?q=742+Evergreen+Terrace+New+York",
    dressCode: "Elegant & Romantic (Burgundy, Gold & Dark Tie)",
    openingText: "Someone has a little surprise for you…",
    letterOpeningMessage: "To My Dearest Love,\n\nFive years ago, two paths crossed and created a story more beautiful than I ever dreamed. Today, I invite you to step into our magical world and celebrate every milestone, every laugh, and every promise of forever.\n\nWith all my love ❤️",
    timeline: [],
    gallery: [],
    loveNotes: [],
    surpriseHeading: "There's One More Thing…",
    surpriseMessage: "My favorite place in the world will always be beside you. Thank you for being part of my life, my happiness, and my forever. Here's to every beautiful memory we've made and every wonderful moment still waiting for us. I love you, today and always. ❤️",
    finalTitle: "One Lifetime Would Never Be Enough.",
    finalSubtitle: "Here's to us, to our story, and to a love that keeps choosing each other — again and again, forever."
  };

  // 1. Initialize Canvas Particle System
  initRomanticCanvas();

  // 2. Bind Dynamic Text Content
  bindDynamicContent(config);

  // 3. Initialize Audio System
  initAudioSystem(config);

  // 4. Initialize Envelope Opening Animation
  initEnvelopeScreen();

  // 5. Render Timeline
  renderTimeline(config.timeline);

  // 6. Render Photo Gallery & Lightbox
  renderGallery(config.gallery);

  // 7. Render Love Notes
  renderLoveNotes(config.loveNotes);

  // 8. Initialize Surprise Gift Box Reveal
  initSurpriseBox();

  // 9. Initialize Event Actions (RSVP, Location, Calendar)
  initEventActions(config);

  // 10. Initialize Countdown Timer
  initCountdown(config.eventDateISO);

  // 11. Initialize Replay Story Button
  initReplayButton();
});

/* ==========================================================================
   1. AMBIENT PARTICLES CANVAS (Rose Petals & Golden Dust)
   ========================================================================== */
let canvas, ctx;
let particles = [];
const getParticleCount = () => window.innerWidth < 768 ? 20 : 45;
let PARTICLE_COUNT = getParticleCount();

function initRomanticCanvas() {
  canvas = document.getElementById('romantic-canvas');
  if (!canvas) return;

  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    PARTICLE_COUNT = getParticleCount();
  });

  // Create Initial Particles
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  // Check Reduced Motion Preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    requestAnimationFrame(animateCanvas);
  }
}

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticle() {
  const isPetal = Math.random() > 0.4;
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: isPetal ? Math.random() * 8 + 6 : Math.random() * 3 + 1,
    speedY: isPetal ? Math.random() * 1.2 + 0.5 : -(Math.random() * 0.8 + 0.2),
    speedX: Math.random() * 0.6 - 0.3,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 2,
    opacity: Math.random() * 0.7 + 0.3,
    type: isPetal ? 'petal' : 'gold'
  };
}

function animateCanvas() {
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.y += p.speedY;
    p.x += Math.sin(p.y * 0.01) + p.speedX;
    p.rotation += p.rotationSpeed;

    // Wrap around boundaries
    if (p.y > canvas.height + 20) p.y = -20;
    if (p.y < -20) p.y = canvas.height + 20;
    if (p.x > canvas.width + 20) p.x = -20;
    if (p.x < -20) p.x = canvas.width + 20;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;

    if (p.type === 'petal') {
      // Draw Rose Petal
      ctx.fillStyle = '#E2738C';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.size, -p.size, p.size * 1.5, p.size, 0, p.size * 1.8);
      ctx.bezierCurveTo(-p.size * 1.5, p.size, -p.size, -p.size, 0, 0);
      ctx.fill();
    } else {
      // Draw Glowing Golden Particle
      ctx.fillStyle = '#D8B574';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#F5E5C9';
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });

  requestAnimationFrame(animateCanvas);
}

// Function to trigger extra particle burst on interaction
function triggerParticleBurst(count = 30) {
  for (let i = 0; i < count; i++) {
    const burst = createParticle();
    burst.y = window.innerHeight / 2;
    burst.x = window.innerWidth / 2;
    burst.speedY = (Math.random() - 0.5) * 6;
    burst.speedX = (Math.random() - 0.5) * 6;
    particles.push(burst);
  }
}

/* ==========================================================================
   2. DYNAMIC CONTENT INJECTION
   ========================================================================== */
function bindDynamicContent(cfg) {
  bindText('.bind-partner-1', cfg.partner1);
  bindText('.bind-partner-2', cfg.partner2);
  bindText('.bind-couple-title', cfg.coupleTitle || `${cfg.partner1} & ${cfg.partner2}`);
  bindText('.bind-anniversary-years', `${cfg.anniversaryYears} Anniversary`);
  bindText('.bind-tagline', `“${cfg.tagline}”`);
  bindText('.bind-invitation-title', cfg.invitationTitle);
  bindText('.bind-hero-subtitle', cfg.heroSubtitle);
  bindText('.bind-opening-text', cfg.openingText);
  bindText('.bind-letter-message', cfg.letterOpeningMessage.replace(/\n/g, '<br>'), true);
  bindText('.bind-event-date', cfg.dateText);
  bindText('.bind-event-time', cfg.timeText);
  bindText('.bind-venue-name', cfg.venueName);
  bindText('.bind-venue-address', cfg.venueAddress);
  bindText('.bind-dress-code', cfg.dressCode);
  bindText('.bind-surprise-heading', cfg.surpriseHeading);
  bindText('.bind-surprise-message', cfg.surpriseMessage);
  bindText('.bind-final-title', cfg.finalTitle);
  bindText('.bind-final-subtitle', cfg.finalSubtitle);

  const songTitleEl = document.getElementById('song-title');
  if (songTitleEl && cfg.musicTitle) {
    songTitleEl.textContent = cfg.musicTitle;
  }
}

function bindText(selector, value, isHTML = false) {
  if (!value) return;
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    if (isHTML) el.innerHTML = value;
    else el.textContent = value;
  });
}

/* ==========================================================================
   3. AUDIO SYSTEM
   ========================================================================== */
let bgAudio = null;
let isMusicPlaying = false;

function initAudioSystem(cfg) {
  const musicFab = document.getElementById('music-fab');
  const songTitle = document.getElementById('song-title');
  const audioSrc = cfg.musicUrl || 'assets/sound/bkw.mp3';

  bgAudio = new Audio(audioSrc);
  bgAudio.loop = true;
  bgAudio.volume = 0.6;

  window.playMusic = function() {
    if (bgAudio && bgAudio.paused) {
      bgAudio.play().then(() => {
        isMusicPlaying = true;
        if (musicFab) musicFab.classList.add('playing');
        if (songTitle) songTitle.textContent = cfg.musicTitle || "Playing Romantic Music";
      }).catch(err => {
        console.warn('Audio play deferred until user gesture:', err);
      });
    }
  };

  window.pauseMusic = function() {
    if (bgAudio && !bgAudio.paused) {
      bgAudio.pause();
      isMusicPlaying = false;
      if (musicFab) musicFab.classList.remove('playing');
      if (songTitle) songTitle.textContent = "Music Paused";
    }
  };

  if (musicFab) {
    musicFab.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isMusicPlaying) {
        window.pauseMusic();
      } else {
        window.playMusic();
      }
    });
  }
}

/* ==========================================================================
   4. LOVE LETTER REVEAL ENVELOPE
   ========================================================================== */
function initEnvelopeScreen() {
  const envelopeScreen = document.getElementById('envelope-screen');
  const mainInvitation = document.getElementById('main-invitation');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const btnOpenLetter = document.getElementById('btn-open-letter');
  const btnOpenCta = document.getElementById('btn-open-cta');
  const btnSkipIntro = document.getElementById('skip-intro-btn');

  let isOpen = false;

  const openLetterExperience = () => {
    if (isOpen) return;
    isOpen = true;

    // Start 3D Envelope opening animation
    if (envelopeWrapper) envelopeWrapper.classList.add('open');
    triggerParticleBurst(40);

    // Fade in music after user interaction
    window.playMusic();

    // Transition smoothly to main invitation
    setTimeout(() => {
      if (envelopeScreen) envelopeScreen.classList.add('fade-out');
      if (mainInvitation) mainInvitation.classList.remove('hidden');
      document.body.classList.remove('lock-scroll');
    }, 1800);
  };

  if (btnOpenLetter) btnOpenLetter.addEventListener('click', openLetterExperience);
  if (btnOpenCta) btnOpenCta.addEventListener('click', openLetterExperience);
  if (envelopeWrapper) envelopeWrapper.addEventListener('click', openLetterExperience);

  // Skip Intro for returning visitors
  if (btnSkipIntro) {
    btnSkipIntro.addEventListener('click', (e) => {
      e.stopPropagation();
      if (envelopeScreen) envelopeScreen.classList.add('fade-out');
      if (mainInvitation) mainInvitation.classList.remove('hidden');
      document.body.classList.remove('lock-scroll');
      window.playMusic();
    });
  }
}

/* ==========================================================================
   5. TIMELINE RENDERER
   ========================================================================== */
function renderTimeline(timelineItems) {
  const track = document.getElementById('timeline-track');
  if (!track || !timelineItems || timelineItems.length === 0) return;

  track.innerHTML = timelineItems.map(item => `
    <div class="timeline-card">
      <div class="timeline-card-header">
        <div class="timeline-icon">${item.icon || '❤️'}</div>
        <span class="timeline-date">${item.date}</span>
      </div>
      ${item.photo ? `
        <div class="timeline-img-wrapper">
          <img src="${item.photo}" alt="${item.title}" loading="lazy">
        </div>
      ` : ''}
      <h3 class="timeline-title">${item.title}</h3>
      <p class="timeline-msg">${item.message}</p>
    </div>
  `).join('');
}

/* ==========================================================================
   6. PHOTO GALLERY & LIGHTBOX
   ========================================================================== */
let galleryData = [];
let currentPhotoIndex = 0;

function renderGallery(items) {
  galleryData = items || [];
  const grid = document.getElementById('gallery-grid');
  if (!grid || galleryData.length === 0) return;

  grid.innerHTML = galleryData.map((item, index) => `
    <div class="polaroid-card" data-index="${index}">
      <div class="polaroid-img-wrapper">
        <img src="${item.url}" alt="${item.caption}" loading="lazy">
        ${item.tag ? `<span class="polaroid-tag">${item.tag}</span>` : ''}
      </div>
      <p class="polaroid-caption">${item.caption}</p>
    </div>
  `).join('');

  // Attach Lightbox Triggers
  const cards = grid.querySelectorAll('.polaroid-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-index'), 10);
      openLightbox(idx);
    });
  });

  initLightboxControls();
}

function openLightbox(index) {
  if (index < 0 || index >= galleryData.length) return;
  currentPhotoIndex = index;

  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const counter = document.getElementById('lightbox-counter');

  const item = galleryData[currentPhotoIndex];
  if (img) img.src = item.url;
  if (caption) caption.textContent = item.caption;
  if (counter) counter.textContent = `${currentPhotoIndex + 1} / ${galleryData.length}`;

  if (modal) modal.classList.remove('hidden');
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (modal) modal.classList.add('hidden');
}

function initLightboxControls() {
  const modal = document.getElementById('lightbox-modal');
  const overlay = document.getElementById('lightbox-overlay');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (overlay) overlay.addEventListener('click', closeLightbox);

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentPhotoIndex = (currentPhotoIndex - 1 + galleryData.length) % galleryData.length;
      openLightbox(currentPhotoIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentPhotoIndex = (currentPhotoIndex + 1) % galleryData.length;
      openLightbox(currentPhotoIndex);
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal || modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
  });

  // Touch swipe navigation for mobile screens
  let touchStartX = 0;
  let touchEndX = 0;

  if (modal) {
    modal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 40) {
      if (swipeDistance < 0 && nextBtn) {
        nextBtn.click();
      } else if (swipeDistance > 0 && prevBtn) {
        prevBtn.click();
      }
    }
  }
}

/* ==========================================================================
   7. LOVE NOTES FLIP CARDS
   ========================================================================== */
function renderLoveNotes(notes) {
  const grid = document.getElementById('notes-grid');
  if (!grid || !notes || notes.length === 0) return;

  grid.innerHTML = notes.map((note, index) => `
    <div class="note-flip-card" data-index="${index}">
      <div class="note-flip-inner">
        <div class="note-card-front">
          <i class="fa-solid fa-heart-circle-check"></i>
          <span class="note-hint">Reason #${index + 1}</span>
          <span class="note-tap-text">Tap to reveal</span>
        </div>
        <div class="note-card-back">
          <p class="note-quote">“${note.text}”</p>
          <i class="fa-solid fa-rose"></i>
        </div>
      </div>
    </div>
  `).join('');

  const cards = grid.querySelectorAll('.note-flip-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      triggerParticleBurst(10);
    });
  });
}

/* ==========================================================================
   8. SURPRISE GIFT BOX
   ========================================================================== */
function initSurpriseBox() {
  const giftBox = document.getElementById('gift-box-wrapper');
  const btnUnwrap = document.getElementById('btn-unwrap-gift');
  const revealCard = document.getElementById('surprise-reveal-card');

  const unwrapAction = () => {
    if (giftBox) giftBox.classList.add('opened');
    triggerParticleBurst(60);

    setTimeout(() => {
      if (revealCard) revealCard.classList.remove('hidden');
      if (revealCard) revealCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 600);
  };

  if (btnUnwrap) btnUnwrap.addEventListener('click', unwrapAction);
  if (giftBox) giftBox.addEventListener('click', unwrapAction);
}

/* ==========================================================================
   9. EVENT ACTIONS (RSVP, Maps & Add to Calendar)
   ========================================================================== */
function initEventActions(cfg) {
  // RSVP Modal Triggers
  const rsvpModal = document.getElementById('rsvp-modal');
  const btnConfirmRsvp = document.getElementById('btn-confirm-rsvp');
  const rsvpOverlay = document.getElementById('rsvp-overlay');
  const rsvpClose = document.getElementById('rsvp-close');
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpSuccess = document.getElementById('rsvp-success');
  const rsvpDoneBtn = document.getElementById('rsvp-done-btn');

  const openRsvp = () => { if (rsvpModal) rsvpModal.classList.remove('hidden'); };
  const closeRsvp = () => { if (rsvpModal) rsvpModal.classList.add('hidden'); };

  if (btnConfirmRsvp) btnConfirmRsvp.addEventListener('click', openRsvp);
  if (rsvpOverlay) rsvpOverlay.addEventListener('click', closeRsvp);
  if (rsvpClose) rsvpClose.addEventListener('click', closeRsvp);
  if (rsvpDoneBtn) rsvpDoneBtn.addEventListener('click', closeRsvp);

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('rsvp-name').value;
      const successText = document.getElementById('rsvp-success-text');
      if (successText) {
        successText.textContent = `Thank you, ${guestName}! Your response has been saved. We look forward to celebrating together! ❤️`;
      }
      rsvpForm.classList.add('hidden');
      if (rsvpSuccess) rsvpSuccess.classList.remove('hidden');
      triggerParticleBurst(40);
    });
  }

  // Google Maps Directions
  const mapsBtn = document.getElementById('btn-get-directions');
  if (mapsBtn && cfg.googleMapsUrl) {
    mapsBtn.href = cfg.googleMapsUrl;
  }

  // Add to Calendar Generator (.ics file)
  const calendarBtn = document.getElementById('btn-add-calendar');
  if (calendarBtn) {
    calendarBtn.addEventListener('click', () => {
      downloadICSFile(cfg);
    });
  }
}

function downloadICSFile(cfg) {
  const eventDate = new Date(cfg.eventDateISO || "2026-11-20T19:00:00");
  const endDate = new Date(eventDate.getTime() + (4 * 60 * 60 * 1000)); // +4 hours

  const formatDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Our Romantic Anniversary Invitation//EN',
    'BEGIN:VEVENT',
    `SUMMARY:Anniversary Celebration — ${cfg.coupleTitle || "Alexander & Sophia"}`,
    `DESCRIPTION:${cfg.invitationTitle}. ${cfg.heroSubtitle}`,
    `LOCATION:${cfg.venueName}, ${cfg.venueAddress}`,
    `DTSTART:${formatDate(eventDate)}`,
    `DTEND:${formatDate(endDate)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'anniversary-invitation.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ==========================================================================
   10. COUNTDOWN TIMER
   ========================================================================== */
function initCountdown(targetISO) {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');
  const displayEl = document.getElementById('timer-display');
  const passedEl = document.getElementById('countdown-passed');

  const targetTime = new Date(targetISO).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const difference = targetTime - now;

    if (difference <= 0) {
      if (displayEl) displayEl.classList.add('hidden');
      if (passedEl) passedEl.classList.remove('hidden');
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   11. REPLAY STORY BUTTON
   ========================================================================== */
function initReplayButton() {
  const replayBtn = document.getElementById('btn-replay-story');
  const envelopeScreen = document.getElementById('envelope-screen');
  const envelopeWrapper = document.getElementById('envelope-wrapper');

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => {
        if (envelopeWrapper) envelopeWrapper.classList.remove('open');
        if (envelopeScreen) envelopeScreen.classList.remove('fade-out');
        document.body.classList.add('lock-scroll');
      }, 500);
    });
  }
}
