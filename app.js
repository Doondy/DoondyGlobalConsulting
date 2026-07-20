/**
 * Doondy Global Consulting (DGC) - Client Side Scripting
 * Author: Antigravity Code Assistant
 * Date: July 2026
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollReveal();
    initBudgetEstimator();
    initCarousel();
    initContactForm();
    initNewsletterForm();
    initTechStack();
    initCaseStudies();
    initFAQAccordion();
});

/* ==========================================================================
   Navigation Features
   ========================================================================== */
function initNavigation() {
    const header = document.querySelector('header');
    const navMenu = document.querySelector('.nav-menu');
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        highlightActiveSection();
    });

    // Mobile Menu Toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // Close menu when clicking link (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = mobileToggle?.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });

    // Highlight menu item on scroll
    function highlightActiveSection() {
        let scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

/* ==========================================================================
   Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   Smart IT Architecture & Budget Planner
   ========================================================================== */
function initBudgetEstimator() {
    const checkboxes = document.querySelectorAll('.service-checkbox');
    const durationSlider = document.getElementById('project-duration');
    const scaleSlider = document.getElementById('project-scale');
    const trafficSelect = document.getElementById('planner-traffic');
    const securitySelect = document.getElementById('planner-security');
    
    const valDuration = document.getElementById('val-duration');
    const valScale = document.getElementById('val-scale');
    const resultPrice = document.getElementById('result-price-range');
    const resultTimeline = document.getElementById('result-timeline');
    
    const listServices = document.getElementById('breakdown-services');
    const listTimeline = document.getElementById('breakdown-timeline');
    const listComplexity = document.getElementById('breakdown-complexity');
    
    const recTitle = document.getElementById('rec-title-span');
    const recDesc = document.getElementById('rec-desc-p');

    // Baseline costs for services
    const baseServiceCosts = {
        consulting: 5000,
        cloud: 9500,
        cyber: 8000,
        software: 15000,
        ai: 18000
    };

    // Complexity descriptors
    const scaleLabels = ["Standard Setup", "Mid-scale Integration", "Advanced Enterprise", "High-Complexity Global", "Mission Critical Cloud AI"];
    const scaleMultipliers = [1.0, 1.3, 1.7, 2.2, 3.0];

    function calculateEstimate() {
        let totalCost = 0;
        let selectedCount = 0;
        let selectedServices = [];

        // Calculate service cost sum
        checkboxes.forEach(cb => {
            if (cb.checked) {
                const serviceKey = cb.value;
                totalCost += baseServiceCosts[serviceKey] || 0;
                selectedCount++;
                selectedServices.push(serviceKey);
            }
        });

        // Update list of services count in summary card
        listServices.textContent = selectedCount > 0 ? `${selectedCount} Selected` : 'None';

        // Duration adjustments
        const months = parseInt(durationSlider.value);
        valDuration.textContent = `${months} Month${months > 1 ? 's' : ''}`;
        listTimeline.textContent = `${months} Month${months > 1 ? 's' : ''}`;

        // Timeline compression factor
        let timelineMultiplier = 1.0;
        if (months <= 3) timelineMultiplier = 1.45;
        else if (months <= 6) timelineMultiplier = 1.25;
        else if (months <= 9) timelineMultiplier = 1.05;
        else timelineMultiplier = 0.90;

        // Scale / Complexity
        const scaleIndex = parseInt(scaleSlider.value) - 1;
        valScale.textContent = scaleLabels[scaleIndex];
        listComplexity.textContent = scaleLabels[scaleIndex].split(' ')[0]; // short term
        const scaleMultiplier = scaleMultipliers[scaleIndex];

        // Traffic multiplier
        let trafficMultiplier = 1.0;
        const trafficVal = trafficSelect ? trafficSelect.value : 'low';
        if (trafficVal === 'medium') trafficMultiplier = 1.2;
        else if (trafficVal === 'high') trafficMultiplier = 1.5;
        else if (trafficVal === 'hyper') trafficMultiplier = 2.0;

        // Security compliance flat add
        let securityCost = 0;
        const securityVal = securitySelect ? securitySelect.value : 'standard';
        if (securityVal === 'soc2') securityCost = 4500;
        else if (securityVal === 'gdpr') securityCost = 6000;
        else if (securityVal === 'zerotrust') securityCost = 12000;

        // Apply formula
        if (selectedCount === 0) {
            resultPrice.textContent = "$0";
            resultTimeline.textContent = "Select services to estimate cost";
            if (recTitle && recDesc) {
                recTitle.textContent = "Architectural Advisor";
                recDesc.textContent = "Select services, project parameters, and security policies to generate a custom system design recommendation.";
            }
            return;
        }

        const rawEstimate = (totalCost * timelineMultiplier * scaleMultiplier * trafficMultiplier) + securityCost;
        
        // Low and high estimates (variance margin)
        const lowEst = Math.round((rawEstimate * 0.92) / 100) * 100;
        const highEst = Math.round((rawEstimate * 1.08) / 100) * 100;

        // Display results
        resultPrice.textContent = `$${lowEst.toLocaleString()} - $${highEst.toLocaleString()}`;
        resultTimeline.textContent = `Estimated Delivery: ~${months} Month${months > 1 ? 's' : ''}`;

        // Calculate and display smart architecture advice
        generateArchitectureRecommendation(selectedServices, trafficVal, securityVal);
    }

    function generateArchitectureRecommendation(services, traffic, security) {
        if (!recTitle || !recDesc) return;

        let title = "Modern VPC Cloud Architecture";
        let desc = "Deploying standard virtual machine nodes with relational SQL database backups, isolated behind firewall rules. Recommended for standard websites and back-office apps.";

        const hasCloud = services.includes('cloud');
        const hasSoftware = services.includes('software');
        const hasCyber = services.includes('cyber');
        const hasAI = services.includes('ai');

        if (hasAI && (traffic === 'high' || traffic === 'hyper')) {
            title = "Distributed GPU Machine Learning Pipeline";
            desc = "Configured on cloud worker pools with GPU auto-scaling, serving custom machine learning predictions via FastAPI endpoints, backed by high-throughput data lakes (S3/GCS).";
        } else if (hasCloud && (traffic === 'high' || traffic === 'hyper')) {
            title = "Multi-Region Kubernetes Container Cluster";
            desc = "Deploying high-availability containerized microservices managed by EKS/GKE across multiple availability zones. Features global Load Balancers, Cloudflare WAF, and PostgreSQL replication.";
        } else if (hasCloud && (traffic === 'medium' || traffic === 'low')) {
            title = "AWS Serverless Microservices Architecture";
            desc = "Utilizing AWS Lambda / GCP Cloud Functions connected via API Gateway and DynamoDB storage. This setup auto-scales from zero to thousands of active requests with near-zero idle resource cost.";
        } else if (hasCyber && security === 'zerotrust') {
            title = "Zero-Trust Enterprise Network & IAM Isolation";
            desc = "Configuring comprehensive network segregation, Cloud Identity Proxy logins, hardware-based MFA enforcement, database-level encryption-at-rest, and real-time SIEM logging.";
        } else if (hasSoftware && (security === 'gdpr' || security === 'soc2')) {
            title = "Audit-Ready Compliant Web Application";
            desc = "Tailored for financial or healthcare applications. Combines isolated data vaults, field-level encryption, regular auto-backups, penetration logging, and SOC 2 / GDPR report exports.";
        }

        recTitle.innerHTML = `<i class="fas fa-microchip"></i> System Recommendation: ${title}`;
        recDesc.textContent = desc;
    }

    // Attach listeners
    checkboxes.forEach(cb => cb.addEventListener('change', calculateEstimate));
    if (durationSlider) durationSlider.addEventListener('input', calculateEstimate);
    if (scaleSlider) scaleSlider.addEventListener('input', calculateEstimate);
    if (trafficSelect) trafficSelect.addEventListener('change', calculateEstimate);
    if (securitySelect) securitySelect.addEventListener('change', calculateEstimate);

    // Run first baseline estimate
    calculateEstimate();
}

/* ==========================================================================
   Testimonials Carousel
   ========================================================================== */
function initCarousel() {
    const wrapper = document.querySelector('.carousel-wrapper');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (!wrapper || slides.length === 0) return;

    let currentIndex = 0;
    const slideCount = slides.length;
    let autoSlideTimer;

    // Create Navigation Dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(i);
            resetAutoSlide();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    function updateCarousel() {
        wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = (index + slideCount) % slideCount;
        updateCarousel();
    }

    function startAutoSlide() {
        autoSlideTimer = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000); // Shift every 5 seconds
    }

    function resetAutoSlide() {
        clearInterval(autoSlideTimer);
        startAutoSlide();
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            resetAutoSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            resetAutoSlide();
        });
    }

    // Touch support (Swiping)
    let startX = 0;
    wrapper.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    wrapper.addEventListener('touchend', e => {
        const diffX = startX - e.changedTouches[0].clientX;
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) goToSlide(currentIndex + 1);
            else goToSlide(currentIndex - 1);
            resetAutoSlide();
        }
    }, { passive: true });

    // Initialize Auto Pacing
    startAutoSlide();
}

/* ==========================================================================
   Toast Alerts
   ========================================================================== */
function showToast(message, type = 'success') {
    // Create toast container if missing
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.classList.add('toast-container');
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.classList.add('toast', `toast-${type}`);
    
    const icon = type === 'success' ? '✓' : 'ℹ';
    
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);

    // Slide up / display
    setTimeout(() => toast.classList.add('show'), 50);

    // Automate destroy
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

/* ==========================================================================
   Contact Form Validation & Processing
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const fields = [
        { id: 'client-name', valRule: val => val.trim().length >= 2, errorMsg: 'Name must be at least 2 characters.' },
        { id: 'client-email', valRule: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), errorMsg: 'Please enter a valid email address.' },
        { id: 'client-phone', valRule: val => val.trim().length === 0 || /^[+]?[0-9\s-]{7,15}$/.test(val), errorMsg: 'Optional: Must be a valid phone number (7-15 digits).' },
        { id: 'client-message', valRule: val => val.trim().length >= 10, errorMsg: 'Message must be at least 10 characters long.' }
    ];

    // Real-time input cleaning and error clearing
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input) {
            input.addEventListener('input', () => {
                const group = input.closest('.form-group');
                if (group.classList.contains('error')) {
                    const isValid = field.valRule(input.value);
                    if (isValid) {
                        group.classList.remove('error');
                    }
                }
            });
        }
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        let formIsValid = true;

        fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (!input) return;

            const group = input.closest('.form-group');
            const validationMsg = group.querySelector('.validation-msg');
            const isValid = field.valRule(input.value);

            if (!isValid) {
                group.classList.add('error');
                if (validationMsg) validationMsg.textContent = field.errorMsg;
                formIsValid = false;
            } else {
                group.classList.remove('error');
            }
        });

        if (formIsValid) {
            // Mock dynamic loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Request...';

            setTimeout(() => {
                showToast('Thank you! Your consultation request has been sent successfully.', 'success');
                form.reset();
                
                // Trigger label resets
                document.querySelectorAll('.form-input').forEach(input => {
                    input.blur();
                });

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }, 1200);
        } else {
            showToast('Form submission failed. Please verify input fields.', 'info');
        }
    });
}

/* ==========================================================================
   Newsletter Subscription Processing
   ========================================================================== */
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const input = document.getElementById('newsletter-email');
        if (!input) return;

        const email = input.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailPattern.test(email)) {
            input.value = '';
            showToast('Subscribed! DGC Tech newsletters will be delivered to your inbox.', 'success');
        } else {
            showToast('Please enter a valid email address.', 'info');
        }
    });
}

/* ==========================================================================
   Technology Stack Sorting
   ========================================================================== */
function initTechStack() {
    const filterPills = document.querySelectorAll('.tech-filter');
    const techCards = document.querySelectorAll('.tech-card');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Toggle active pill
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filterVal = pill.getAttribute('data-filter');

            techCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                if (filterVal === 'all' || categories.includes(filterVal)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ==========================================================================
   Case Studies Dynamic Filtering
   ========================================================================== */
function initCaseStudies() {
    const filterPills = document.querySelectorAll('.case-filter');
    const caseCards = document.querySelectorAll('.case-study-card');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Toggle active pill
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filterVal = pill.getAttribute('data-filter');

            caseCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterVal === 'all' || category === filterVal) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ==========================================================================
   FAQ Sliding Accordion
   ========================================================================== */
function initFAQAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.accordion-item');
            const body = item.querySelector('.accordion-body');
            const isActive = item.classList.contains('active');

            // Collapse all other active items
            document.querySelectorAll('.accordion-item.active').forEach(activeItem => {
                if (activeItem !== item) {
                    activeItem.classList.remove('active');
                    activeItem.querySelector('.accordion-body').style.maxHeight = '0';
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                body.style.maxHeight = '0';
            } else {
                item.classList.add('active');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });
}
