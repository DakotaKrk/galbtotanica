(function() {
    'use strict';

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMobile = document.getElementById('navMobile');
    const heroVideo = document.getElementById('heroVideo');
    const heroFallbackImage = document.getElementById('heroFallbackImage');
    const backToTopBtn = document.getElementById('backToTop');
    const pages = document.querySelectorAll('.page');
    const allNavLinks = document.querySelectorAll('[data-page]');

    let currentPage = 'home';

    function toggleMobileMenu() {
        const isOpen = mobileMenuBtn.classList.contains('active');
        
        mobileMenuBtn.classList.toggle('active');
        navMobile.classList.toggle('active');
        
        mobileMenuBtn.setAttribute('aria-expanded', String(!isOpen));
        mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Öppna meny' : 'Stäng meny');
    }

    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        navMobile.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Öppna meny');
    }

    function switchPage(pageName) {
        if (pageName === currentPage) {
            closeMobileMenu();
            return;
        }

        pages.forEach(function(page) {
            page.classList.remove('active');
        });

        const targetPage = document.getElementById('page-' + pageName);
        if (targetPage) {
            targetPage.classList.add('active');
            currentPage = pageName;
        }

        updateActiveNavLinks(pageName);
        closeMobileMenu();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        history.pushState(null, '', '#' + pageName);
    }

    function updateActiveNavLinks(activePage) {
        allNavLinks.forEach(function(link) {
            const linkPage = link.getAttribute('data-page');
            
            if (linkPage === activePage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function handleVideoError() {
        if (heroVideo && heroFallbackImage) {
            heroVideo.style.display = 'none';
            heroFallbackImage.classList.add('visible');
        }
    }

    function handleInitialHash() {
        const hash = window.location.hash.replace('#', '');
        const validPages = ['home', 'about', 'contact'];
        
        if (hash && validPages.includes(hash)) {
            switchPage(hash);
        }
    }

    function handlePopState() {
        const hash = window.location.hash.replace('#', '') || 'home';
        const validPages = ['home', 'about', 'contact'];
        
        if (validPages.includes(hash)) {
            pages.forEach(function(page) {
                page.classList.remove('active');
            });

            const targetPage = document.getElementById('page-' + hash);
            if (targetPage) {
                targetPage.classList.add('active');
                currentPage = hash;
            }

            updateActiveNavLinks(hash);
            closeMobileMenu();
        }
    }

    function handleScroll() {
        const scrollPosition = window.scrollY;
        const showThreshold = 300;

        if (scrollPosition > showThreshold) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    allNavLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const pageName = this.getAttribute('data-page');
            switchPage(pageName);
        });
    });

    if (heroVideo) {
        heroVideo.addEventListener('error', handleVideoError);
        
        const videoSource = heroVideo.querySelector('source');
        if (videoSource) {
            videoSource.addEventListener('error', handleVideoError);
        }
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
        window.addEventListener('scroll', handleScroll);
    }

    window.addEventListener('popstate', handlePopState);

    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navMobile && navMobile.contains(event.target);
        const isClickOnButton = mobileMenuBtn && mobileMenuBtn.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnButton && navMobile && navMobile.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMobile && navMobile.classList.contains('active')) {
            closeMobileMenu();
            mobileMenuBtn.focus();
        }
    });

    handleInitialHash();
})();
