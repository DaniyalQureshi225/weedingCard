/* ==========================================================================
   WALIMA INVITATION — INTERACTIVE JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ------------------------------------------------------------------
       CONFIGURATION — Single source of truth for all invitation details
       ------------------------------------------------------------------ */
    const CONFIG = {
        bride: 'Ayesha Khan',
        groom: 'Zain Ahmed',
        brideParents: 'Mr. & Mrs. Imran Khan',
        groomParents: 'Mr. & Mrs. Farooq Ahmed',
        event: 'Walima Reception',
        date: 'Sunday, November 15, 2026',
        guestArrival: '7:30 PM',
        dinner: '8:30 PM',
        venue: 'The Grand Pearl Banquet',
        location: 'Karachi, Pakistan',
        rsvpContact: '+92 300 1234567',
        // Walima at 7:30 PM PKT (UTC+5) → November 15, 2026, 14:30 UTC
        eventDateISO: '2026-11-15T19:30:00+05:00',
        mapsUrl: 'https://maps.google.com/?q=The+Grand+Pearl+Banquet+Karachi+Pakistan',
        hashtag: '#AyeshaWedsZain'
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ------------------------------------------------------------------
       1. INVITATION COVER — Open Invitation
       ------------------------------------------------------------------ */
    const coverOverlay = document.getElementById('coverOverlay');
    const mainContent = document.getElementById('mainContent');
    const openInviteBtn = document.getElementById('openInviteBtn');
    const musicControl = document.getElementById('musicControl');

    function openInvitation() {
        if (!coverOverlay || !mainContent) return;
        if (!mainContent.classList.contains('hidden')) return;

        coverOverlay.classList.add('opened');
        coverOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        mainContent.classList.remove('hidden');

        // Show music control
        if (musicControl) {
            setTimeout(() => musicControl.classList.add('visible'), 600);
        }

        tryPlayMusic();
        triggerScrollObserver();

        // Remove cover from DOM after transition
        setTimeout(() => {
            coverOverlay.style.display = 'none';
        }, 1000);
    }

    if (openInviteBtn) {
        openInviteBtn.addEventListener('click', openInvitation);
        openInviteBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openInvitation(); }
        });
    }

    // Prevent scroll while cover is visible
    if (coverOverlay && !coverOverlay.classList.contains('opened')) {
        document.body.style.overflow = 'hidden';
    }

    /* ------------------------------------------------------------------
       2. BACKGROUND MUSIC (assets/sound/bkw.mp3)
       ------------------------------------------------------------------ */
    const bgAudio = document.getElementById('bgAudio');
    const musicToggle = document.getElementById('musicToggle');
    const musicText = musicToggle ? musicToggle.querySelector('.music-text') : null;
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
        if (musicText) musicText.textContent = playing ? 'Pause' : 'Music';
    }

    if (musicToggle) musicToggle.addEventListener('click', toggleMusic);

    /* ------------------------------------------------------------------
       3. COUNTDOWN TIMER (Karachi, PKT UTC+5)
       ------------------------------------------------------------------ */
    const eventTime = new Date(CONFIG.eventDateISO).getTime();

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
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    /* ------------------------------------------------------------------
       4. SCROLL REVEAL OBSERVER
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
    }

    /* ------------------------------------------------------------------
       5. NAVBAR SCROLL STATE + PARALLAX
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
       6. MOBILE NAVIGATION TOGGLE
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
       7. RSVP FORM VALIDATION & DEMO SUBMISSION
       ------------------------------------------------------------------ */
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSubmitBtn = document.getElementById('rsvpSubmitBtn');
    const rsvpConfirmation = document.getElementById('rsvpConfirmation');
    const confirmationText = document.getElementById('confirmationText');

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

            // Validate guest count
            const countInput = document.getElementById('guestCount');
            if (!countInput.value) {
                isValid = false;
                countInput.classList.add('error');
                document.getElementById('guestCountError').classList.add('show');
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

                if (isAccepting) {
                    confirmationText.textContent = `Thank you, ${guestName}! We're delighted you'll be joining us for the Walima Reception.`;
                } else {
                    confirmationText.textContent = `Thank you, ${guestName}. We're sorry you won't be able to make it, but we appreciate your kind response.`;
                }

                rsvpConfirmation.classList.remove('hidden');

                // Log to console for demo purposes
                console.log('RSVP Demo Submission:', {
                    name: guestName,
                    guests: countInput.value,
                    attendance: attendance.value,
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
       8. SAVE THE DATE — ICS Calendar Download
       ------------------------------------------------------------------ */
    const saveTheDateBtn = document.getElementById('saveTheDateBtn');

    if (saveTheDateBtn) {
        saveTheDateBtn.addEventListener('click', () => {
            const startDate = '20261115T193000';
            const endDate = '20261115T230000';

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
                `LOCATION:${CONFIG.venue}\\, ${CONFIG.location}`,
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
            link.download = 'walima-reception-ayesha-zain.ics';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    }

    /* ------------------------------------------------------------------
       9. SMOOTH SCROLL for anchor links
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

});
