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
});
