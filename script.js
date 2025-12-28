/**
 * Galbotanica Website JavaScript
 * Handles navigation, page switching, and video fallback
 */

(function() {
    'use strict';

    // ========================================
    // DOM Elements
    // ========================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMobile = document.getElementById('navMobile');
    const heroVideo = document.getElementById('heroVideo');
    const heroFallbackImage = document.getElementById('heroFallbackImage');
    const pages = document.querySelectorAll('.page');
    const allNavLinks = document.querySelectorAll('[data-page]');

    // ========================================
    // State
    // ========================================
    let currentPage = 'home';

    // ========================================
    // Navigation Functions
    // ========================================

    /**
     * Toggle mobile menu open/closed
     */
    function toggleMobileMenu() {
        const isOpen = mobileMenuBtn.classList.contains('active');
        
        mobileMenuBtn.classList.toggle('active');
        navMobile.classList.toggle('active');
        
        mobileMenuBtn.setAttribute('aria-expanded', String(!isOpen));
        mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Öppna meny' : 'Stäng meny');
    }

    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        navMobile.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Öppna meny');
    }

    /**
     * Switch to a different page
     * @param {string} pageName - The name of the page to switch to
     */
    function switchPage(pageName) {
        if (pageName === currentPage) {
            closeMobileMenu();
            return;
        }

        // Hide all pages
        pages.forEach(function(page) {
            page.classList.remove('active');
        });

        // Show selected page
        const targetPage = document.getElementById('page-' + pageName);
        if (targetPage) {
            targetPage.classList.add('active');
            currentPage = pageName;
        }

        // Update nav links
        updateActiveNavLinks(pageName);

        // Close mobile menu
        closeMobileMenu();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Update URL hash
        history.pushState(null, '', '#' + pageName);
    }

    /**
     * Update active state on all navigation links
     * @param {string} activePage - The currently active page
     */
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

    // ========================================
    // Video Fallback
    // ========================================

    /**
     * Handle video error - show fallback image
     */
    function handleVideoError() {
        if (heroVideo && heroFallbackImage) {
            heroVideo.style.display = 'none';
            heroFallbackImage.classList.add('visible');
        }
    }

    // ========================================
    // URL Hash Handling
    // ========================================

    /**
     * Handle initial page load based on URL hash
     */
    function handleInitialHash() {
        const hash = window.location.hash.replace('#', '');
        const validPages = ['home', 'about', 'contact'];
        
        if (hash && validPages.includes(hash)) {
            switchPage(hash);
        }
    }

    /**
     * Handle browser back/forward navigation
     */
    function handlePopState() {
        const hash = window.location.hash.replace('#', '') || 'home';
        const validPages = ['home', 'about', 'contact'];
        
        if (validPages.includes(hash)) {
            // Update page without pushing new history state
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

    // ========================================
    // Event Listeners
    // ========================================

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Navigation links
    allNavLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const pageName = this.getAttribute('data-page');
            switchPage(pageName);
        });
    });

    // Video error handling
    if (heroVideo) {
        heroVideo.addEventListener('error', handleVideoError);
        
        // Also check if video source fails
        const videoSource = heroVideo.querySelector('source');
        if (videoSource) {
            videoSource.addEventListener('error', handleVideoError);
        }
    }

    // Handle browser back/forward
    window.addEventListener('popstate', handlePopState);

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navMobile && navMobile.contains(event.target);
        const isClickOnButton = mobileMenuBtn && mobileMenuBtn.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnButton && navMobile && navMobile.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMobile && navMobile.classList.contains('active')) {
            closeMobileMenu();
            mobileMenuBtn.focus();
        }
    });

    // ========================================
    // Initialize
    // ========================================
    
    // Handle initial page based on URL hash
    handleInitialHash();

})();
