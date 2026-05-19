document.addEventListener("DOMContentLoaded", () => {
    // Smooth scrolling logic for the anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });

    // Side Navigation Logic
    const sideNav = document.getElementById('side-nav');
    const sections = document.querySelectorAll('section');
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileBtn = document.getElementById('mobile-menu-btn');

    // Hamburger toggle
    mobileBtn.addEventListener('click', () => {
        sideNav.classList.toggle('open');
    });

    // Close menu when link clicked on mobile
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1200) {
                sideNav.classList.remove('open');
            }
        });
    });

    window.addEventListener('scroll', () => {
        // Mostra o nascondi il menu laterale
        if (window.scrollY > 300) {
            sideNav.classList.remove('hidden');
        } else {
            sideNav.classList.add('hidden');
        }

        // Scroll spy
        let current = 'top';
        if (window.scrollY > (header.offsetHeight - 200)) {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= (sectionTop - 300)) {
                    current = section.getAttribute('id');
                }
            });
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });

    // ── FAST READER (RSVP) ────────────────────────────────────────────────────
    let wordsArray = [];
    let currentWordIndex = 0;
    let readerInterval = null;
    let isPlaying = false;

    const displayEl   = document.getElementById('reader-display');
    const wpmSlider   = document.getElementById('wpm-slider');
    const wpmValueEl  = document.getElementById('wpm-value');
    const btnPlay     = document.getElementById('btn-play');
    const btnPause    = document.getElementById('btn-pause');
    const btnStop     = document.getElementById('btn-stop');
    const progressBar = document.getElementById('reader-progress');

    function renderWord() {
        if (!wordsArray.length) return;
        const word = wordsArray[currentWordIndex];

        // Optimal Recognition Point: ~1/3 into the word
        const pivot = word.length <= 1 ? 0 : Math.max(0, Math.round(word.length / 3) - 1);
        const before = word.slice(0, pivot);
        const letter = word.charAt(pivot);
        const after  = word.slice(pivot + 1);

        displayEl.innerHTML = `${before}<span class="focus-letter">${letter}</span>${after}`;

        const pct = wordsArray.length > 1
            ? (currentWordIndex / (wordsArray.length - 1)) * 100
            : 100;
        if (progressBar) progressBar.style.width = `${pct}%`;
    }

    function startReader() {
        if (!wordsArray.length) return;
        if (currentWordIndex >= wordsArray.length) currentWordIndex = 0;

        isPlaying = true;
        clearInterval(readerInterval);
        const msPerWord = 60000 / parseInt(wpmSlider.value, 10);

        readerInterval = setInterval(() => {
            renderWord();
            currentWordIndex++;
            if (currentWordIndex >= wordsArray.length) {
                stopReader();
            }
        }, msPerWord);
    }

    function pauseReader() {
        isPlaying = false;
        clearInterval(readerInterval);
    }

    function stopReader() {
        pauseReader();
        currentWordIndex = 0;
        if (wordsArray.length) {
            renderWord();
        } else {
            displayEl.innerHTML = 'Seleziona un testo da leggere...';
        }
        if (progressBar) progressBar.style.width = '0%';
    }

    if (wpmSlider) {
        wpmSlider.addEventListener('input', () => {
            wpmValueEl.textContent = wpmSlider.value;
            if (isPlaying) startReader(); // aggiorna velocità al volo
        });
    }

    if (btnPlay)  btnPlay.addEventListener('click', startReader);
    if (btnPause) btnPause.addEventListener('click', pauseReader);
    if (btnStop)  btnStop.addEventListener('click', stopReader);

    // Bottoni "⚡ Fast Read" sulle sezioni
    document.querySelectorAll('.fast-read-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.getAttribute('data-target');
            const section   = document.getElementById(sectionId);
            if (!section) return;

            const textDiv = section.querySelector('.text-content');
            if (!textDiv) return;

            // Clona per non modificare il DOM reale
            const clone = textDiv.cloneNode(true);
            clone.querySelectorAll('button').forEach(b => b.remove());

            const raw = (clone.innerText || clone.textContent)
                .replace(/\s+/g, ' ').trim();

            wordsArray = raw.split(' ').filter(w => w.length > 0);
            currentWordIndex = 0;
            stopReader();

            // Scrolla alla sezione Fast Reader
            const readerSection = document.getElementById('fast-reading');
            if (readerSection) {
                readerSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
