/* ========================================
   PORTFOLIO 2026 - Awwwards Creative Design
   Advanced Interactions & Animations
   Version 3.0
   ======================================== */

// Initialize immediately
initLoader();

document.addEventListener('DOMContentLoaded', () => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 
                          'ontouchstart' in window || 
                          navigator.maxTouchPoints > 0;

    initCustomCursor(isTouchDevice);
    initSmoothScroll();
    initNavigation();
    initFullscreenMenu();
    initRevealAnimations();
    PageTransition.init();
    initProjectModal();
    initParallax();
    initServiceCardsGlow(isTouchDevice);
    initButtonGlow(isTouchDevice);
    initBentoGlow(isTouchDevice);
    initLightbox();
    initServicesCarousel();
});

/* ----------------------------------------
   Loader / Preloader
   ---------------------------------------- */
function initLoader() {
    document.body.classList.add('loading');
    
    const loader = document.getElementById('loader');
    if (!loader) return;
    
    const progressBar = loader.querySelector('.loader__progress-bar');
    const percentText = loader.querySelector('.loader__percent');
    
    const MIN_LOADER_TIME = 2500;
    const loaderStartTime = Date.now();
    let progress = 0;
    let targetProgress = 0;
    let animationFrame = null;
    
    // Déclencher l'animation du SVG
    setTimeout(() => {
        loader.classList.add('is-animating');
    }, 100);
    
    const updateProgressSmooth = () => {
        const diff = targetProgress - progress;
        // On accélère l'attrape si on est loin, on ralentit si on est proche
        const factor = diff > 10 ? 0.1 : 0.05;
        progress += diff * factor;
        
        const displayProgress = Math.min(Math.round(progress), 100);
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (percentText) percentText.textContent = `${displayProgress}%`;
        
        if (Math.abs(diff) > 0.05) {
            animationFrame = requestAnimationFrame(updateProgressSmooth);
        } else {
            animationFrame = null;
        }
    };
    
    // Simulation temporelle plus précise
    const duration = 2200; // Temps pour atteindre 90%
    const startSim = Date.now();
    
    const simulate = () => {
        const elapsed = Date.now() - startSim;
        const ratio = Math.min(elapsed / duration, 1);
        
        // Courbe de progression (accélère puis ralentit vers la fin)
        const easeRatio = 1 - Math.pow(1 - ratio, 2); 
        targetProgress = easeRatio * 92;
        
        if (!animationFrame) {
            animationFrame = requestAnimationFrame(updateProgressSmooth);
        }
        
        if (ratio < 1) {
            setTimeout(simulate, 50);
        }
    };
    
    simulate();
    
    const hideLoader = () => {
        const elapsedTime = Date.now() - loaderStartTime;
        const remainingTime = Math.max(0, MIN_LOADER_TIME - elapsedTime);
        
        // Attendre le délai minimal ET la fin du chargement réel
        setTimeout(() => {
            targetProgress = 100;
            if (!animationFrame) {
                animationFrame = requestAnimationFrame(updateProgressSmooth);
            }
            
            // Petit délai pour laisser la barre finir son animation à 100%
            setTimeout(() => {
                loader.classList.add('loaded');
                document.body.classList.remove('loading');
                
                setTimeout(() => {
                    animateHeroEntrance();
                }, 200);
                
                setTimeout(() => {
                    loader.style.display = 'none';
                    if (animationFrame) cancelAnimationFrame(animationFrame);
                }, 800);
            }, 500);
        }, remainingTime);
    };
    
    window.addEventListener('load', () => {
        hideLoader();
    });
    
    // Fallback
    setTimeout(() => {
        if (!loader.classList.contains('loaded')) {
            hideLoader();
        }
    }, 8000);
}

/* ----------------------------------------
   Hero Entrance Animation
   ---------------------------------------- */
function animateHeroEntrance() {
    const heroElements = document.querySelectorAll('.hero__label, .hero__title-line, .hero__description, .hero__cta, .hero__stats');
    
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
}

/* ----------------------------------------
   Custom Cursor
   ---------------------------------------- */
function initCustomCursor(isTouchDevice) {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    // Check for touch device or no hover capability
    if (isTouchDevice) {
        cursor.style.display = 'none';
        follower.style.display = 'none';
        return;
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        // Cursor with slight smoothing
        cursorX += (mouseX - cursorX) * 0.3;
        cursorY += (mouseY - cursorY) * 0.3;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        // Follower with more delay
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .bento-item, [data-cursor="hover"]');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            follower.classList.add('active');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            follower.classList.remove('active');
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
    });
}

/* ----------------------------------------
   Smooth Scroll
   ---------------------------------------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Close mobile menu if open
            const menu = document.querySelector('.fullscreen-menu');
            const menuBtn = document.querySelector('.nav__menu-btn');
            if (menu && menu.classList.contains('active')) {
                menu.classList.remove('active');
                menuBtn?.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
            
            // Si c'est juste "#", retour en haut
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 0;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ----------------------------------------
   Navigation
   ---------------------------------------- */
function initNavigation() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');
    const sections = document.querySelectorAll('section[id]');
    let lastScroll = 0;
    let ticking = false;
    
    // Active link based on scroll position
    function updateActiveLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        // Remove active if at top (hero)
        if (scrollY < 300) {
            navLinks.forEach(link => link.classList.remove('active'));
        }
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial check
    updateActiveLink();
}

/* ----------------------------------------
   Fullscreen Menu
   ---------------------------------------- */
function initFullscreenMenu() {
    const menuBtn = document.querySelector('.nav__menu-btn');
    const menu = document.querySelector('.fullscreen-menu');
    
    if (!menuBtn || !menu) return;
    
    menuBtn.addEventListener('click', () => {
        const isActive = menu.classList.contains('active');
        
        if (isActive) {
            menu.classList.remove('active');
            menuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        } else {
            menu.classList.add('active');
            menuBtn.classList.add('active');
            document.body.classList.add('menu-open');
        }
    });
    
    // Close menu on link click
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            menuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            menu.classList.remove('active');
            menuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

/* ----------------------------------------
   Reveal Animations (Intersection Observer)
   ---------------------------------------- */
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    const staggerElements = document.querySelectorAll('[data-stagger]');
    
    // Also add reveal to key sections
    const sections = document.querySelectorAll('.section-header, .bento-item, .service-card, .about__image-col, .about__content-col, .testimonial');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));
    staggerElements.forEach(el => observer.observe(el));
    
    // For sections without data-reveal
    sections.forEach((el, index) => {
        if (!el.hasAttribute('data-reveal')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s`;
            
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        sectionObserver.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            sectionObserver.observe(el);
        }
    });
}

/* ----------------------------------------
   Parallax Effects
   ---------------------------------------- */
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    const heroBgText = document.querySelector('.hero__bg-text');
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                // Hero background text parallax
                if (heroBgText) {
                    heroBgText.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.3}px))`;
                }
                
                // Generic parallax elements
                parallaxElements.forEach(el => {
                    const speed = el.dataset.parallax || 0.5;
                    const yPos = scrolled * speed;
                    el.style.transform = `translateY(${yPos}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* ----------------------------------------
   Page Transition Manager
   ---------------------------------------- */
const PageTransition = {
    element: null,
    panel: null,
    isAnimating: false,
    
    init() {
        this.element = document.querySelector('.page-transition');
        this.panel = document.querySelector('.page-transition__panel');
    },
    
    animate(callback, reverse = false) {
        if (this.isAnimating || !this.element) {
            if (callback) callback();
            return;
        }
        
        this.isAnimating = true;
        
        if (reverse) {
            this.element.classList.add('is-reverse');
        } else {
            this.element.classList.remove('is-reverse');
        }
        
        // Start In Animation
        this.element.classList.remove('is-animating-out');
        this.element.classList.add('is-animating-in');
        
        // Wait for In Animation (0.8s)
        setTimeout(() => {
            // Execute callback (change content)
            if (callback) callback();

            // Start Out Animation
            this.element.classList.remove('is-animating-in');
            this.element.classList.add('is-animating-out');
            
            // Reset after Out Animation (0.8s)
            setTimeout(() => {
                this.element.classList.remove('is-animating-out');
                this.element.classList.remove('is-reverse');
                this.isAnimating = false;
            }, 800);
            
        }, 800);
    }
};

/* ----------------------------------------
   Project Modal System
   ---------------------------------------- */
function initProjectModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    
    const backdrop = modal.querySelector('.project-modal__backdrop');
    const closeBtn = modal.querySelector('.project-modal__close');
    const prevBtn = modal.querySelector('.project-modal__nav-btn--prev');
    const nextBtn = modal.querySelector('.project-modal__nav-btn--next');
    const projectItems = document.querySelectorAll('.bento-item[data-project]');
    
    // Project data
    const projectsData = {
        optiwits: {
            number: '01',
            title: 'Blue',
            subtitle: 'Elle sert à désigner un sam',
            year: '2022',
            role: 'Full-Stack Developer & UX/UI Designer',
            context: 'Stage M2 - GreenWITS',
            description: `
            Réalisation d'un concept d'application qui sert à désigner un ou plusieurs SAM avant de partir en soirée. Elle est là pour rassurer les utilisateurs et les mettre en sécurité.

            Le concept a été fait en réfléchissant au parcours utilisateur, à rendre l'application la plus ergonomique possible et très simple à comprendre.
            `,
            tags: ['Parcours utilisateur', 'UX/UI', 'Figma'],
            stack: ['Figma'],
            images: [
                'assets/images/blue1.png',
            ],
            links: [            ]
        },
        ccp: {
            number: '02',
            title: 'MaQuestionMedicale',
            subtitle: "Refonte de l'UX/UI Design du site",
            year: '2025',
            description: `
            Refonte et front-end de l'UX/UI Design du site MaQuestionMedicale, un site spécialisé dans la santé qui permet de faire des téléconsultations médicales avec des médecins.
            `,
            tags: ['B2B', 'CRM', 'PHP'],
            stack: ['Vue.JS', 'PHP', 'MySQL', 'JavaScript', 'Symfony', 'GitHub'],
            images: [
                'assets/images/MQM.png',
            ],
        },
        modnation: {
            number: '03',
            title: 'BPMN',
            subtitle: "Réalisation d'un Erp de Bpmn.",
            year: '2024',
            role: 'Full-Stack Developer',
            context: 'Projet Personnel',
            description: `
            Ce travail a été fait pendant mon stage chez Synktory. Le but est de réaliser une application de diagramme de Bpmn qui sert à documenter une séquence d'événements nécessaires pour exécuter un processus métier d'une façon standardisée et facile à comprendre.

            Un processus métier est un ensemble d'activités mis en place pour réaliser une tâche, un projet ou atteindre un objectif.
            `,
            tags: ['ERP', 'Vue.js', 'API'],
            stack: ['Vue.js', 'PHP', 'UX/UI'],
            images: [
                'assets/images/bpmn.png',
            ],
        },
        portfolio: {
            number: '04',
            title: 'Un Coin Chez Moi',
            subtitle: "Réalisation de la maquette d'une application de logement intergénérationnel.",
            year: '2024 - 2025',
            role: 'Designer & Developer',
            context: 'Projet Personnel',
            description: `
            Le but était de réaliser une application de logement intergénérationnel, dans le même cadre qu'une vraie entreprise. Cela comprenait la partie, gestion/chef de projet, la partie marketing (réfléchir au concept, faire une étude de marché, sonder les gens...), la partie ux/ui (maquette, motion design, storyboard...) et la partie développement.

            Personnellement, je me suis occupé de la maquette, de la vidéo promotionnelle en motion design et des sondages.
            `,
            tags: ['Vue.js', 'Maquette', 'DESIGN'],
            stack: ['HTML/CSS', 'JavaScript', 'Vue.js', 'Figma'],
            images: [
                'assets/images/uccm2.png',
            ],
        },
        secret: {
            number: '05',
            title: 'Création de jeu',
            subtitle: "Réalisation d'un jeu sur les déperditions thermiques.",
            year: '2023',
            description: `
            Le but de ce travail était de réaliser un jeu où il faut déplacer des étiquettes dans des cases afin de classer les endroits de la maison du plus au moins isolé.
            `,
            tags: ['Maquette', 'UX/UI', 'Design'],
            stack: ['Angular', 'Javascript', 'TypeScript', 'Figma'],
            images: ['assets/images/jeuFrEnergy.png',],
            links: []
        },
        youtube: {
            number: '06',
            title: 'Calepin',
            subtitle: "Réalisation d'une application dans une entreprise d'échafaudage",
            year: '2022',
            role: 'Créateur & Monteur',
            context: 'Projet Personnel',
            description: `
            Le but de ce travail était de réaliser une application utilisée en interne à SAIT, une entreprise d'échaffaudage et d'isolation thermique.
            Elle permet de rentrer les dimensions des échafaudages, le nombre de personnes dans l'équipe, le taux horaire etc. Cela calcule automatiquement le nombre de matériel à utiliser, le poids, le prix du chantier ainsi que d'autres informations.
            
            L'application a été faite avec le langage WinDev.
            `,
            tags: ['Full-stack', 'Windev'],
            stack: ['Full-stack', 'Windev'],
            images: [
                'assets/images/calepin.png'
            ],
        }
    };
    
    const projectKeys = Object.keys(projectsData);
    let currentProjectIndex = 0;
    
    function openModal(projectId) {
        const project = projectsData[projectId];
        if (!project) return;
        
        PageTransition.animate(() => {
            currentProjectIndex = projectKeys.indexOf(projectId);
            updateModalContent(project);
            
            modal.classList.add('active');
            document.body.classList.add('modal-open');
            
            updateNavButtons();
        });
    }
    
    function closeModal() {
        PageTransition.animate(() => {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }, true);
    }
    
    function updateModalContent(project) {
        modal.querySelector('.project-modal__number').textContent = project.number;
        modal.querySelector('.project-modal__title').textContent = project.title;
        modal.querySelector('.project-modal__subtitle').textContent = project.subtitle;
        modal.querySelector('.project-modal__year').textContent = project.year;
        modal.querySelector('.project-modal__description').innerHTML = project.description;
        
        // Handle Images
        const imageContainer = modal.querySelector('.project-modal__image');
        if (imageContainer) {
            imageContainer.innerHTML = ''; // Clear existing content
            imageContainer.className = 'project-modal__image'; // Reset classes
            
            if (project.images && Array.isArray(project.images) && project.images.length > 0) {
                // Add classes for grid layout
                imageContainer.classList.add(`has-${project.images.length}-images`);
                if (project.images.length > 1) imageContainer.classList.add('is-gallery');
                
                project.images.forEach(imgSrc => {
                    const imgWrapper = document.createElement('div');
                    imgWrapper.className = 'project-modal__image-wrapper';
                    imgWrapper.setAttribute('data-cursor', 'hover');
                    
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = project.title;
                    img.loading = 'lazy';
                    
                    // Overlay for hover effect
                    const overlay = document.createElement('div');
                    overlay.className = 'project-modal__image-overlay';
                    
                    imgWrapper.appendChild(img);
                    imgWrapper.appendChild(overlay);
                    imageContainer.appendChild(imgWrapper);

                    // Lightbox Event
                    imgWrapper.addEventListener('click', () => {
                        openLightbox(imgSrc, project.title);
                    });

                    // Custom Cursor Events
                    imgWrapper.addEventListener('mouseenter', () => {
                        const cursor = document.querySelector('.cursor');
                        const follower = document.querySelector('.cursor-follower');
                        if (cursor && follower) {
                            cursor.classList.add('active');
                            follower.classList.add('active');
                        }
                    });
                    
                    imgWrapper.addEventListener('mouseleave', () => {
                        const cursor = document.querySelector('.cursor');
                        const follower = document.querySelector('.cursor-follower');
                        if (cursor && follower) {
                            cursor.classList.remove('active');
                            follower.classList.remove('active');
                        }
                    });
                });
            }
        }

        const tagsContainer = modal.querySelector('.project-modal__tags');
        tagsContainer.innerHTML = project.tags.map(tag => 
            `<span class="tag mono-text">${tag}</span>`
        ).join('');
        
        const stackContainer = modal.querySelector('.project-modal__stack-list');
        stackContainer.innerHTML = project.stack.map(tech => 
            `<span class="tag mono-text">${tech}</span>`
        ).join('');
        
        const linksContainer = modal.querySelector('.project-modal__links');
        const linksWrapper = modal.querySelector('.project-modal__links-container');
        
        if (linksContainer && linksWrapper) {
            linksContainer.innerHTML = '';
            
            if (project.links && Array.isArray(project.links) && project.links.length > 0) {
                linksWrapper.style.display = 'block';
                
                project.links.forEach((link) => {
                    const btn = document.createElement('a');
                    btn.href = link.url;
                    btn.target = '_blank';
                    btn.className = 'project-modal__sidebar-link';
                    
                    let iconSvg = '';
                    if (link.icon === 'file') {
                        iconSvg = `
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                                <polyline points="13 2 13 9 20 9"/>
                            </svg>
                        `;
                    } else {
                        // Default to link icon
                        iconSvg = `
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                        `;
                    }
                    
                    btn.innerHTML = `
                        ${iconSvg}
                        <span>${link.label}</span>
                    `;
                    
                    // Add hover effect for custom cursor
                    btn.addEventListener('mouseenter', () => {
                        const cursor = document.querySelector('.cursor');
                        const follower = document.querySelector('.cursor-follower');
                        if (cursor && follower) {
                            cursor.classList.add('active');
                            follower.classList.add('active');
                        }
                    });
                    
                    btn.addEventListener('mouseleave', () => {
                        const cursor = document.querySelector('.cursor');
                        const follower = document.querySelector('.cursor-follower');
                        if (cursor && follower) {
                            cursor.classList.remove('active');
                            follower.classList.remove('active');
                        }
                    });
                    
                    linksContainer.appendChild(btn);
                });
            } else {
                linksWrapper.style.display = 'none';
            }
        }
    }
    
    function updateNavButtons() {
        prevBtn.disabled = currentProjectIndex === 0;
        nextBtn.disabled = currentProjectIndex === projectKeys.length - 1;
    }
    
    function goToPrevProject() {
        if (currentProjectIndex > 0) {
            currentProjectIndex--;
            const projectId = projectKeys[currentProjectIndex];
            updateModalContent(projectsData[projectId]);
            updateNavButtons();
        }
    }
    
    function goToNextProject() {
        if (currentProjectIndex < projectKeys.length - 1) {
            currentProjectIndex++;
            const projectId = projectKeys[currentProjectIndex];
            updateModalContent(projectsData[projectId]);
            updateNavButtons();
        }
    }
    
    // Event listeners
    projectItems.forEach(item => {
        item.addEventListener('click', () => {
            const projectId = item.dataset.project;
            openModal(projectId);
        });
    });
    
    closeBtn?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);
    prevBtn?.addEventListener('click', goToPrevProject);
    nextBtn?.addEventListener('click', goToNextProject);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') goToPrevProject();
        if (e.key === 'ArrowRight') goToNextProject();
    });
}

/* ----------------------------------------
   Lightbox System
   ---------------------------------------- */
function initLightbox() {
    // Create Lightbox DOM
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox__close" aria-label="Fermer">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
        </button>
        <div class="lightbox__content">
            <img src="" alt="" class="lightbox__img">
        </div>
    `;
    document.body.appendChild(lightbox);

    const closeBtn = lightbox.querySelector('.lightbox__close');
    const img = lightbox.querySelector('.lightbox__img');

    // Close functions
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
            img.src = '';
        }, 400);

        // Reset cursor state when closing
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        if (cursor && follower) {
            cursor.classList.remove('active');
            follower.classList.remove('active');
        }
    };

    closeBtn.addEventListener('click', closeLightbox);

    // Custom Cursor for Close Button
    closeBtn.addEventListener('mouseenter', () => {
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        if (cursor && follower) {
            cursor.classList.add('active');
            follower.classList.add('active');
        }
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        if (cursor && follower) {
            cursor.classList.remove('active');
            follower.classList.remove('active');
        }
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

function openLightbox(src, alt) {
    const lightbox = document.getElementById('lightbox');
    const img = lightbox.querySelector('.lightbox__img');
    
    if (!lightbox || !img) return;

    img.src = src;
    img.alt = alt || '';
    lightbox.classList.add('active');
}

/* ----------------------------------------
   Service Cards Glow Effect
   ---------------------------------------- */
function initServiceCardsGlow(isTouchDevice) {
    if (isTouchDevice) return;
    
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });
}

/* ----------------------------------------
   Button Glow Effect (follows cursor)
   ---------------------------------------- */
function initButtonGlow(isTouchDevice) {
    if (isTouchDevice) return;
    
    const wrappers = document.querySelectorAll('.btn-wrapper');
    const PARALLAX_STRENGTH = 20; // pixels
    
    wrappers.forEach(wrapper => {
        wrapper.addEventListener('mousemove', (e) => {
            const rect = wrapper.getBoundingClientRect();
            // Normalize to -1 to 1 range (center = 0)
            const normalizedX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const normalizedY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            
            // Inverse parallax: mouse goes right, text goes left
            const translateX = -normalizedX * PARALLAX_STRENGTH;
            const translateY = -normalizedY * PARALLAX_STRENGTH;
            
            wrapper.style.setProperty('--translate-x', `${translateX}px`);
            wrapper.style.setProperty('--translate-y', `${translateY}px`);
        });
        
        wrapper.addEventListener('mouseleave', () => {
            // Smooth return to center
            wrapper.style.setProperty('--translate-x', '0px');
            wrapper.style.setProperty('--translate-y', '0px');
        });
    });
}

// Bento Items Glow Effect
function initBentoGlow(isTouchDevice) {
    if (isTouchDevice) return;
    
    const bentoItems = document.querySelectorAll('.bento-item');
    
    bentoItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            item.style.setProperty('--mouse-x', `${x}%`);
            item.style.setProperty('--mouse-y', `${y}%`);
        });
    });
}

/* ----------------------------------------
   Services Carousel Navigation
   ---------------------------------------- */
function initServicesCarousel() {
    const grid = document.querySelector('.services__grid');
    const dots = document.querySelectorAll('.services__dot');
    const prevBtn = document.querySelector('.services__nav-btn--prev');
    const nextBtn = document.querySelector('.services__nav-btn--next');
    const cards = document.querySelectorAll('.service-card');
    
    if (!grid || !dots.length || !cards.length) return;
    
    let currentIndex = 0;
    const totalCards = cards.length;
    
    // Update active dot
    const updateDots = (index) => {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    };
    
    // Scroll to card
    const scrollToCard = (index) => {
        if (index < 0) index = 0;
        if (index >= totalCards) index = totalCards - 1;
        
        currentIndex = index;
        const card = cards[index];
        
        if (card) {
            card.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest'
            });
        }
        
        updateDots(currentIndex);
    };
    
    // Dot clicks
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            scrollToCard(index);
        });
    });
    
    // Arrow clicks
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            scrollToCard(currentIndex - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            scrollToCard(currentIndex + 1);
        });
    }
    
    // Detect scroll and update dots
    let scrollTimeout;
    grid.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const gridRect = grid.getBoundingClientRect();
            const gridCenter = gridRect.left + gridRect.width / 2;
            
            let closestIndex = 0;
            let closestDistance = Infinity;
            
            cards.forEach((card, index) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2;
                const distance = Math.abs(gridCenter - cardCenter);
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });
            
            if (closestIndex !== currentIndex) {
                currentIndex = closestIndex;
                updateDots(currentIndex);
            }
        }, 50);
    }, { passive: true });
}

/* ----------------------------------------
   Bento Grid Hover Effect
   ---------------------------------------- */
document.querySelectorAll('.bento-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    item.addEventListener('mouseleave', function() {
        setTimeout(() => {
            this.style.zIndex = '1';
        }, 300);
    });
});

// • Stack: HTML5, CSS3 (BEM), Vanilla JS
// • Performance: Critical CSS, Defer Loading
// • Animation: Custom RAF & Observers
