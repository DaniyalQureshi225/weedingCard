/**
 * Zaryab & Abu Bakar — Pakistani Mehndi Celebration Invitation
 * Interactive Dholki Entrance (3-Beat Dhol), Heart Scratch Date Reveal, Petal Burst Canvas, & Audio
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. WEB AUDIO SYNTH — REALISTIC DHOL DRUM BEAT GENERATOR
       ========================================================================== */
    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playDholBeatSound() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const now = ctx.currentTime;

            // 1. Low Resonant Bass Dholki Drum (Dagga Hit)
            const oscBass = ctx.createOscillator();
            const gainBass = ctx.createGain();

            oscBass.type = 'sine';
            oscBass.frequency.setValueAtTime(140, now);
            oscBass.frequency.exponentialRampToValueAtTime(40, now + 0.28);

            gainBass.gain.setValueAtTime(1.0, now);
            gainBass.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

            oscBass.connect(gainBass);
            gainBass.connect(ctx.destination);

            oscBass.start(now);
            oscBass.stop(now + 0.28);

            // 2. High Treble Stroke (Chanti Snap)
            const oscTreble = ctx.createOscillator();
            const gainTreble = ctx.createGain();

            oscTreble.type = 'triangle';
            oscTreble.frequency.setValueAtTime(450, now);
            oscTreble.frequency.exponentialRampToValueAtTime(120, now + 0.12);

            gainTreble.gain.setValueAtTime(0.7, now);
            gainTreble.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            oscTreble.connect(gainTreble);
            gainTreble.connect(ctx.destination);

            oscTreble.start(now);
            oscTreble.stop(now + 0.12);
        } catch (err) {
            console.warn('Audio synth warning:', err);
        }
    }


    /* ==========================================================================
       2. BEAT THE DHOL 3 TIMES — ENTRANCE INTERACTION
       ========================================================================== */
    function initDholOpening() {
        const dholOpening = document.getElementById('dholOpening');
        const mainContent = document.getElementById('mainContent');
        const dholDrum = document.getElementById('dholDrum');
        const beatCounterText = document.getElementById('beatCounterText');
        const dholInstruction = document.getElementById('dholInstruction');
        const dholDirectOpenBtn = document.getElementById('dholDirectOpenBtn');
        const bgAudio = document.getElementById('bgAudio');

        if (!dholOpening || !dholDrum) return;

        let hitCount = 0;
        const requiredHits = 3;
        let isOpening = false;

        function triggerHitEffect(e) {
            if (isOpening) return;

            // Safe audio initialization on user gesture
            getAudioContext();
            if (bgAudio && bgAudio.paused) {
                bgAudio.play().then(() => {
                    const musicToggle = document.getElementById('musicToggle');
                    if (musicToggle) musicToggle.setAttribute('aria-pressed', 'true');
                }).catch(() => {});
            }

            hitCount++;

            // Play Synth Dhol Beat
            playDholBeatSound();

            // Trigger Shake / Pulse animation
            dholDrum.classList.remove('hit-pulse');
            void dholDrum.offsetWidth; // Force reflow
            dholDrum.classList.add('hit-pulse');

            // Update Indicator Dots
            const dot = document.querySelector(`.beat-dot[data-step="${hitCount}"]`);
            if (dot) {
                dot.classList.add('hit');
            }

            // Particle impact burst at click/tap coordinate
            let clickX = window.innerWidth / 2;
            let clickY = window.innerHeight / 2;
            if (e && e.clientX) {
                clickX = e.clientX;
                clickY = e.clientY;
            } else if (e && e.touches && e.touches[0]) {
                clickX = e.touches[0].clientX;
                clickY = e.touches[0].clientY;
            }
            triggerPetalBurstAt(clickX, clickY);

            // Update Text Counter
            if (beatCounterText) {
                beatCounterText.textContent = `Dhol Beats: ${hitCount} / ${requiredHits}`;
            }

            if (hitCount >= requiredHits) {
                isOpening = true;
                if (dholInstruction) {
                    dholInstruction.textContent = "✨ Dhol Beats Complete! Welcome! ✨";
                }

                // Celebratory Confetti & Petals
                triggerConfetti();
                triggerPetalBurst();

                setTimeout(() => {
                    revealMainInvitation();
                }, 600);
            }
        }

        function revealMainInvitation() {
            if (!mainContent) return;

            dholOpening.style.opacity = '0';
            dholOpening.style.visibility = 'hidden';

            setTimeout(() => {
                dholOpening.classList.add('hidden');
                mainContent.classList.remove('hidden');

                // Initialize animations and interactive elements inside main content
                initParticleBackground();
                initScratchCard();
                initScrollReveal();
                initCountdownTimer();
            }, 750);
        }

        // Pointer & Keyboard Event Listeners for Dhol
        dholDrum.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            triggerHitEffect(e);
        });

        dholDrum.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerHitEffect(e);
            }
        });

        if (dholDirectOpenBtn) {
            dholDirectOpenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                getAudioContext();
                revealMainInvitation();
            });
        }
    }


    /* ==========================================================================
       3. PETAL BURST & CONFETTI EFFECTS
       ========================================================================== */
    function triggerPetalBurstAt(x, y) {
        const canvas = document.getElementById('petalBurst');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const petals = [];
        const colors = ['#FAE607', '#F9B800', '#F78B00', '#A92385', '#459951', '#FFFDF2'];

        for (let i = 0; i < 28; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 8;
            petals.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                radius: 4 + Math.random() * 8,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.2,
                opacity: 1
            });
        }

        let frameCount = 0;
        function animateBurst() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;

            petals.forEach(p => {
                if (p.opacity > 0.02) {
                    alive = true;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.15; // Gravity
                    p.opacity -= 0.025;
                    p.rotation += p.rotSpeed;

                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation);
                    ctx.globalAlpha = Math.max(0, p.opacity);
                    ctx.fillStyle = p.color;

                    ctx.beginPath();
                    ctx.ellipse(0, 0, p.radius, p.radius * 0.6, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            });

            frameCount++;
            if (alive && frameCount < 60) {
                requestAnimationFrame(animateBurst);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        animateBurst();
    }

    function triggerConfetti() {
        const canvas = document.getElementById('confettiCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#FAE607', '#F9B800', '#F78B00', '#A92385', '#459951', '#FFFFFF'];

        for (let i = 0; i < 90; i++) {
            pieces.push({
                x: Math.random() * canvas.width,
                y: -20 - Math.random() * 100,
                size: 6 + Math.random() * 8,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: 2 + Math.random() * 5,
                speedX: (Math.random() - 0.5) * 3,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10
            });
        }

        let duration = 0;
        function renderConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            duration++;

            pieces.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotSpeed;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            });

            if (duration < 140) {
                requestAnimationFrame(renderConfetti);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        renderConfetti();
    }

    function triggerPetalBurst() {
        triggerPetalBurstAt(window.innerWidth / 2, window.innerHeight / 3);
    }


    /* ==========================================================================
       4. PARTICLE CANVAS (FLOATING PETALS IN BACKGROUND)
       ========================================================================== */
    function initParticleBackground() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const petals = [];
        const colors = ['rgba(250,230,7,0.4)', 'rgba(249,184,0,0.4)', 'rgba(247,139,0,0.3)', 'rgba(169,35,133,0.25)', 'rgba(69,153,81,0.25)'];

        for (let i = 0; i < 35; i++) {
            petals.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 3 + Math.random() * 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: 0.4 + Math.random() * 1.2,
                speedX: (Math.random() - 0.5) * 0.8,
                angle: Math.random() * Math.PI * 2,
                spin: (Math.random() - 0.5) * 0.03
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            petals.forEach(p => {
                p.y += p.speedY;
                p.x += Math.sin(p.angle) * p.speedX;
                p.angle += p.spin;

                if (p.y > canvas.height + 20) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.ellipse(0, 0, p.radius, p.radius * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            requestAnimationFrame(animate);
        }
        animate();
    }


    /* ==========================================================================
       5. HEART-SHAPED SCRATCH DATE REVEAL CARD
       ========================================================================== */
    function initScratchCard() {
        const container = document.getElementById('scratchCardContainer');
        const wrapper = document.getElementById('scratchHeartWrapper');
        const canvas = document.getElementById('scratchCanvas');
        const instruction = document.getElementById('scratchInstruction');
        const completionMsg = document.getElementById('scratchCompletionMsg');

        if (!container || !wrapper || !canvas) return;

        const ctx = canvas.getContext('2d');
        let isScratching = false;
        let isRevealed = false;
        let lastX = 0;
        let lastY = 0;
        let checkThrottleTimeout = null;

        function resizeCanvas() {
            const rect = container.getBoundingClientRect();
            const w = Math.floor(rect.width);
            const h = Math.floor(rect.height);
            if (w === 0 || h === 0) return;

            canvas.width = w;
            canvas.height = h;

            if (!isRevealed) {
                renderScratchCover(w, h);
            }
        }

        function drawHeartPath(cCtx, x, y, width, height) {
            cCtx.beginPath();
            cCtx.moveTo(x + width * 0.5, y + height * 0.15);
            cCtx.bezierCurveTo(x + width * 0.35, y - height * 0.05, x, y + height * 0.1, x, y + height * 0.4);
            cCtx.bezierCurveTo(x, y + height * 0.65, x + width * 0.3, y + height * 0.85, x + width * 0.5, y + height * 0.98);
            cCtx.bezierCurveTo(x + width * 0.7, y + height * 0.85, x + width, y + height * 0.65, x + width, y + height * 0.4);
            cCtx.bezierCurveTo(x + width, y + height * 0.1, x + width * 0.65, y - height * 0.05, x + width * 0.5, y + height * 0.15);
            cCtx.closePath();
        }

        function renderScratchCover(w, h) {
            ctx.save();
            ctx.clearRect(0, 0, w, h);

            // Clip to heart shape
            drawHeartPath(ctx, 0, 0, w, h);
            ctx.clip();

            // Festive Golden Haldi Gradient
            const grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, '#FAE607');    // Haldi Yellow
            grad.addColorStop(0.35, '#F9B800'); // Golden Yellow
            grad.addColorStop(0.75, '#F78B00'); // Saffron Orange
            grad.addColorStop(1, '#A92385');    // Mehndi Magenta
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // Decorative rings
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(w * 0.5, h * 0.45, w * 0.25, 0, Math.PI * 2);
            ctx.stroke();

            // Scratch overlay text
            ctx.fillStyle = '#221404';
            ctx.font = `700 ${Math.max(13, w * 0.054)}px 'Plus Jakarta Sans', sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('✨ SCRATCH HERE ✨', w * 0.5, h * 0.42);

            ctx.fillStyle = '#459951';
            ctx.font = `600 italic ${Math.max(12, w * 0.044)}px 'Cormorant Garamond', serif`;
            ctx.fillText('To Reveal Our Wedding Date 💛', w * 0.5, h * 0.53);

            ctx.restore();
        }

        function getPos(e) {
            const rect = canvas.getBoundingClientRect();
            let clientX = e.clientX;
            let clientY = e.clientY;
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            }
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }

        function scratch(x, y) {
            if (isRevealed) return;
            const rect = canvas.getBoundingClientRect();
            const radius = Math.min(rect.width, rect.height) * 0.12;

            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();

            if (lastX && lastY) {
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(x, y);
                ctx.lineWidth = radius * 2;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
            }
            ctx.restore();

            lastX = x;
            lastY = y;

            throttledCheckScratchProgress();
        }

        function startScratch(e) {
            if (isRevealed) return;
            isScratching = true;
            const pos = getPos(e);
            lastX = pos.x;
            lastY = pos.y;
            scratch(pos.x, pos.y);
        }

        function moveScratch(e) {
            if (!isScratching || isRevealed) return;
            if (e.cancelable) e.preventDefault();
            const pos = getPos(e);
            scratch(pos.x, pos.y);
        }

        function stopScratch() {
            isScratching = false;
            lastX = 0;
            lastY = 0;
        }

        function throttledCheckScratchProgress() {
            if (checkThrottleTimeout) return;
            checkThrottleTimeout = setTimeout(() => {
                checkThrottleTimeout = null;
                checkScratchProgress();
            }, 100);
        }

        function checkScratchProgress() {
            if (isRevealed) return;
            const w = canvas.width;
            const h = canvas.height;
            if (w === 0 || h === 0) return;

            let totalHeartPoints = 0;
            let clearedPoints = 0;
            const sampleCanvas = document.createElement('canvas');
            sampleCanvas.width = 100;
            sampleCanvas.height = 100;
            const sCtx = sampleCanvas.getContext('2d');
            drawHeartPath(sCtx, 0, 0, 100, 100);

            const imgData = ctx.getImageData(0, 0, w, h).data;
            const stepX = Math.max(1, Math.floor(w / 35));
            const stepY = Math.max(1, Math.floor(h / 35));

            for (let y = 0; y < h; y += stepY) {
                for (let x = 0; x < w; x += stepX) {
                    if (sCtx.isPointInPath((x / w) * 100, (y / h) * 100)) {
                        totalHeartPoints++;
                        const index = (Math.floor(y) * w + Math.floor(x)) * 4;
                        const alpha = imgData[index + 3];
                        if (alpha < 60) {
                            clearedPoints++;
                        }
                    }
                }
            }

            if (totalHeartPoints > 0) {
                const ratio = clearedPoints / totalHeartPoints;
                if (ratio >= 0.5) {
                    revealDate();
                }
            }
        }

        function revealDate() {
            if (isRevealed) return;
            isRevealed = true;
            isScratching = false;

            const rect = canvas.getBoundingClientRect();
            ctx.clearRect(0, 0, rect.width, rect.height);
            wrapper.style.opacity = '0';
            setTimeout(() => { wrapper.style.display = 'none'; }, 400);

            if (instruction) instruction.classList.add('hidden');
            if (completionMsg) completionMsg.classList.remove('hidden');

            container.classList.add('bounce');
            triggerConfetti();
        }

        canvas.addEventListener('pointerdown', startScratch);
        window.addEventListener('pointermove', moveScratch, { passive: false });
        window.addEventListener('pointerup', stopScratch);
        window.addEventListener('pointercancel', stopScratch);

        canvas.addEventListener('touchstart', startScratch, { passive: false });
        canvas.addEventListener('touchmove', moveScratch, { passive: false });
        canvas.addEventListener('touchend', stopScratch);

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }


    /* ==========================================================================
       6. COUNTDOWN TIMER
       ========================================================================== */
    function initCountdownTimer() {
        const targetDate = new Date('2026-12-19T19:30:00+05:00').getTime();

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

        function updateTimer() {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                daysEl.textContent = '00';
                hoursEl.textContent = '00';
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            daysEl.textContent = String(days).padStart(2, '0');
            hoursEl.textContent = String(hours).padStart(2, '0');
            minutesEl.textContent = String(minutes).padStart(2, '0');
            secondsEl.textContent = String(seconds).padStart(2, '0');
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }


    /* ==========================================================================
       7. SCROLL REVEAL & NAVIGATION
       ========================================================================== */
    function initScrollReveal() {
        const fadeElements = document.querySelectorAll('.fade-in');
        const navbar = document.getElementById('navbar');
        const backToTop = document.getElementById('backToTop');
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');

        // Scroll Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        fadeElements.forEach(el => observer.observe(el));

        // Scroll Top / Navbar
        window.addEventListener('scroll', () => {
            if (window.scrollY > 150) {
                if (navbar) navbar.classList.add('scrolled');
                if (backToTop) backToTop.classList.add('show');
            } else {
                if (navbar) navbar.classList.remove('scrolled');
                if (backToTop) backToTop.classList.remove('show');
            }
        });

        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        const footerTopBtn = document.getElementById('footerTopBtn');
        if (footerTopBtn) {
            footerTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Mobile Nav Toggle
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navLinks.classList.toggle('active');
                const expanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !expanded);
            });

            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                });
            });
        }
    }


    /* ==========================================================================
       8. MUSIC PLAYER & INTERACTIVE DANCE STAGE
       ========================================================================== */
    function initMusicPlayer() {
        const bgAudio = document.getElementById('bgAudio');
        const musicToggle = document.getElementById('musicToggle');

        if (!bgAudio || !musicToggle) return;

        musicToggle.addEventListener('click', () => {
            getAudioContext();
            if (bgAudio.paused) {
                bgAudio.play().then(() => {
                    musicToggle.setAttribute('aria-pressed', 'true');
                }).catch(() => {});
            } else {
                bgAudio.pause();
                musicToggle.setAttribute('aria-pressed', 'false');
            }
        });
    }

    function initDanceFloor() {
        const feelTheBeatBtn = document.getElementById('feelTheBeatBtn');

        if (feelTheBeatBtn) {
            feelTheBeatBtn.addEventListener('click', (e) => {
                playDholBeatSound();
                triggerConfetti();
                triggerPetalBurstAt(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2);
            });
        }
    }


    /* ==========================================================================
       9. GALLERY LIGHTBOX MODAL
       ========================================================================== */
    function initGalleryLightbox() {
        const galleryGrid = document.getElementById('galleryGrid');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxPrev = document.getElementById('lightboxPrev');
        const lightboxNext = document.getElementById('lightboxNext');

        if (!galleryGrid || !lightbox || !lightboxImg) return;

        const items = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
        let currentIndex = 0;

        function openLightbox(index) {
            currentIndex = index;
            const img = items[currentIndex].querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
            }
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
        }

        items.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + items.length) % items.length;
                openLightbox(currentIndex);
            });
        }
        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % items.length;
                openLightbox(currentIndex);
            });
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }


    /* ==========================================================================
       10. RSVP FORM & GUEST COUNTER
       ========================================================================== */
    function initRsvpForm() {
        const rsvpForm = document.getElementById('rsvpForm');
        const guestMinus = document.getElementById('guestMinus');
        const guestPlus = document.getElementById('guestPlus');
        const guestCount = document.getElementById('guestCount');
        const rsvpConfirmation = document.getElementById('rsvpConfirmation');

        if (guestMinus && guestPlus && guestCount) {
            guestMinus.addEventListener('click', () => {
                let val = parseInt(guestCount.value, 10) || 1;
                if (val > 1) guestCount.value = val - 1;
            });

            guestPlus.addEventListener('click', () => {
                let val = parseInt(guestCount.value, 10) || 1;
                if (val < 10) guestCount.value = val + 1;
            });
        }

        if (rsvpForm) {
            rsvpForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const nameInput = document.getElementById('guestName');
                const nameGroup = nameInput ? nameInput.parentElement : null;

                if (!nameInput || !nameInput.value.trim()) {
                    if (nameGroup) nameGroup.classList.add('error');
                    return;
                }
                if (nameGroup) nameGroup.classList.remove('error');

                const btnText = rsvpForm.querySelector('.btn-text');
                const btnLoading = rsvpForm.querySelector('.btn-loading');

                if (btnText && btnLoading) {
                    btnText.classList.add('hidden');
                    btnLoading.classList.remove('hidden');
                }

                setTimeout(() => {
                    rsvpForm.classList.add('hidden');
                    if (rsvpConfirmation) rsvpConfirmation.classList.remove('hidden');
                    triggerConfetti();
                }, 800);
            });
        }

        const saveTheDateBtn = document.getElementById('saveTheDateBtn');
        if (saveTheDateBtn) {
            saveTheDateBtn.addEventListener('click', () => {
                const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//WebCardsByDQ//Mehndi Invitation//EN
BEGIN:VEVENT
SUMMARY:Mehndi Night Celebration - Zaryab & Abu Bakar
DESCRIPTION:Mehndi Celebration of Zaryab & Abu Bakar. Guest Arrival: 7:30 PM, Dinner: 8:30 PM.
LOCATION:The Royale Palace Banquet, Main Clifton, Karachi, Pakistan
DTSTART:20261219T143000Z
DTEND:20261219T180000Z
END:VEVENT
END:VCALENDAR`;
                const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.setAttribute('download', 'Mehndi-Zaryab-AbuBakar.ics');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }
    }


    /* ==========================================================================
       11. INITIALIZE ALL COMPONENTS
       ========================================================================== */
    initDholOpening();
    initMusicPlayer();
    initDanceFloor();
    initGalleryLightbox();
    initRsvpForm();

    // If dhol opening is already passed or hidden
    const mainContent = document.getElementById('mainContent');
    if (mainContent && !mainContent.classList.contains('hidden')) {
        initParticleBackground();
        initScratchCard();
        initScrollReveal();
        initCountdownTimer();
    }
});
