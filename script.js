/* ==========================================================================
   LUXURY WALIMA INVITATION — INTERACTIVE JAVASCRIPT
   Complete rewrite with grand entrance, scratch card, circular countdown,
   particle effects, confetti, and all interactive features.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ------------------------------------------------------------------
       CONFIGURATION — Single source of truth for all invitation details
       ------------------------------------------------------------------ */
    const CONFIG = {
        bride: 'Zaryab',
        groom: 'Abu Bakar',
        brideParents: 'Mr. & Mrs. Tariq Malik',
        groomParents: 'Mr. & Mrs. Farooq Siddiqui',
        event: 'Walima Reception',
        date: 'Saturday, December 19, 2026',
        guestArrival: '7:30 PM',
        dinner: '8:30 PM',
        venue: 'The Royale Palace Banquet',
        venueAddress: 'Main Clifton / Karsaz',
        location: 'Karachi, Pakistan',
        rsvpContact: '+92 300 1234567',
        // Walima at 7:30 PM PKT (UTC+5) → December 19, 2026
        eventDateISO: '2026-12-19T19:30:00+05:00',
        mapsUrl: 'https://maps.google.com/?q=The+Royale+Palace+Banquet+Clifton+Karachi+Pakistan',
        hashtag: '#ZaryabWedsAbuBakar'
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ------------------------------------------------------------------
       1. FLOATING PARTICLE CANVAS — Gold dust / petal background
       ------------------------------------------------------------------ */
    const particleCanvas = document.getElementById('particleCanvas');
    const pCtx = particleCanvas ? particleCanvas.getContext('2d') : null;
    let particles = [];
    const PARTICLE_COUNT = 40;

    function initParticles() {
        if (!particleCanvas || !pCtx || prefersReducedMotion) return;

        function resize() {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        // Create particles
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * particleCanvas.width,
                y: Math.random() * particleCanvas.height,
                size: Math.random() * 2.5 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: Math.random() * 0.4 + 0.1,
                opacity: Math.random() * 0.5 + 0.1,
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.02 + 0.005
            });
        }

        function animateParticles() {
            pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

            particles.forEach(p => {
                p.wobble += p.wobbleSpeed;
                p.x += p.speedX + Math.sin(p.wobble) * 0.3;
                p.y += p.speedY;

                // Wrap around
                if (p.y > particleCanvas.height + 10) {
                    p.y = -10;
                    p.x = Math.random() * particleCanvas.width;
                }
                if (p.x > particleCanvas.width + 10) p.x = -10;
                if (p.x < -10) p.x = particleCanvas.width + 10;

                pCtx.beginPath();
                pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                pCtx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
                pCtx.fill();

                // Subtle glow
                pCtx.beginPath();
                pCtx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                pCtx.fillStyle = `rgba(212, 175, 55, ${p.opacity * 0.1})`;
                pCtx.fill();
            });

            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    initParticles();


    /* ------------------------------------------------------------------
       2. GRAND ENTRANCE — 3D Door Opening Animation
       ------------------------------------------------------------------ */
    const grandEntrance = document.getElementById('grandEntrance');
    const mainContent = document.getElementById('mainContent');
    const openInviteBtn = document.getElementById('openInviteBtn');
    const musicControl = document.getElementById('musicControl');
    const sparkleCanvas = document.getElementById('sparkleCanvas');
    const sparkleCtx = sparkleCanvas ? sparkleCanvas.getContext('2d') : null;

    function createSparkles() {
        if (!sparkleCanvas || !sparkleCtx || prefersReducedMotion) return;

        sparkleCanvas.width = window.innerWidth;
        sparkleCanvas.height = window.innerHeight;

        const sparkles = [];
        const centerX = sparkleCanvas.width / 2;
        const centerY = sparkleCanvas.height / 2;

        for (let i = 0; i < 60; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            sparkles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 3 + 1,
                opacity: 1,
                decay: Math.random() * 0.02 + 0.01,
                color: Math.random() > 0.5 ? '212, 175, 55' : '232, 201, 103'
            });
        }

        function animateSparkles() {
            sparkleCtx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
            let alive = false;

            sparkles.forEach(s => {
                if (s.opacity <= 0) return;
                alive = true;

                s.x += s.vx;
                s.y += s.vy;
                s.vy += 0.05; // gravity
                s.opacity -= s.decay;

                sparkleCtx.beginPath();
                sparkleCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                sparkleCtx.fillStyle = `rgba(${s.color}, ${Math.max(0, s.opacity)})`;
                sparkleCtx.fill();

                // Glowing trail
                sparkleCtx.beginPath();
                sparkleCtx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2);
                sparkleCtx.fillStyle = `rgba(${s.color}, ${Math.max(0, s.opacity * 0.2)})`;
                sparkleCtx.fill();
            });

            if (alive) {
                requestAnimationFrame(animateSparkles);
            }
        }

        animateSparkles();
    }

    function openInvitation() {
        if (!grandEntrance || !mainContent) return;
        if (!mainContent.classList.contains('hidden')) return;

        // 1. Sparkle burst from center
        createSparkles();

        // 2. Animate doors open
        grandEntrance.classList.add('opened');

        // 3. After doors are mostly open, show main content
        setTimeout(() => {
            mainContent.classList.remove('hidden');
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'scale(0.97)';
            mainContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            requestAnimationFrame(() => {
                mainContent.style.opacity = '1';
                mainContent.style.transform = 'scale(1)';
            });

            // Show music control
            if (musicControl) {
                setTimeout(() => musicControl.classList.add('visible'), 300);
            }

            tryPlayMusic();
            triggerScrollObserver();
        }, 800);

        // 4. Fade out entrance completely
        setTimeout(() => {
            grandEntrance.classList.add('fade-out');
        }, 600);

        // 5. Remove from DOM after all transitions
        setTimeout(() => {
            grandEntrance.style.display = 'none';
            document.body.style.overflow = '';
        }, 2400);
    }

    if (openInviteBtn) {
        openInviteBtn.addEventListener('click', openInvitation);
        openInviteBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openInvitation(); }
        });
    }

    // Prevent scroll while entrance is visible
    if (grandEntrance && !grandEntrance.classList.contains('opened')) {
        document.body.style.overflow = 'hidden';
    }


    /* ------------------------------------------------------------------
       3. BACKGROUND MUSIC (assets/sound/bkw.mp3)
       ------------------------------------------------------------------ */
    const bgAudio = document.getElementById('bgAudio');
    const musicToggle = document.getElementById('musicToggle');
    let isPlaying = false;
    const DEFAULT_VOLUME = 0.2;

    if (bgAudio) bgAudio.volume = DEFAULT_VOLUME;

    function tryPlayMusic() {
        if (isPlaying || !bgAudio) return;
        bgAudio.volume = DEFAULT_VOLUME;
        const p = bgAudio.play();
        if (p !== undefined) {
            p.then(() => {
                isPlaying = true;
                updateMusicUI(true);
            }).catch(() => {
                enablePlayOnInteraction();
            });
        }
    }

    function enablePlayOnInteraction() {
        if (!bgAudio || isPlaying) return;
        const events = ['click', 'touchstart', 'scroll', 'keydown'];
        const handler = () => {
            if (!isPlaying && bgAudio) {
                bgAudio.play().then(() => {
                    isPlaying = true;
                    updateMusicUI(true);
                }).catch(() => { /* ignore */ });
            }
            events.forEach(evt => document.removeEventListener(evt, handler, { passive: true }));
        };
        events.forEach(evt => document.addEventListener(evt, handler, { passive: true }));
    }

    function toggleMusic() {
        if (!bgAudio) return;
        if (isPlaying) {
            bgAudio.pause();
            isPlaying = false;
            updateMusicUI(false);
        } else {
            bgAudio.volume = DEFAULT_VOLUME;
            bgAudio.play().then(() => {
                isPlaying = true;
                updateMusicUI(true);
            }).catch(() => { /* ignore */ });
        }
    }

    function updateMusicUI(playing) {
        if (!musicToggle) return;
        musicToggle.classList.toggle('playing', playing);
        musicToggle.setAttribute('aria-pressed', String(playing));
    }

    if (musicToggle) musicToggle.addEventListener('click', toggleMusic);


    /* ------------------------------------------------------------------
       4. CIRCULAR COUNTDOWN TIMER
       ------------------------------------------------------------------ */
    const eventTime = new Date(CONFIG.eventDateISO).getTime();
    const CIRCUMFERENCE = 2 * Math.PI * 52; // ring radius = 52

    function updateCountdown() {
        const now = Date.now();
        const diff = eventTime - now;
        const timerEl = document.getElementById('countdownTimer');
        if (!timerEl) return;

        if (diff <= 0) {
            timerEl.innerHTML = '<p class="countdown-ended">The celebration has begun!</p>';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

        // Update ring progress
        const ringDays = document.getElementById('ringDays');
        const ringHours = document.getElementById('ringHours');
        const ringMinutes = document.getElementById('ringMinutes');
        const ringSeconds = document.getElementById('ringSeconds');

        // Calculate remaining fraction for each (max 365 days)
        const totalDaysMax = 365;
        if (ringDays) ringDays.style.strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * Math.min(days / totalDaysMax, 1));
        if (ringHours) ringHours.style.strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * (hours / 24));
        if (ringMinutes) ringMinutes.style.strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * (minutes / 60));
        if (ringSeconds) ringSeconds.style.strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * (seconds / 60));
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();


    /* ------------------------------------------------------------------
       5. SCRATCH TO REVEAL DATE CARD
       ------------------------------------------------------------------ */
    const scratchCanvas = document.getElementById('scratchCard');
    const scratchContainer = document.getElementById('scratchContainer');
    let scratchCtx = null;
    let isScratching = false;
    let scratchRevealed = false;

    function initScratchCard() {
        if (!scratchCanvas || !scratchContainer) return;

        scratchCtx = scratchCanvas.getContext('2d');
        const rect = scratchContainer.getBoundingClientRect();
        scratchCanvas.width = rect.width;
        scratchCanvas.height = rect.height;

        // Draw the gold metallic cover
        drawScratchCover();

        // Event listeners
        scratchCanvas.addEventListener('mousedown', startScratch);
        scratchCanvas.addEventListener('mousemove', doScratch);
        scratchCanvas.addEventListener('mouseup', endScratch);
        scratchCanvas.addEventListener('mouseleave', endScratch);

        scratchCanvas.addEventListener('touchstart', startScratch, { passive: false });
        scratchCanvas.addEventListener('touchmove', doScratch, { passive: false });
        scratchCanvas.addEventListener('touchend', endScratch);
    }

    function drawScratchCover() {
        if (!scratchCtx) return;
        const w = scratchCanvas.width;
        const h = scratchCanvas.height;

        // Metallic gold gradient
        const gradient = scratchCtx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, '#C5A046');
        gradient.addColorStop(0.25, '#E8C967');
        gradient.addColorStop(0.5, '#D4AF37');
        gradient.addColorStop(0.75, '#B8942D');
        gradient.addColorStop(1, '#C5A046');
        scratchCtx.fillStyle = gradient;
        scratchCtx.fillRect(0, 0, w, h);

        // Add shimmer sparkle dots
        for (let i = 0; i < 80; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const size = Math.random() * 2 + 0.5;
            const alpha = Math.random() * 0.5 + 0.2;
            scratchCtx.beginPath();
            scratchCtx.arc(x, y, size, 0, Math.PI * 2);
            scratchCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            scratchCtx.fill();
        }

        // Subtle diamond/crosshatch pattern
        scratchCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        scratchCtx.lineWidth = 0.5;
        for (let i = -h; i < w + h; i += 20) {
            scratchCtx.beginPath();
            scratchCtx.moveTo(i, 0);
            scratchCtx.lineTo(i + h, h);
            scratchCtx.stroke();
            scratchCtx.beginPath();
            scratchCtx.moveTo(i + h, 0);
            scratchCtx.lineTo(i, h);
            scratchCtx.stroke();
        }

        // Text
        scratchCtx.fillStyle = 'rgba(13, 27, 42, 0.7)';
        scratchCtx.font = `600 ${Math.min(w * 0.04, 16)}px 'Plus Jakarta Sans', sans-serif`;
        scratchCtx.textAlign = 'center';
        scratchCtx.textBaseline = 'middle';
        scratchCtx.fillText('✨  Scratch here to reveal the date  ✨', w / 2, h / 2);
    }

    function getPosition(e) {
        const rect = scratchCanvas.getBoundingClientRect();
        if (e.touches && e.touches.length > 0) {
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

    function startScratch(e) {
        if (scratchRevealed) return;
        e.preventDefault();
        isScratching = true;
        const pos = getPosition(e);
        scratch(pos.x, pos.y);
    }

    function doScratch(e) {
        if (!isScratching || scratchRevealed) return;
        e.preventDefault();
        const pos = getPosition(e);
        scratch(pos.x, pos.y);
    }

    function endScratch() {
        isScratching = false;
        if (!scratchRevealed) {
            checkScratchProgress();
        }
    }

    function scratch(x, y) {
        if (!scratchCtx) return;
        scratchCtx.globalCompositeOperation = 'destination-out';
        scratchCtx.beginPath();
        scratchCtx.arc(x, y, 22, 0, Math.PI * 2);
        scratchCtx.fill();

        // Extra softness
        scratchCtx.beginPath();
        scratchCtx.arc(x, y, 30, 0, Math.PI * 2);
        const grad = scratchCtx.createRadialGradient(x, y, 10, x, y, 30);
        grad.addColorStop(0, 'rgba(0,0,0,1)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        scratchCtx.fillStyle = grad;
        scratchCtx.fill();

        scratchCtx.globalCompositeOperation = 'source-over';
    }

    function checkScratchProgress() {
        if (!scratchCtx || scratchRevealed) return;
        const imageData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
        const pixels = imageData.data;
        let transparent = 0;
        const total = pixels.length / 4;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] < 128) transparent++;
        }

        const percent = (transparent / total) * 100;

        if (percent >= 50) {
            revealScratchCard();
        }
    }

    function revealScratchCard() {
        scratchRevealed = true;

        // Dissolve remaining cover with animation
        scratchCanvas.style.transition = 'opacity 0.8s ease';
        scratchCanvas.style.opacity = '0';

        setTimeout(() => {
            scratchCanvas.style.display = 'none';
        }, 800);

        // Fire confetti!
        fireConfetti();
    }


    /* ------------------------------------------------------------------
       6. GOLD CONFETTI BURST
       ------------------------------------------------------------------ */
    const confettiCanvas = document.getElementById('confettiCanvas');
    let confettiCtx = null;

    function fireConfetti() {
        if (!confettiCanvas || prefersReducedMotion) return;
        confettiCtx = confettiCanvas.getContext('2d');
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
        confettiCanvas.classList.add('active');

        const confettiPieces = [];
        const colors = [
            '#D4AF37', '#E8C967', '#B8942D', '#C5A046',
            '#FAF7F0', '#F5EFE0', '#FFD700'
        ];

        for (let i = 0; i < 120; i++) {
            confettiPieces.push({
                x: confettiCanvas.width / 2 + (Math.random() - 0.5) * 200,
                y: confettiCanvas.height * 0.5,
                vx: (Math.random() - 0.5) * 12,
                vy: Math.random() * -14 - 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                width: Math.random() * 8 + 4,
                height: Math.random() * 6 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: 1,
                gravity: 0.25 + Math.random() * 0.1,
                drag: 0.98 + Math.random() * 0.01
            });
        }

        function animateConfetti() {
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            let alive = false;

            confettiPieces.forEach(c => {
                if (c.opacity <= 0) return;
                alive = true;

                c.vy += c.gravity;
                c.vx *= c.drag;
                c.x += c.vx;
                c.y += c.vy;
                c.rotation += c.rotationSpeed;
                c.opacity -= 0.005;

                if (c.y > confettiCanvas.height + 20) {
                    c.opacity = 0;
                    return;
                }

                confettiCtx.save();
                confettiCtx.translate(c.x, c.y);
                confettiCtx.rotate((c.rotation * Math.PI) / 180);
                confettiCtx.globalAlpha = Math.max(0, c.opacity);
                confettiCtx.fillStyle = c.color;
                confettiCtx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height);
                confettiCtx.restore();
            });

            if (alive) {
                requestAnimationFrame(animateConfetti);
            } else {
                confettiCanvas.classList.remove('active');
            }
        }

        animateConfetti();
    }


    /* ------------------------------------------------------------------
       7. SCROLL REVEAL OBSERVER
       ------------------------------------------------------------------ */
    function triggerScrollObserver() {
        const fadeElements = document.querySelectorAll('.fade-in');
        if (!fadeElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        fadeElements.forEach(el => observer.observe(el));

        // Also init scratch card when it comes into view
        const scratchObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initScratchCard();
                    scratchObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        if (scratchContainer) {
            scratchObs.observe(scratchContainer);
        }
    }


    /* ------------------------------------------------------------------
       8. NAVBAR SCROLL STATE + PARALLAX
       ------------------------------------------------------------------ */
    const navbar = document.getElementById('navbar');
    const heroImg = document.querySelector('.hero-img');
    const backToTop = document.getElementById('backToTop');

    let ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;

            // Navbar
            if (navbar) navbar.classList.toggle('scrolled', y > 60);

            // Hero parallax
            if (heroImg && !prefersReducedMotion) {
                heroImg.style.transform = `translateY(${y * 0.25}px) scale(1.08)`;
            }

            // Back to top
            if (backToTop) {
                backToTop.classList.toggle('visible', y > 500);
            }

            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    /* ------------------------------------------------------------------
       9. MOBILE NAVIGATION TOGGLE
       ------------------------------------------------------------------ */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        const closeNav = () => {
            navLinks.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        };

        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                closeNav();
            }
        });
    }


    /* ------------------------------------------------------------------
       10. RSVP FORM — with Guest Counter, Validation & Toast
       ------------------------------------------------------------------ */
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSubmitBtn = document.getElementById('rsvpSubmitBtn');
    const rsvpConfirmation = document.getElementById('rsvpConfirmation');
    const confirmationText = document.getElementById('confirmationText');
    const rsvpToast = document.getElementById('rsvpToast');
    const toastMessage = document.getElementById('toastMessage');

    // Guest counter
    const guestCountInput = document.getElementById('guestCount');
    const guestMinus = document.getElementById('guestMinus');
    const guestPlus = document.getElementById('guestPlus');

    if (guestMinus && guestPlus && guestCountInput) {
        guestMinus.addEventListener('click', () => {
            let val = parseInt(guestCountInput.value) || 1;
            if (val > 1) {
                guestCountInput.value = val - 1;
            }
        });

        guestPlus.addEventListener('click', () => {
            let val = parseInt(guestCountInput.value) || 1;
            if (val < 10) {
                guestCountInput.value = val + 1;
            }
        });
    }

    function showToast(message, duration = 4000) {
        if (!rsvpToast || !toastMessage) return;
        toastMessage.textContent = message;
        rsvpToast.classList.add('show');
        setTimeout(() => {
            rsvpToast.classList.remove('show');
        }, duration);
    }

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear previous errors
            rsvpForm.querySelectorAll('.form-error').forEach(el => el.classList.remove('show'));
            rsvpForm.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));

            let isValid = true;

            // Validate name
            const nameInput = document.getElementById('guestName');
            if (!nameInput.value.trim()) {
                isValid = false;
                nameInput.classList.add('error');
                document.getElementById('guestNameError').classList.add('show');
            }

            // Validate attendance
            const attendance = rsvpForm.querySelector('input[name="attendance"]:checked');
            if (!attendance) {
                isValid = false;
                document.getElementById('attendanceError').classList.add('show');
            }

            if (!isValid) return;

            // Simulate submission
            rsvpSubmitBtn.classList.add('loading');
            rsvpSubmitBtn.disabled = true;

            setTimeout(() => {
                rsvpForm.classList.add('hidden');

                const guestName = nameInput.value.trim();
                const isAccepting = attendance.value === 'accept';
                const guestNum = guestCountInput ? guestCountInput.value : '1';

                if (isAccepting) {
                    confirmationText.textContent = `Thank you, ${guestName}! We're delighted you'll be joining us for the Walima Reception with ${guestNum} guest(s).`;
                    showToast(`🎉 RSVP confirmed for ${guestName} — ${guestNum} guest(s)!`);
                } else {
                    confirmationText.textContent = `Thank you, ${guestName}. We're sorry you won't be able to make it, but we appreciate your kind response.`;
                    showToast(`Thank you for your response, ${guestName}.`);
                }

                rsvpConfirmation.classList.remove('hidden');

                // Log to console for demo purposes
                console.log('RSVP Demo Submission:', {
                    name: guestName,
                    guests: guestNum,
                    attendance: attendance.value,
                    meal: document.getElementById('mealPref') ? document.getElementById('mealPref').value : '',
                    message: document.getElementById('guestMessage').value
                });
            }, 1500);
        });

        // Clear errors on input
        rsvpForm.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('error');
                const errorEl = input.parentElement.querySelector('.form-error');
                if (errorEl) errorEl.classList.remove('show');
            });
        });

        rsvpForm.querySelectorAll('input[name="attendance"]').forEach(radio => {
            radio.addEventListener('change', () => {
                document.getElementById('attendanceError').classList.remove('show');
            });
        });
    }


    /* ------------------------------------------------------------------
       11. SAVE THE DATE — ICS Calendar Download
       ------------------------------------------------------------------ */
    const saveTheDateBtn = document.getElementById('saveTheDateBtn');

    if (saveTheDateBtn) {
        saveTheDateBtn.addEventListener('click', () => {
            const startDate = '20261219T193000';
            const endDate = '20261219T230000';

            const icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//Walima Invitation//EN',
                'CALSCALE:GREGORIAN',
                'BEGIN:VEVENT',
                `DTSTART;TZID=Asia/Karachi:${startDate}`,
                `DTEND;TZID=Asia/Karachi:${endDate}`,
                `SUMMARY:${CONFIG.event} — ${CONFIG.bride} & ${CONFIG.groom}`,
                `DESCRIPTION:Walima Reception of ${CONFIG.bride} & ${CONFIG.groom}.\\nGuest Arrival: ${CONFIG.guestArrival}\\nDinner: ${CONFIG.dinner}\\nVenue: ${CONFIG.venue}\\nRSVP: ${CONFIG.rsvpContact}`,
                `LOCATION:${CONFIG.venue}\\, ${CONFIG.venueAddress}\\, ${CONFIG.location}`,
                'STATUS:CONFIRMED',
                'BEGIN:VALARM',
                'TRIGGER:-PT2H',
                'ACTION:DISPLAY',
                'DESCRIPTION:Walima Reception in 2 hours',
                'END:VALARM',
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\r\n');

            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'walima-reception-zaryab-abubakar.ics';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    }


    /* ------------------------------------------------------------------
       12. SMOOTH SCROLL for anchor links
       ------------------------------------------------------------------ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = navbar ? navbar.offsetHeight : 0;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


    /* ------------------------------------------------------------------
       13. WINDOW RESIZE HANDLER for Scratch Card
       ------------------------------------------------------------------ */
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (!scratchRevealed && scratchCtx && scratchContainer) {
                const rect = scratchContainer.getBoundingClientRect();
                scratchCanvas.width = rect.width;
                scratchCanvas.height = rect.height;
                drawScratchCover();
            }
        }, 300);
    });

});
