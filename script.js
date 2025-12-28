/**
 * Galbotanica Studio - JavaScript
 * 
 * Funktioner:
 * - Mobilmeny (hamburger)
 * - Video fallback
 * - Back to top-knapp
 * - Bildgalleri scroll
 * - Lightbox
 */

(function() {
    'use strict';

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    
    var mobileMenuBtn = document.getElementById('mobileMenuBtn');
    var navMobile = document.getElementById('navMobile');
    var heroVideo = document.getElementById('heroVideo');
    var heroFallbackImage = document.getElementById('heroFallbackImage');
    var backToTopBtn = document.getElementById('backToTop');
    var galleryScroll = document.getElementById('galleryScroll');
    var galleryPrev = document.getElementById('galleryPrev');
    var galleryNext = document.getElementById('galleryNext');
    var lightbox = document.getElementById('lightbox');
    var lightboxImage = document.getElementById('lightboxImage');
    var lightboxClose = document.getElementById('lightboxClose');
    var galleryItems = document.querySelectorAll('.gallery-item[data-lightbox]');


    // ==========================================================================
    // Mobile Menu
    // ==========================================================================

    function toggleMobileMenu() {
        if (!mobileMenuBtn || !navMobile) return;
        
        var isOpen = mobileMenuBtn.classList.contains('active');
        
        mobileMenuBtn.classList.toggle('active');
        navMobile.classList.toggle('active');
        
        mobileMenuBtn.setAttribute('aria-expanded', String(!isOpen));
        mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Öppna meny' : 'Stäng meny');
    }

    function closeMobileMenu() {
        if (!mobileMenuBtn || !navMobile) return;
        
        mobileMenuBtn.classList.remove('active');
        navMobile.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Öppna meny');
    }


    // ==========================================================================
    // Video Fallback
    // ==========================================================================

    function handleVideoError() {
        if (heroVideo && heroFallbackImage) {
            heroVideo.style.display = 'none';
            heroFallbackImage.classList.add('visible');
        }
    }


    // ==========================================================================
    // Back to Top
    // ==========================================================================

    function handleScroll() {
        if (!backToTopBtn) return;
        
        var scrollPosition = window.scrollY;
        var showThreshold = 300;

        if (scrollPosition > showThreshold) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }


    // ==========================================================================
    // Gallery
    // ==========================================================================

    function scrollGallery(direction) {
        if (!galleryScroll) return;
        
        var scrollAmount = 340;
        var currentScroll = galleryScroll.scrollLeft;
        var newScroll = direction === 'next' 
            ? currentScroll + scrollAmount 
            : currentScroll - scrollAmount;
        
        galleryScroll.scrollTo({ left: newScroll, behavior: 'smooth' });
    }


    // ==========================================================================
    // Lightbox
    // ==========================================================================

    function openLightbox(imageSrc, imageAlt) {
        if (!lightbox || !lightboxImage) return;
        
        lightboxImage.src = imageSrc;
        lightboxImage.alt = imageAlt || '';
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
    }

    function closeLightbox() {
        if (!lightbox || !lightboxImage) return;
        
        lightbox.classList.remove('active');
        document.body.classList.remove('lightbox-open');
        
        setTimeout(function() {
            lightboxImage.src = '';
            lightboxImage.alt = '';
        }, 300);
    }


    // ==========================================================================
    // Event Listeners
    // ==========================================================================

    // Mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Video error
    if (heroVideo) {
        heroVideo.addEventListener('error', handleVideoError);
        
        var videoSource = heroVideo.querySelector('source');
        if (videoSource) {
            videoSource.addEventListener('error', handleVideoError);
        }
    }

    // Back to top
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
        window.addEventListener('scroll', handleScroll);
    }

    // Gallery navigation
    if (galleryPrev) {
        galleryPrev.addEventListener('click', function() {
            scrollGallery('prev');
        });
    }

    if (galleryNext) {
        galleryNext.addEventListener('click', function() {
            scrollGallery('next');
        });
    }

    // Gallery lightbox
    galleryItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var imageSrc = this.getAttribute('data-lightbox');
            var imageAlt = this.querySelector('img').alt;
            openLightbox(imageSrc, imageAlt);
        });
    });

    // Lightbox close
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', function(event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Close menus on outside click
    document.addEventListener('click', function(event) {
        if (!navMobile || !mobileMenuBtn) return;
        
        var isClickInsideMenu = navMobile.contains(event.target);
        var isClickOnButton = mobileMenuBtn.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnButton && navMobile.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Escape key handler
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (lightbox && lightbox.classList.contains('active')) {
                closeLightbox();
            } else if (navMobile && navMobile.classList.contains('active')) {
                closeMobileMenu();
                if (mobileMenuBtn) {
                    mobileMenuBtn.focus();
                }
            }
        }
    });

})();
