/* ==========================================================================
   RAPUNZEL ROYAL WEDDING — INTERACTIVE JAVASCRIPT
   Preserves every original feature (envelope, music, countdown, petals,
   scroll reveal, contact cards, hashtag copy) and adds enchanted effects:
   starfield, floating lanterns, hero parallax, lightbox, ripples, mobile nav.
   Supports Mehndi mode (?mehndi=true) with its own theme and scratch card.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ------------------------------------------------------------------
       MEHNDI MODE DETECTION (?mehndi=true)
       ------------------------------------------------------------------ */
    const params = new URLSearchParams(window.location.search);
    const isMehndi = params.get('mehndi') === 'true';

    if (isMehndi) {
        document.body.classList.add('mehndi-mode');
        const mehndiRoot = document.getElementById('mehndiRoot');
        if (mehndiRoot) mehndiRoot.classList.remove('hidden');
        // Hide wedding envelope + main content
        const envOvl = document.getElementById('envelopeOverlay');
        if (envOvl) envOvl.style.display = 'none';
    }

    /* ------------------------------------------------------------------
       MUSIC TRACK SELECTION — bkw1.mp3 for mehndi, bkw.mp3 otherwise
       ------------------------------------------------------------------ */
    const bgAudioEl = document.getElementById('bgAudio');
    if (bgAudioEl) {
        bgAudioEl.src = isMehndi
            ? 'assets/sound/bkw1.mp3'
            : 'assets/sound/bkw.mp3';
        bgAudioEl.load(); // reload with the new source
    }

    /* ------------------------------------------------------------------
       1. ENVELOPE UNSEAL / OPEN INVITATION
       ------------------------------------------------------------------ */
    const openInviteBtn = document.getElementById('openInviteBtn');
    const envelopeOverlay = document.getElementById('envelopeOverlay');
    const mainContent = document.getElementById('mainContent');

    const openInvitation = () => {
        if (mainContent.classList.contains('hidden') === false) return;
        envelopeOverlay.classList.add('opened');
        envelopeOverlay.setAttribute('aria-hidden', 'true');
        mainContent.classList.remove('hidden');

        tryPlayMusic();
        initPetalCanvas();
        initStarCanvas();
        spawnLanterns();
        initScratchCard();
        triggerScrollObserver();

        if (typeof confetti === 'function') {
            confetti({
                particleCount: 90,
                spread: 75,
                startVelocity: 34,
                origin: { y: 0.35 },
                colors: ['#FFD166', '#F4C430', '#C77DFF', '#7B2CBF', '#F9C5D5', '#ffffff']
            });
        }
    };

    if (openInviteBtn) {
        openInviteBtn.addEventListener('click', openInvitation);
        openInviteBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openInvitation(); }
        });
    }

    /* ------------------------------------------------------------------
       2. BACKGROUND MUSIC PLAYER (assets/sound/bkw.mp3, low volume)
       ------------------------------------------------------------------ */
    const bgAudio = document.getElementById('bgAudio');
    let isPlaying = false;
    const musicToggle = document.getElementById('musicToggle');
    const musicText = musicToggle ? musicToggle.querySelector('.music-text') : null;
    const musicPlayIcon = document.getElementById('musicPlayIcon');
    const musicPauseIcon = document.getElementById('musicPauseIcon');

    const DEFAULT_VOLUME = 0.15;

    if (bgAudio) {
        bgAudio.volume = DEFAULT_VOLUME;
    }

    function updateMusicIcons() {
        if (!musicToggle) return;
        const playing = musicToggle.classList.contains('playing');
        if (musicPlayIcon) musicPlayIcon.style.display = playing ? 'none' : 'block';
        if (musicPauseIcon) musicPauseIcon.style.display = playing ? 'block' : 'none';
    }

    // Attempt to start music; if blocked, set up one-time interaction listener
    function tryPlayMusic() {
        if (isPlaying || !bgAudio) return;
        bgAudio.volume = DEFAULT_VOLUME;
        const playPromise = bgAudio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                musicToggle.classList.add('playing');
                musicToggle.setAttribute('aria-pressed', 'true');
                if (musicText) musicText.textContent = 'Pause Music';
                updateMusicIcons();
            }).catch((e) => {
                console.log('Audio autoplay restricted:', e);
                enablePlayOnInteraction();
            });
        }
    }

    // Set up one-time interaction listener to start music on first user interaction
    function enablePlayOnInteraction() {
        if (!bgAudio || isPlaying) return;
        const events = ['click', 'touchstart', 'scroll', 'keydown'];
        const handler = () => {
            if (!isPlaying && bgAudio) {
                bgAudio.play().then(() => {
                    isPlaying = true;
                    musicToggle.classList.add('playing');
                    musicToggle.setAttribute('aria-pressed', 'true');
                    if (musicText) musicText.textContent = 'Pause Music';
                    updateMusicIcons();
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
            musicToggle.classList.remove('playing');
            musicToggle.setAttribute('aria-pressed', 'false');
            if (musicText) musicText.textContent = 'Play Music';
            updateMusicIcons();
        } else {
            bgAudio.volume = DEFAULT_VOLUME;
            bgAudio.play().then(() => {
                isPlaying = true;
                musicToggle.classList.add('playing');
                musicToggle.setAttribute('aria-pressed', 'true');
                if (musicText) musicText.textContent = 'Pause Music';
                updateMusicIcons();
            }).catch((e) => {
                console.log('Audio play restricted:', e);
            });
        }
    }

    if (musicToggle) musicToggle.addEventListener('click', toggleMusic);

    // Initialize mehndi features (after music vars are declared)
    if (isMehndi) {
        tryPlayMusic();
        // Also try to enable interaction handler immediately for mehndi mode
        enablePlayOnInteraction();
        initMehndiScratchCard();
        initMehndiPetals();
        triggerScrollObserver();
        initMehndiHashtagCopy();
    } else {
        // Wedding mode: start music after envelope opens
        // (handled by openInvitation calling tryPlayMusic)
    }

    // Ensure music icons are correct on initial load
    updateMusicIcons();

    /* ------------------------------------------------------------------
       3. COUNTDOWN TIMER (wedding: October 18, 2026, 7:30 PM)
       ------------------------------------------------------------------ */
    const weddingDate = new Date('October 18, 2026 19:30:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = weddingDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById('days').innerText = String(days).padStart(2, '0');
            document.getElementById('hours').innerText = String(hours).padStart(2, '0');
            document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
            document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
        } else {
            document.getElementById('countdownTimer').innerHTML = '<h3 class="event-name" style="color:var(--cream)">The Wedding Day is Here!</h3>';
        }
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    /* ------------------------------------------------------------------
       4. TWINKLING STARFIELD CANVAS
       ------------------------------------------------------------------ */
    function initStarCanvas() {
        const canvas = document.getElementById('starsCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let stars = [];
        let w, h;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const count = isMobile ? 55 : 110;
        stars = Array.from({ length: count }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.6 + 0.4,
            base: Math.random() * 0.7 + 0.25,
            speed: Math.random() * 1.6 + 0.6,
            phase: Math.random() * Math.PI * 2,
            color: Math.random() > 0.75 ? '255,209,102' : '255,255,255'
        }));

        let t = 0;
        function animate() {
            ctx.clearRect(0, 0, w, h);
            for (const s of stars) {
                const a = s.base + Math.sin(t * s.speed + s.phase) * 0.35;
                ctx.globalAlpha = Math.max(0.05, a);
                ctx.fillStyle = `rgba(${s.color},1)`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            }
            t += 0.02;
            requestAnimationFrame(animate);
        }
        animate();
    }

    /* ------------------------------------------------------------------
       5. FLOATING GOLDEN PETALS / MAGIC DUST CANVAS
       ------------------------------------------------------------------ */
    function initPetalCanvas() {
        const canvas = document.getElementById('petalCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const petalCount = isMobile ? 14 : 24;
        const petals = [];

        class Petal {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * -canvas.height;
                this.size = Math.random() * 8 + 5;
                this.speedY = Math.random() * 1.4 + 0.7;
                this.speedX = Math.random() * 1 - 0.5;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 2 - 1;
                this.opacity = Math.random() * 0.55 + 0.25;
                this.color = Math.random() > 0.5 ? '#F4C430' : (Math.random() > 0.5 ? '#C77DFF' : '#E9B8FF');
            }
            update() {
                this.y += this.speedY;
                this.x += Math.sin(this.y * 0.01) + this.speedX;
                this.rotation += this.rotationSpeed;
                if (this.y > canvas.height + 20) this.reset();
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-this.size, -this.size * 1.5, -this.size * 1.5, this.size, 0, this.size * 1.8);
                ctx.bezierCurveTo(this.size * 1.5, this.size, this.size, -this.size * 1.5, 0, 0);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < petalCount; i++) petals.push(new Petal());

        function animatePetals() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            petals.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animatePetals);
        }
        animatePetals();
    }

    /* ------------------------------------------------------------------
       6. FLOATING LANTERNS (global, envelope, footer)
       ------------------------------------------------------------------ */
    const LANTERN_SVG = `<svg viewBox="0 0 40 64" width="100%" height="100%" aria-hidden="true"><use href="#lantern-float"></use></svg>`;

    function spawnLanterns() {
        document.querySelectorAll('.floating-lanterns, .envelope-lanterns, .footer-lanterns').forEach((container, idx) => {
            if (container.dataset.spawned === 'true') return;
            container.dataset.spawned = 'true';

            const count = container.classList.contains('envelope-lanterns') ? 9
                : (container.classList.contains('footer-lanterns') ? 7 : 11);

            for (let i = 0; i < count; i++) {
                const lan = document.createElement('span');
                lan.className = 'lantern-float';
                lan.innerHTML = LANTERN_SVG;
                const size = Math.random() * 26 + 26;
                lan.style.width = size + 'px';
                lan.style.height = (size * 1.6) + 'px';
                lan.style.left = (Math.random() * 96) + 'vw';
                lan.style.opacity = String(Math.random() * 0.4 + 0.35);
                lan.style.animationDuration = (Math.random() * 20 + 22) + 's';
                lan.style.animationDelay = (-Math.random() * 40) + 's';
                container.appendChild(lan);
            }
        });
    }
    spawnLanterns(); // seed the ambient lanterns early

    /* ------------------------------------------------------------------
       7. SCROLL REVEAL OBSERVER
       ------------------------------------------------------------------ */
    function triggerScrollObserver() {
        const fadeElements = document.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        fadeElements.forEach(el => observer.observe(el));
    }

    /* ------------------------------------------------------------------
       8. HERO PARALLAX + NAVBAR SCROLL STATE
       ------------------------------------------------------------------ */
    const heroImg = document.querySelector('.hero-img');
    const navbar = document.getElementById('navbar');

    let ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            if (navbar) navbar.classList.toggle('scrolled', y > 40);
            if (heroImg && !prefersReducedMotion) {
                heroImg.style.transform = `translateY(${y * 0.28}px) scale(1.08)`;
            }
            ticking = false;
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

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
            if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) closeNav();
        });
    }

    /* ------------------------------------------------------------------
       10. BUTTON RIPPLE EFFECT
       ------------------------------------------------------------------ */
    document.querySelectorAll('.ripple').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const ink = document.createElement('span');
            ink.className = 'ripple-ink';
            ink.style.width = ink.style.height = size + 'px';
            ink.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ink.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(ink);
            setTimeout(() => ink.remove(), 750);
        });
    });

    /* ------------------------------------------------------------------
       11. GALLERY LIGHTBOX
       ------------------------------------------------------------------ */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    let currentIndex = 0;

    function updateLightbox() {
        const item = galleryItems[currentIndex];
        const img = item.querySelector('.gallery-img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = img.alt;
    }

    function openLightbox(index) {
        currentIndex = (index + galleryItems.length) % galleryItems.length;
        updateLightbox();
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lightboxClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (galleryItems.length) {
        galleryItems.forEach((item, i) => {
            const open = () => openLightbox(i);
            item.addEventListener('click', open);
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
            });
        });
    }

    if (lightbox) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', () => openLightbox(currentIndex - 1));
        lightboxNext.addEventListener('click', () => openLightbox(currentIndex + 1));
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
            if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
        });
    }

    /* ------------------------------------------------------------------
       12. HASHTAG COPY BAR
       ------------------------------------------------------------------ */
    const copyHashtagBtn = document.getElementById('copyHashtag');
    if (copyHashtagBtn) {
        copyHashtagBtn.addEventListener('click', () => {
            const hashtag = document.getElementById('hashtagText').innerText;
            navigator.clipboard.writeText(hashtag).then(() => {
                copyHashtagBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyHashtagBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
                }, 2000);
            }).catch(() => fallbackCopy(hashtag));
        });
    }

    /* ------------------------------------------------------------------
       13. GIFT BANK DETAILS COPY
       ------------------------------------------------------------------ */
    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) { /* ignore */ }
        document.body.removeChild(ta);
    }

    document.querySelectorAll('.copy-value-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.copy || '';
            const label = btn.querySelector('span');
            const icon = btn.querySelector('i');
            const done = () => {
                if (icon) icon.className = 'fas fa-check';
                if (label) label.textContent = 'Copied!';
                setTimeout(() => {
                    if (icon) icon.className = 'far fa-copy';
                    if (label) label.textContent = 'Copy Bank Details';
                }, 2200);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(done).catch(() => { fallbackCopy(text); done(); });
            } else {
                fallbackCopy(text);
                done();
            }
        });
    });

    /* ------------------------------------------------------------------
       14. WEDDING DATE SCRATCH & REVEAL CARD
       ------------------------------------------------------------------ */
    function initScratchCard() {
        const card = document.getElementById('scratchCard');
        const canvas = document.getElementById('scratchCanvas');
        if (!card || !canvas || card.dataset.inited === 'true') return;
        card.dataset.inited = 'true';

        const ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let w = 0, h = 0;
        let isScratching = false;
        let lastX = 0, lastY = 0;
        let revealed = false;
        let moveCount = 0;
        const segs = [];

        // Small offscreen canvas for cheap progress sampling
        const tmp = document.createElement('canvas');
        tmp.width = 40;
        tmp.height = 48;
        const tctx = tmp.getContext('2d');

        function drawFoil() {
            const g = ctx.createLinearGradient(0, 0, w, h);
            g.addColorStop(0, '#FFD166');
            g.addColorStop(0.5, '#F4C430');
            g.addColorStop(1, '#D4A017');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);

            const rg = ctx.createRadialGradient(w / 2, h * 0.28, 6, w / 2, h * 0.28, Math.max(w, h) * 0.7);
            rg.addColorStop(0, 'rgba(255,255,255,0.4)');
            rg.addColorStop(0.5, 'rgba(255,255,255,0.08)');
            rg.addColorStop(1, 'rgba(140,70,0,0.35)');
            ctx.fillStyle = rg;
            ctx.fillRect(0, 0, w, h);

            // Gold speckle texture
            for (let i = 0; i < 260; i++) {
                ctx.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.14 + 0.02) + ')';
                ctx.fillRect(Math.random() * w, Math.random() * h, 1.2, 1.2);
            }

            // Royal double frame
            ctx.strokeStyle = 'rgba(123,44,191,0.5)';
            ctx.lineWidth = 3;
            ctx.strokeRect(10, 10, w - 20, h - 20);
            ctx.strokeStyle = 'rgba(255,255,255,0.55)';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(16, 16, w - 32, h - 32);

            // Instruction text
            ctx.fillStyle = '#2B0852';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '600 ' + Math.max(15, Math.round(w * 0.04)) + 'px "Cormorant Garamond", serif';
            ctx.fillText('Scratch to Reveal', w / 2, h * 0.45);
            ctx.font = '500 ' + Math.max(14, Math.round(w * 0.033)) + 'px "Cormorant Garamond", serif';
            ctx.fillText('the Wedding Date', w / 2, h * 0.45 + Math.max(22, Math.round(w * 0.055)));
        }

        function size() {
            const rect = card.getBoundingClientRect();
            w = Math.round(rect.width);
            h = Math.round(rect.height);
            if (!w || !h) return;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (revealed) return;
            drawFoil();
            if (segs.length) {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = Math.max(34, Math.round(w * 0.12));
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                for (const s of segs) {
                    ctx.beginPath();
                    ctx.moveTo(s.x1 * w, s.y1 * h);
                    ctx.lineTo(s.x2 * w, s.y2 * h);
                    ctx.stroke();
                }
                ctx.globalCompositeOperation = 'source-over';
            }
        }
        size();

        if (window.ResizeObserver) {
            const ro = new ResizeObserver(() => size());
            ro.observe(card);
        }
        window.addEventListener('resize', size);

        function pos(e) {
            const rect = canvas.getBoundingClientRect();
            const t = e.touches ? e.touches[0] : e;
            return { x: t.clientX - rect.left, y: t.clientY - rect.top };
        }

        function scratch(x1, y1, x2, y2) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = Math.max(34, Math.round(w * 0.12));
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.globalCompositeOperation = 'source-over';
            segs.push({ x1: x1 / w, y1: y1 / h, x2: x2 / w, y2: y2 / h });
        }

        function clearedRatio() {
            tctx.clearRect(0, 0, tmp.width, tmp.height);
            tctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, tmp.width, tmp.height);
            const d = tctx.getImageData(0, 0, tmp.width, tmp.height).data;
            let cleared = 0;
            for (let i = 3; i < d.length; i += 4) if (d[i] < 128) cleared++;
            return cleared / (d.length / 4);
        }

        function reveal() {
            if (revealed) return;
            revealed = true;
            card.classList.add('revealed');
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 120,
                    spread: 85,
                    startVelocity: 36,
                    origin: { y: 0.6 },
                    colors: ['#FFD166', '#F4C430', '#C77DFF', '#7B2CBF', '#F9C5D5', '#ffffff']
                });
            }
        }

        function onMove(x, y) {
            scratch(lastX, lastY, x, y);
            lastX = x;
            lastY = y;
            moveCount++;
            if (!revealed && moveCount % 5 === 0 && clearedRatio() > 0.55) reveal();
        }

        canvas.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            isScratching = true;
            const p = pos(e);
            lastX = p.x;
            lastY = p.y;
            try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        });

        canvas.addEventListener('pointermove', (e) => {
            if (!isScratching || revealed) return;
            e.preventDefault();
            const p = pos(e);
            onMove(p.x, p.y);
        });

        const stop = () => { isScratching = false; };
        canvas.addEventListener('pointerup', stop);
        canvas.addEventListener('pointercancel', stop);
        canvas.addEventListener('pointerleave', stop);

        // Keyboard fallback for accessibility
        canvas.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); }
        });
    }

    /* ------------------------------------------------------------------
       MEHNDI SCRATCH CARD
       ------------------------------------------------------------------ */
    function initMehndiScratchCard() {
        const card = document.getElementById('mehndiScratchCard');
        const canvas = document.getElementById('mehndiScratchCanvas');
        if (!card || !canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let w = 0, h = 0;
        let isScratching = false;
        let lastX = 0, lastY = 0;
        let revealed = false;
        let moveCount = 0;
        const segs = [];

        const tmp = document.createElement('canvas');
        tmp.width = 40; tmp.height = 48;
        const tctx = tmp.getContext('2d');

        function drawFoil() {
            const g = ctx.createLinearGradient(0, 0, w, h);
            g.addColorStop(0, '#FFD54F');
            g.addColorStop(0.4, '#FFB300');
            g.addColorStop(0.7, '#F9A825');
            g.addColorStop(1, '#F57C00');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);

            const rg = ctx.createRadialGradient(w / 2, h * 0.25, 6, w / 2, h * 0.25, Math.max(w, h) * 0.7);
            rg.addColorStop(0, 'rgba(255,255,255,0.35)');
            rg.addColorStop(0.5, 'rgba(255,255,255,0.05)');
            rg.addColorStop(1, 'rgba(180,100,0,0.3)');
            ctx.fillStyle = rg;
            ctx.fillRect(0, 0, w, h);

            for (let i = 0; i < 240; i++) {
                ctx.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.12 + 0.02) + ')';
                ctx.fillRect(Math.random() * w, Math.random() * h, 1.2, 1.2);
            }

            ctx.strokeStyle = 'rgba(249,168,37,0.5)';
            ctx.lineWidth = 3;
            ctx.strokeRect(10, 10, w - 20, h - 20);
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(16, 16, w - 32, h - 32);

            ctx.fillStyle = '#E65100';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '600 ' + Math.max(14, Math.round(w * 0.038)) + 'px "Poppins", sans-serif';
            ctx.fillText('✨ Scratch to Reveal ✨', w / 2, h * 0.44);
            ctx.font = '500 ' + Math.max(13, Math.round(w * 0.032)) + 'px "Poppins", sans-serif';
            ctx.fillText('the Mehndi Date', w / 2, h * 0.44 + Math.max(24, Math.round(w * 0.058)));
        }

        function size() {
            const rect = card.getBoundingClientRect();
            w = Math.round(rect.width);
            h = Math.round(rect.height);
            if (!w || !h) return;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (revealed) return;
            drawFoil();
            if (segs.length) {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = Math.max(34, Math.round(w * 0.12));
                ctx.lineCap = 'round'; ctx.lineJoin = 'round';
                for (const s of segs) {
                    ctx.beginPath();
                    ctx.moveTo(s.x1 * w, s.y1 * h);
                    ctx.lineTo(s.x2 * w, s.y2 * h);
                    ctx.stroke();
                }
                ctx.globalCompositeOperation = 'source-over';
            }
        }
        size();
        if (window.ResizeObserver) {
            new ResizeObserver(() => size()).observe(card);
        }
        window.addEventListener('resize', size);

        function pos(e) {
            const rect = canvas.getBoundingClientRect();
            const t = e.touches ? e.touches[0] : e;
            return { x: t.clientX - rect.left, y: t.clientY - rect.top };
        }

        function scratch(x1, y1, x2, y2) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = Math.max(34, Math.round(w * 0.12));
            ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.globalCompositeOperation = 'source-over';
            segs.push({ x1: x1 / w, y1: y1 / h, x2: x2 / w, y2: y2 / h });
        }

        function clearedRatio() {
            tctx.clearRect(0, 0, tmp.width, tmp.height);
            tctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, tmp.width, tmp.height);
            const d = tctx.getImageData(0, 0, tmp.width, tmp.height).data;
            let cleared = 0;
            for (let i = 3; i < d.length; i += 4) if (d[i] < 128) cleared++;
            return cleared / (d.length / 4);
        }

        function reveal() {
            if (revealed) return;
            revealed = true;
            card.classList.add('m-revealed');
            if (typeof confetti === 'function') {
                confetti({ particleCount: 150, spread: 90, startVelocity: 38, origin: { y: 0.6 }, colors: ['#FFD54F', '#FFB300', '#F9A825', '#FF9800', '#8BC34A', '#ffffff'] });
            }
        }

        function onMove(x, y) {
            scratch(lastX, lastY, x, y);
            lastX = x; lastY = y;
            moveCount++;
            if (!revealed && moveCount % 5 === 0 && clearedRatio() > 0.55) reveal();
        }

        canvas.addEventListener('pointerdown', (e) => {
            e.preventDefault(); isScratching = true;
            const p = pos(e); lastX = p.x; lastY = p.y;
            try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        });
        canvas.addEventListener('pointermove', (e) => {
            if (!isScratching || revealed) return;
            e.preventDefault(); const p = pos(e); onMove(p.x, p.y);
        });
        const stopM = () => { isScratching = false; };
        canvas.addEventListener('pointerup', stopM);
        canvas.addEventListener('pointercancel', stopM);
        canvas.addEventListener('pointerleave', stopM);
        canvas.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); }
        });
    }

    /* ------------------------------------------------------------------
       MEHNDI FALLING MARIGOLD PETALS
       ------------------------------------------------------------------ */
    function initMehndiPetals() {
        const container = document.getElementById('mehndiPetals');
        if (!container || prefersReducedMotion) return;
        const flowers = ['🌼', '🌸', '🏵️', '✿', '❀'];
        function spawn() {
            const el = document.createElement('span');
            el.className = 'm-petal';
            el.textContent = flowers[Math.floor(Math.random() * flowers.length)];
            el.style.left = Math.random() * 100 + 'vw';
            el.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
            el.style.animationDuration = (5 + Math.random() * 7) + 's';
            el.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(el);
            setTimeout(() => el.remove(), 14000);
        }
        spawn(); spawn(); spawn();
        setInterval(spawn, 1800);
    }

    /* ------------------------------------------------------------------
       MEHNDI HASHTAG COPY
       ------------------------------------------------------------------ */
    function initMehndiHashtagCopy() {
        const btn = document.getElementById('mehndiCopyHashtag');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const text = document.getElementById('mehndiHashtagText').innerText;
            navigator.clipboard.writeText(text).then(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => { btn.innerHTML = '<i class="far fa-copy"></i> Copy'; }, 2000);
            }).catch(() => {
                const ta = document.createElement('textarea');
                ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
                document.body.appendChild(ta); ta.select();
                document.execCommand('copy'); document.body.removeChild(ta);
                btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => { btn.innerHTML = '<i class="far fa-copy"></i> Copy'; }, 2000);
            });
        });
    }

});
