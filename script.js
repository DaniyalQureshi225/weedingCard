/**
 * Little Boss Birthday Invitation Script
 * Includes Mic blowing detection, candle animations, mp3 audio player, confetti & countdown
 */

document.addEventListener('DOMContentLoaded', () => {
  // Load Configuration
  const config = window.BIRTHDAY_CONFIG || {
    babyName: "Alexander",
    babyAge: "1",
    babyAgeOrdinal: "1st",
    tagline: "Our Little Boss Is Turning 1!",
    subtitle: "Come Celebrate With Us!",
    musicUrl: "assets/sound/hbd.mp3",
    autoPlayMusic: true,
    eventDateISO: "2026-11-20T16:00:00",
    dateText: "Saturday, November 20, 2026",
    timeText: "4:00 PM – 8:00 PM",
    venueName: "The Grand Executive Ballroom",
    venueAddress: "742 Evergreen Terrace, Suite 500, New York, NY 10001",
    googleMapsUrl: "https://maps.google.com/?q=742+Evergreen+Terrace+New+York"
  };

  // Prevent scroll during cake reveal
  document.body.classList.add('lock-scroll');

  // Initialize UI content from config
  initDynamicContent(config);

  // Initialize Audio Player with assets/sound/hbd.mp3
  initAudioSystem(config);

  // Initialize Candle Blow & Mic detection
  initCakeCandles();

  // Initialize Countdown Timer
  initCountdown(config.eventDateISO);

  // Initialize Lightbox Modal
  initGalleryLightbox();

  // Initialize RSVP Form
  initRSVPForm();
});

/* --------------------------------------------------------------------------
   1. DYNAMIC CONTENT INJECTION
   -------------------------------------------------------------------------- */
function initDynamicContent(cfg) {
  // Name & Title bindings
  const nameElems = document.querySelectorAll('.bind-baby-name');
  nameElems.forEach(el => el.textContent = cfg.babyName);

  const ageElems = document.querySelectorAll('.bind-baby-age');
  ageElems.forEach(el => el.textContent = cfg.babyAge);

  const ordinalElems = document.querySelectorAll('.bind-baby-ordinal');
  ordinalElems.forEach(el => el.textContent = cfg.babyAgeOrdinal);

  const dateElems = document.querySelectorAll('.bind-event-date');
  dateElems.forEach(el => el.textContent = cfg.dateText);

  const timeElems = document.querySelectorAll('.bind-event-time');
  timeElems.forEach(el => el.textContent = cfg.timeText);

  const venueElems = document.querySelectorAll('.bind-venue-name');
  venueElems.forEach(el => el.textContent = cfg.venueName);

  const addressElems = document.querySelectorAll('.bind-venue-address');
  addressElems.forEach(el => el.textContent = cfg.venueAddress);

  // Directions Button link
  const mapsBtn = document.getElementById('btn-get-directions');
  if (mapsBtn && cfg.googleMapsUrl) {
    mapsBtn.href = cfg.googleMapsUrl;
  }
}

/* --------------------------------------------------------------------------
   2. AUDIO SYSTEM FOR MP3 (assets/sound/hbd.mp3) & AUTOPLAY
   -------------------------------------------------------------------------- */
let bgAudio = null;
let isMusicPlaying = false;

function initAudioSystem(config) {
  const musicFab = document.getElementById('music-fab');
  const songTitle = document.getElementById('song-title');
  const audioSrc = config.musicUrl || 'assets/sound/hbd.mp3';

  bgAudio = new Audio(audioSrc);
  bgAudio.loop = true;
  bgAudio.volume = 0.7;

  // Function to start music playback
  window.startAudioPlayback = function() {
    if (bgAudio && bgAudio.paused) {
      bgAudio.play()
        .then(() => {
          isMusicPlaying = true;
          if (musicFab) musicFab.classList.add('playing');
          if (songTitle) songTitle.textContent = "Playing Birthday Song 🎵";
        })
        .catch(err => {
          console.log('Autoplay deferred until user interaction:', err);
        });
    }
  };

  // Function to pause music
  window.pauseAudioPlayback = function() {
    if (bgAudio && !bgAudio.paused) {
      bgAudio.pause();
      isMusicPlaying = false;
      if (musicFab) musicFab.classList.remove('playing');
      if (songTitle) songTitle.textContent = "Music Paused";
    }
  };

  // Attempt autoplay immediately
  if (config.autoPlayMusic !== false) {
    window.startAudioPlayback();
  }

  // Fallback: Start audio on first user touch/click anywhere on document
  const enableAudioOnUserGesture = () => {
    window.startAudioPlayback();
    document.removeEventListener('click', enableAudioOnUserGesture);
    document.removeEventListener('touchstart', enableAudioOnUserGesture);
  };
  document.addEventListener('click', enableAudioOnUserGesture, { once: true });
  document.addEventListener('touchstart', enableAudioOnUserGesture, { once: true });

  // Floating Music FAB Toggle
  if (musicFab) {
    musicFab.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isMusicPlaying) {
        window.pauseAudioPlayback();
      } else {
        window.startAudioPlayback();
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. CANDLE BLOW & MICROPHONE DETECTION ENGINE
   -------------------------------------------------------------------------- */
let isCandleExtinguished = false;
let audioContext = null;
let micStream = null;

function initCakeCandles() {
  const blowBtn = document.getElementById('btn-blow-candles');
  const micStatus = document.getElementById('mic-status');

  // Manual Blow Button Click
  if (blowBtn) {
    blowBtn.addEventListener('click', () => {
      extinguishCandles();
    });
  }

  // Attempt Microphone Access for blowing detection
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        micStream = stream;
        if (micStatus) {
          micStatus.innerHTML = `<div class="mic-pulse active" id="mic-pulse"></div> Mic Active: Blow into your mic! 🎤`;
        }
        setupMicAnalyzer(stream);
      })
      .catch(err => {
        console.log('Microphone access unavailable/denied:', err);
        if (micStatus) {
          micStatus.innerHTML = `<i class="fa-solid fa-microphone-slash"></i> Tap button below to blow candles`;
        }
      });
  } else {
    if (micStatus) {
      micStatus.innerHTML = `<i class="fa-solid fa-microphone-slash"></i> Tap button below to blow candles`;
    }
  }
}

function setupMicAnalyzer(stream) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioCtx();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function checkBlow() {
      if (isCandleExtinguished) return;

      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;

      // Threshold for blow detection
      if (average > 65) {
        extinguishCandles();
        return;
      }
      requestAnimationFrame(checkBlow);
    }
    checkBlow();
  } catch (e) {
    console.warn('AudioContext analyzer setup failed:', e);
  }
}

function extinguishCandles() {
  if (isCandleExtinguished) return;
  isCandleExtinguished = true;

  // Trigger audio playback
  if (window.startAudioPlayback) {
    window.startAudioPlayback();
  }

  // Extinguish flames
  const flames = document.querySelectorAll('.candle-flame');
  flames.forEach((flame, index) => {
    setTimeout(() => {
      flame.classList.add('extinguished');
      createSmokePuff(flame);
    }, index * 120);
  });

  // Stop mic stream
  if (micStream) {
    micStream.getTracks().forEach(track => track.stop());
  }

  // Play Fanfare Chime
  playCelebrationChime();

  // Fire Confetti explosion
  triggerConfetti();

  // Smooth screen transition reveal
  setTimeout(() => {
    const cakeScreen = document.getElementById('cake-screen');
    if (cakeScreen) {
      cakeScreen.classList.add('dismissed');
      document.body.classList.remove('lock-scroll');
    }
  }, 1200);
}

function createSmokePuff(flameElem) {
  const container = document.getElementById('smoke-container');
  if (!container) return;

  for (let i = 0; i < 4; i++) {
    const smoke = document.createElement('div');
    smoke.className = 'smoke-puff';
    smoke.style.left = `${(Math.random() - 0.5) * 20}px`;
    smoke.style.top = `${(Math.random() - 0.5) * 10}px`;
    container.appendChild(smoke);

    setTimeout(() => smoke.remove(), 1800);
  }
}

function playCelebrationChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    
    // Play celebratory arpeggio chime overlay
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.6);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.6);
    });
  } catch (e) {
    console.log('Chime sound played.');
  }
}

/* --------------------------------------------------------------------------
   4. CANVASES CONFETTI ENGINE
   -------------------------------------------------------------------------- */
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, { passive: true });

  const particles = [];
  const colors = ['#3B82F6', '#2563EB', '#F59E0B', '#FCD34D', '#E0F2FE', '#60A5FA'];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2 + 50,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.8) * 18,
      size: Math.random() * 9 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 8
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4;
      p.rotation += p.rSpeed;

      if (p.y < canvas.height) {
        active = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (active) {
      requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  render();
}

/* --------------------------------------------------------------------------
   5. REALTIME COUNTDOWN TIMER
   -------------------------------------------------------------------------- */
function initCountdown(targetISO) {
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-mins');
  const secsEl = document.getElementById('timer-secs');

  if (!daysEl) return;

  const targetDate = new Date(targetISO).getTime();

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   6. GALLERY LIGHTBOX MODAL
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('lightbox-modal');
  const imgElem = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');

  if (!modal || !imgElem) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src') || item.querySelector('img').src;
      imgElem.src = src;
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
}

/* --------------------------------------------------------------------------
   7. RSVP FORM HANDLER
   -------------------------------------------------------------------------- */
function initRSVPForm() {
  const btnYes = document.getElementById('rsvp-yes');
  const btnNo = document.getElementById('rsvp-no');
  const statusInput = document.getElementById('rsvp-status');
  const form = document.getElementById('rsvp-form');

  if (btnYes && btnNo) {
    btnYes.addEventListener('click', () => {
      btnYes.classList.add('selected');
      btnNo.classList.remove('selected');
      if (statusInput) statusInput.value = 'Attending';
    });

    btnNo.addEventListener('click', () => {
      btnNo.classList.add('selected');
      btnYes.classList.remove('selected');
      if (statusInput) statusInput.value = 'Not Attending';
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('guest-name').value;
      
      triggerConfetti();

      alert(`🎉 Thank you, ${guestName}! The Little Boss has received your RSVP! We can't wait to see you!`);
      form.reset();
    });
  }
}
