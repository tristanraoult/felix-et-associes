/* 
   ==========================================================================
   Félix et associés - Premium Redesign Interactions Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initCustomCursor();
    initMobileMenu();
    initHeroCarousel();
    initWordSplitter();
    initScrollReveal();
    initStatsCountUp();
    initProjectFilters();
    initBookingForm();
    initSmoothScrolling();
});

/**
 * 1. Custom Cursor
 */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    if (!cursor || !follower) return;

    // Hide default cursor on desktop
    if (window.matchMedia('(min-width: 1200px)').matches) {
        document.body.style.cursor = 'none';
    } else {
        cursor.style.display = 'none';
        follower.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let hasMoved = false;

    document.addEventListener('mousemove', (e) => {
        if (!hasMoved) {
            cursor.style.opacity = '1';
            follower.style.opacity = '1';
            hasMoved = true;
        }
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Smooth follower motion using requestAnimationFrame
    function animateFollower() {
        // Ease interpolation (0.1 = speed of follow)
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover classes
    const hoverables = document.querySelectorAll('a, button, select, input, textarea, .radio-btn-custom, .filter-btn');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('custom-cursor-active');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('custom-cursor-active');
        });
    });

    // Special hover class for project cards
    const projectCards = document.querySelectorAll('.project-item');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            document.body.classList.add('custom-cursor-hover-project');
        });
        card.addEventListener('mouseleave', () => {
            document.body.classList.remove('custom-cursor-hover-project');
        });
    });
}

/**
 * 2. Hamburger Mobile Menu
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger-btn');
    const overlay = document.querySelector('.mobile-nav-overlay');
    const menuLinks = document.querySelectorAll('.mobile-menu a');

    if (!hamburger || !overlay) return;

    function toggleMenu() {
        const isOpen = hamburger.classList.toggle('open');
        overlay.classList.toggle('open', isOpen);
        
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    hamburger.addEventListener('click', toggleMenu);

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Close menu when a link is clicked
            hamburger.classList.remove('open');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/**
 * 3. Hero Slide Carousel Cross-Fade
 */
function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;

    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, slideInterval);
}

/**
 * 4. Word-by-Word Hero Text Splitter
 */
function initWordSplitter() {
    const titles = document.querySelectorAll('.split-text');
    titles.forEach(title => {
        const text = title.textContent.trim();
        const words = text.split(' ');
        title.innerHTML = '';
        
        words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.opacity = '0';
            wordSpan.style.transform = 'translateY(25px)';
            wordSpan.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            wordSpan.style.transitionDelay = `${index * 0.08}s`;
            wordSpan.textContent = word + (index < words.length - 1 ? '\u00A0' : ''); // Keep space
            title.appendChild(wordSpan);
        });

        // Trigger animation
        setTimeout(() => {
            const spans = title.querySelectorAll('span');
            spans.forEach(span => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            });
        }, 100);
    });
}

/**
 * 5. Scroll Reveal Intersection Observer
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(el => observer.observe(el));
}

/**
 * 6. Statistics Count Up Animation
 */
function initStatsCountUp() {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length === 0) return;

    const countUp = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2000; // 2 seconds
        const stepTime = Math.abs(Math.floor(duration / target));
        let current = 0;
        
        const timer = setInterval(() => {
            current += 1;
            el.textContent = current + (el.getAttribute('data-suffix') || '');
            if (current >= target) {
                el.textContent = target + (el.getAttribute('data-suffix') || '');
                clearInterval(timer);
            }
        }, stepTime || 10);
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

/**
 * 7. Projects Filters (Dynamic Portfolio page)
 */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    if (filterButtons.length === 0 || projectItems.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectItems.forEach(item => {
                const catsAttr = item.getAttribute('data-categories');
                const categories = catsAttr ? catsAttr.split(' ') : [];
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400); // match transition
                }
            });
        });
    });

    // Handle URL parameters for filtering on load (e.g. from services page links)
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam) {
        const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
        if (targetBtn) {
            targetBtn.click();
        }
    }
}

/**
 * 8. Booking Form (Appointment handling)
 */
function initBookingForm() {
    const form = document.getElementById('booking-form');
    const successOverlay = document.getElementById('success-message');
    const formWrapper = document.querySelector('.booking-form-wrapper');

    if (!form || !successOverlay) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simple Validation check
        const fields = form.querySelectorAll('[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = 'red';
            } else {
                field.style.borderColor = '';
            }
        });

        if (!isValid) return;

        // Show spinner / loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Envoi en cours...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Hide form and show animated success screen
            form.style.display = 'none';
            successOverlay.style.display = 'block';
            
            // Scroll to the top of the form wrapper
            formWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 1500);
    });
}

/**
 * 9. Smooth Scrolling for internal anchor links
 */
function initSmoothScrolling() {
    const anchors = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            
            if (targetEl) {
                targetEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
