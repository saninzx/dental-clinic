document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ----------------------------------------------------
    // Mobile Menu Toggle
    // ----------------------------------------------------
    const menuToggle = document.getElementById('menuToggle');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const menuIcon = menuToggle.querySelector('.icon-menu');
    const closeIcon = menuToggle.querySelector('.icon-close');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMobileMenu() {
        const isOpen = mobileOverlay.classList.contains('open');
        if (isOpen) {
            mobileOverlay.classList.remove('open');
            menuIcon.style.display = 'block';
            closeIcon.style.display = 'none';
            document.body.style.overflow = '';
        } else {
            mobileOverlay.classList.add('open');
            menuIcon.style.display = 'none';
            closeIcon.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    menuToggle.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileOverlay.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // ----------------------------------------------------
    // Google Reviews Carousel
    // ----------------------------------------------------
    const slides = document.querySelectorAll('.review-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetSlideTimer();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSlideTimer();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetSlideTimer();
        });
    });

    function startSlideTimer() {
        slideInterval = setInterval(nextSlide, 6000);
    }

    function resetSlideTimer() {
        clearInterval(slideInterval);
        startSlideTimer();
    }

    startSlideTimer();

    // ----------------------------------------------------
    // Sticky Header & Scrollspy
    // ----------------------------------------------------
    const header = document.querySelector('.main-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.scroll-section');

    window.addEventListener('scroll', () => {
        // Sticky Header shrink
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(234, 239, 245, 0.95)';
            header.querySelector('.header-container').style.height = '75px';
        } else {
            header.style.backgroundColor = 'rgba(234, 239, 245, 0.8)';
            header.querySelector('.header-container').style.height = '90px';
        }

        // Scrollspy active class update
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // ----------------------------------------------------
    // Booking Form Validation & Submission
    // ----------------------------------------------------
    const form = document.getElementById('appointmentForm');
    const successOverlay = document.getElementById('successOverlay');
    const successName = document.getElementById('successName');
    const successPhone = document.getElementById('successPhone');
    const successDate = document.getElementById('successDate');
    const successTime = document.getElementById('successTime');
    const successResetBtn = document.getElementById('successResetBtn');

    // Restrict date input to future dates only
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;

        // 1. Full Name Validation
        const fullName = document.getElementById('fullName');
        const nameGroup = fullName.closest('.form-group');
        if (fullName.value.trim().length < 3) {
            nameGroup.classList.add('invalid');
            isValid = false;
        } else {
            nameGroup.classList.remove('invalid');
        }

        // 2. Phone Number Validation (Generic Indian Phone regex - 10 digits)
        const phoneInput = document.getElementById('phoneNumber');
        const phoneGroup = phoneInput.closest('.form-group');
        // Strip out non-digit chars for validation
        const cleanPhone = phoneInput.value.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
            phoneGroup.classList.add('invalid');
            isValid = false;
        } else {
            phoneGroup.classList.remove('invalid');
        }

        // 3. Service Selection Validation
        const treatmentSelect = document.getElementById('treatmentType');
        const treatmentGroup = treatmentSelect.closest('.form-group');
        if (treatmentSelect.value === "") {
            treatmentGroup.classList.add('invalid');
            isValid = false;
        } else {
            treatmentGroup.classList.remove('invalid');
        }

        // 4. Date Validation
        const dateGroup = dateInput.closest('.form-group');
        if (dateInput.value === "") {
            dateGroup.classList.add('invalid');
            isValid = false;
        } else {
            dateGroup.classList.remove('invalid');
        }

        // 5. Time Validation
        const timeSelect = document.getElementById('bookingTime');
        const timeGroup = timeSelect.closest('.form-group');
        if (timeSelect.value === "") {
            timeGroup.classList.add('invalid');
            isValid = false;
        } else {
            timeGroup.classList.remove('invalid');
        }

        if (isValid) {
            // Populate Success Content
            successName.textContent = fullName.value.trim();
            successPhone.textContent = phoneInput.value;
            
            // Format Date for Display
            const dateObj = new Date(dateInput.value);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            successDate.textContent = dateObj.toLocaleDateString('en-US', options);
            
            // Get selected slot label text
            const selectedTimeText = timeSelect.options[timeSelect.selectedIndex].text;
            successTime.textContent = selectedTimeText;

            // Show Success Overlay
            successOverlay.classList.add('show');
        }
    });

    // Reset Form & Overlay Action
    successResetBtn.addEventListener('click', () => {
        form.reset();
        successOverlay.classList.remove('show');
        // Clear all validation styles
        const groups = form.querySelectorAll('.form-group');
        groups.forEach(group => group.classList.remove('invalid'));
    });

    // Remove validation errors immediately upon typing
    form.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('input', () => {
            const group = element.closest('.form-group');
            if (group.classList.contains('invalid')) {
                group.classList.remove('invalid');
            }
        });
    });

    // ----------------------------------------------------
    // Reveal Animations on Scroll (Intersection Observer)
    // ----------------------------------------------------
    const animElements = document.querySelectorAll('.service-card, .highlight-card, .feature-item, .contact-item-card, .booking-form-container, .hero-content, .hero-visual');
    
    // Add initial styling via JS so it degrades gracefully if JS is disabled
    animElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animElements.forEach(el => {
        revealObserver.observe(el);
    });
});
