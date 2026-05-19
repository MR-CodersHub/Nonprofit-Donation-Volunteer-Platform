document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Preloader
    // ==========================================================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
        // Fallback in case load event already fired
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1500);
    }

    // ==========================================================================
    // Dark / Light Mode Toggle
    // ==========================================================================
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeToggleIcon(savedTheme);
    } else if (systemPrefersDark) {
        htmlElement.setAttribute('data-theme', 'dark');
        updateThemeToggleIcon('dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeToggleIcon(newTheme);
        });
    }

    function updateThemeToggleIcon(theme) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'fa-solid fa-sun';
            } else {
                icon.className = 'fa-solid fa-moon';
            }
        }
    }

    // ==========================================================================
    // User Account Dropdown Menu Toggle & Close Outside
    // ==========================================================================
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userDropdown = document.getElementById('user-dropdown');

    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        // Close when selecting a menu item
        userDropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                userDropdown.classList.remove('show');
            });
        });

        // Close when clicking outside the dropdown
        document.addEventListener('click', (e) => {
            if (!userDropdown.contains(e.target) && !userMenuBtn.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });

        // Close when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                userDropdown.classList.remove('show');
            }
        });
    }

    // ==========================================================================
    // Sticky Navbar & Mobile Hamburger Menu
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        highlightNavLinkOnScroll();
    });

    const navOverlay = document.getElementById('nav-overlay');

    // Toggle menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            if (navOverlay) navOverlay.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.className = 'fa-solid fa-xmark';
                } else {
                    icon.className = 'fa-solid fa-bars';
                }
            }
        });
    }

    // Close menu when clicking overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            navOverlay.classList.remove('active');
            if (hamburger) {
                const icon = hamburger.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            }
        });
    }

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (navOverlay) navOverlay.classList.remove('active');
            if (hamburger) {
                const icon = hamburger.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            }
        });
    });

    // ==========================================================================
    // Active Nav Link — Page-based detection (multi-page site)
    // ==========================================================================
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Map of pages that should highlight a specific nav item
        const activeMap = {
            'index.html':                'index.html',
            '':                          'index.html',
            'home2.html':                'home2.html',
            'about.html':                'about.html',
            'events.html':               'events.html',
            'campaigns.html':            'campaigns.html',
            'volunteer.html':            'volunteer.html',
            'volunteer-registration.html':'volunteer.html',
            'blog.html':                 'blog.html',
            'blog-fundraising.html':     'blog.html',
            'blog-education.html':       'blog.html',
            'blog-healthcare.html':      'blog.html',
            'blog-sustainability.html':  'blog.html',
            'blog-disaster-relief.html': 'blog.html',
            'blog-volunteer.html':       'blog.html',
            'contact.html':              'contact.html',
        };

        const targetHref = activeMap[currentPage];

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (targetHref && href === targetHref) {
                link.classList.add('active');
            }
        });
    }

    // Run on page load
    setActiveNavLink();

    // Scroll-based highlighting for single-page sections (index / home2)
    function highlightNavLinkOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        if (!sections.length) return;

        const scrollPosition = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ==========================================================================
    // Causes / Campaigns Filtering Functionality
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const campaignCards = document.querySelectorAll('.campaign-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            campaignCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ==========================================================================
    // Counter Animation Logic
    // ==========================================================================
    const counterSection = document.getElementById('counter-section');
    const counterNumbers = document.querySelectorAll('.stat-number');
    let counterAnimated = false;

    const animateCounters = () => {
        counterNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const count = +counter.innerText;
            const speed = 200; // Alter duration
            const increment = target / speed;

            const updateCount = () => {
                const currentCount = +counter.innerText;
                if (currentCount < target) {
                    counter.innerText = Math.ceil(currentCount + increment);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    const handleScrollForCounters = () => {
        if (!counterSection) return;
        
        const sectionPosition = counterSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;

        if (sectionPosition < screenPosition && !counterAnimated) {
            animateCounters();
            counterAnimated = true;
        }
    };

    window.addEventListener('scroll', handleScrollForCounters);
    handleScrollForCounters(); // Run once in case already in view on load

    // ==========================================================================
    // Modal Open & Close Handler
    // ==========================================================================
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Stop page scrolling
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto'; // Re-enable page scrolling
        }
    };

    // Close modal by clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    // ==========================================================================
    // Interactive Donation Form
    // ==========================================================================
    const donationForm = document.getElementById('donationForm');
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customAmountBtn = document.getElementById('customAmountBtn');
    const customAmountWrapper = document.getElementById('customAmountWrapper');
    const customAmountInput = document.getElementById('customAmount');
    const donateBtnAmount = document.getElementById('donateBtnAmount');

    let selectedAmount = 50;

    amountBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            amountBtns.forEach(b => b.classList.remove('active'));
            
            if (btn.id === 'customAmountBtn') {
                if (customAmountWrapper) customAmountWrapper.classList.remove('hidden');
                btn.classList.add('active');
                selectedAmount = (customAmountInput && customAmountInput.value) || 0;
                if (donateBtnAmount) donateBtnAmount.innerText = `$${selectedAmount}`;
                if (customAmountInput) customAmountInput.focus();
            } else {
                if (customAmountWrapper) customAmountWrapper.classList.add('hidden');
                btn.classList.add('active');
                selectedAmount = btn.getAttribute('data-amount');
                if (donateBtnAmount) donateBtnAmount.innerText = `$${selectedAmount}`;
            }
        });
    });

    if (customAmountInput) {
        customAmountInput.addEventListener('input', () => {
            selectedAmount = customAmountInput.value || 0;
            if (donateBtnAmount) donateBtnAmount.innerText = `$${selectedAmount}`;
        });
    }

    if (donationForm) {
        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('donorName').value;
            const email = document.getElementById('donorEmail').value;
            
            if (!name || !email || selectedAmount <= 0) {
                showToast('Please fill out all fields correctly.', 'error');
                return;
            }

            closeModal('donateModal');
            showToast(`Thank you, ${name}! Your donation of $${selectedAmount} has been processed successfully.`, 'success');
            donationForm.reset();
            
            // Reset to default active $50 button
            amountBtns.forEach(b => b.classList.remove('active'));
            if (amountBtns[1]) amountBtns[1].classList.add('active');
            if (customAmountWrapper) customAmountWrapper.classList.add('hidden');
            selectedAmount = 50;
            if (donateBtnAmount) donateBtnAmount.innerText = `$50`;
        });
    }

    // ==========================================================================
    // Volunteer Registration Form Handler
    // ==========================================================================
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('volName').value;
            const email = document.getElementById('volEmail').value;
            const phone = document.getElementById('volPhone').value;
            const interest = document.getElementById('volInterest').value;
            
            if (!name || !email || !phone || !interest) {
                showToast('Please complete all required fields.', 'error');
                return;
            }

            closeModal('volunteerModal');
            showToast(`Thank you, ${name}! Your volunteer application has been received. We'll contact you soon.`, 'success');
            volunteerForm.reset();
        });
    }

    // ==========================================================================
    // Contact Form Handler
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            showToast(`Thank you, ${name}! Your request has been sent. We will get back to you shortly.`, 'success');
            contactForm.reset();
        });
    }

    // ==========================================================================
    // FAQ Accordion
    // ==========================================================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all items
                faqItems.forEach(i => {
                    i.classList.remove('active');
                    const ans = i.querySelector('.faq-answer');
                    if (ans) ans.style.maxHeight = null;
                });
                
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });

    // ==========================================================================
    // Toast Notification System
    // ==========================================================================
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast ? toast.querySelector('.toast-icon') : null;

    function showToast(message, type = 'success') {
        if (!toast || !toastMessage) return;
        toastMessage.innerText = message;
        
        if (type === 'success') {
            toast.style.borderLeftColor = 'var(--clr-secondary)';
            if (toastIcon) {
                toastIcon.className = 'fa-solid fa-circle-check toast-icon';
                toastIcon.style.color = 'var(--clr-secondary)';
            }
        } else {
            toast.style.borderLeftColor = 'var(--clr-accent)';
            if (toastIcon) {
                toastIcon.className = 'fa-solid fa-circle-xmark toast-icon';
                toastIcon.style.color = 'var(--clr-accent)';
            }
        }
        
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('show');
        }, 50);

        // Auto-close after 5 seconds
        setTimeout(closeToast, 5000);
    }

    window.closeToast = function() {
        if (!toast) return;
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    };

    // ==========================================================================
    // Newsletter form subscription
    // ==========================================================================
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thank you for subscribing to our newsletter!', 'success');
            newsletterForm.reset();
        });
    }
});
