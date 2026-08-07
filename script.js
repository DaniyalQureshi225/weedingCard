/* ==========================================================================
   INTERACTIVE WEDDING CARD JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ENVELOPE UNSEAL / OPEN INVITATION ---
    const openInviteBtn = document.getElementById('openInviteBtn');
    const envelopeOverlay = document.getElementById('envelopeOverlay');
    const mainContent = document.getElementById('mainContent');

    openInviteBtn.addEventListener('click', () => {
        envelopeOverlay.classList.add('opened');
        mainContent.classList.remove('hidden');
        
        // Start background music and petal animation
        startBackgroundMusic();
        initPetalCanvas();
        triggerScrollObserver();
    });

    // --- 2. AMBIENT WEB AUDIO SYNTHESIZER MUSIC PLAYER ---
    let audioCtx = null;
    let isPlaying = false;
    let musicInterval = null;
    const musicToggle = document.getElementById('musicToggle');
    const musicText = musicToggle.querySelector('.music-text');

    function startBackgroundMusic() {
        if (isPlaying) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();

            isPlaying = true;
            musicToggle.classList.add('playing');
            musicText.textContent = "Pause Music";

            // Soothing romantic pentatonic scale frequencies (Raag Mohanam / Bhupali vibe)
            const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
            
            function playNote() {
                if (!isPlaying || !audioCtx) return;
                
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                // Gentle sine wave flute feel
                osc.type = 'sine';
                const freq = scale[Math.floor(Math.random() * scale.length)];
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

                // Soft fade in & fade out envelope
                gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.3);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.5);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start();
                osc.stop(audioCtx.currentTime + 2.6);
            }

            playNote();
            musicInterval = setInterval(playNote, 1200);

        } catch (e) {
            console.log('Audio Autoplay restricted:', e);
        }
    }

    function toggleMusic() {
        if (isPlaying) {
            isPlaying = false;
            if (musicInterval) clearInterval(musicInterval);
            if (audioCtx) audioCtx.suspend();
            musicToggle.classList.remove('playing');
            musicText.textContent = "Play Music";
        } else {
            if (audioCtx) {
                audioCtx.resume();
                isPlaying = true;
                musicInterval = setInterval(() => {
                    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(scale[Math.floor(Math.random() * scale.length)], audioCtx.currentTime);
                    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.1, audioCtx.currentTime + 0.3);
                    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.2);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start();
                    osc.stop(audioCtx.currentTime + 2.3);
                }, 1200);
            } else {
                startBackgroundMusic();
            }
            musicToggle.classList.add('playing');
            musicText.textContent = "Pause Music";
        }
    }

    musicToggle.addEventListener('click', toggleMusic);

    // --- 3. COUNTDOWN TIMER LOGIC ---
    const weddingDate = new Date('December 18, 2026 19:30:00').getTime();

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
            document.getElementById('countdownTimer').innerHTML = '<h3 class="event-name">The Wedding Day is Here! 🎉</h3>';
        }
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- 4. FLOATING FLOWER PETALS CANVAS ANIMATION ---
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

        const petals = [];
        const petalCount = 25;

        class Petal {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * -canvas.height;
                this.size = Math.random() * 8 + 6;
                this.speedY = Math.random() * 1.5 + 0.8;
                this.speedX = Math.random() * 1 - 0.5;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 2 - 1;
                this.opacity = Math.random() * 0.6 + 0.3;
                this.color = Math.random() > 0.5 ? '#d4af37' : '#e63946'; // Gold & Rose red
            }

            update() {
                this.y += this.speedY;
                this.x += Math.sin(this.y * 0.01) + this.speedX;
                this.rotation += this.rotationSpeed;

                if (this.y > canvas.height + 20) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                
                // Draw petal shape
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-this.size, -this.size * 1.5, -this.size * 1.5, this.size, 0, this.size * 1.8);
                ctx.bezierCurveTo(this.size * 1.5, this.size, this.size, -this.size * 1.5, 0, 0);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < petalCount; i++) {
            petals.push(new Petal());
        }

        function animatePetals() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            petals.forEach(petal => {
                petal.update();
                petal.draw();
            });
            requestAnimationFrame(animatePetals);
        }

        animatePetals();
    }

    // --- 5. SCROLL REVEAL OBSERVER ---
    function triggerScrollObserver() {
        const fadeElements = document.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15 });

        fadeElements.forEach(el => observer.observe(el));
    }

    // --- 6. RSVP FORM SUBMISSION WITH CONFETTI ---
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccess = document.getElementById('rsvpSuccess');
    const successMessage = document.getElementById('successMessage');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('guestName').value;
            const attendance = document.getElementById('attendance').value;

            // Store in LocalStorage
            const rsvpData = {
                name,
                email: document.getElementById('guestEmail').value,
                phone: document.getElementById('guestPhone').value,
                attendance,
                guests: document.getElementById('guestCount').value,
                blessings: document.getElementById('blessings').value,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('wedding_rsvp_' + Date.now(), JSON.stringify(rsvpData));

            // Show Confirmation
            rsvpForm.classList.add('hidden');
            rsvpSuccess.classList.remove('hidden');
            successMessage.innerText = `Thank you, ${name}! Your response (${attendance}) has been received.`;

            // Trigger Confetti Burst if library loaded
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 120,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#d4af37', '#fcf6ba', '#e63946', '#ffffff']
                });
            }
        });
    }

    // --- 7. HASHTAG COPY BAR ---
    const copyHashtagBtn = document.getElementById('copyHashtag');
    if (copyHashtagBtn) {
        copyHashtagBtn.addEventListener('click', () => {
            const hashtag = document.getElementById('hashtagText').innerText;
            navigator.clipboard.writeText(hashtag).then(() => {
                copyHashtagBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyHashtagBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
                }, 2000);
            });
        });
    }

});
