(function() {
    'use strict';

    // Preloader
    var preloader = document.getElementById('preloader');
    var preloaderStart = Date.now();
    var minDisplayTime = 1500;
    
    window.addEventListener('load', function() {
        if (preloader) {
            var elapsed = Date.now() - preloaderStart;
            var remaining = Math.max(0, minDisplayTime - elapsed);
            
            setTimeout(function() {
                preloader.classList.add('hidden');
            }, remaining);
        }
    });

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

    function handleVideoError() {
        if (heroVideo && heroFallbackImage) {
            heroVideo.style.display = 'none';
            heroFallbackImage.classList.add('visible');
        }
    }

    function handleScroll() {
        if (!backToTopBtn) return;
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function scrollGallery(direction) {
        if (!galleryScroll) return;
        var amount = 340;
        var newPos = galleryScroll.scrollLeft + (direction === 'next' ? amount : -amount);
        galleryScroll.scrollTo({ left: newPos, behavior: 'smooth' });
    }

    function openLightbox(src, alt) {
        if (!lightbox || !lightboxImage) return;
        lightboxImage.src = src;
        lightboxImage.alt = alt || '';
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

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    if (heroVideo) {
        heroVideo.addEventListener('error', handleVideoError);
        var source = heroVideo.querySelector('source');
        if (source) source.addEventListener('error', handleVideoError);
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
        window.addEventListener('scroll', handleScroll);
    }

    if (galleryPrev) {
        galleryPrev.addEventListener('click', function() { scrollGallery('prev'); });
    }

    if (galleryNext) {
        galleryNext.addEventListener('click', function() { scrollGallery('next'); });
    }

    galleryItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var src = this.getAttribute('data-lightbox');
            var alt = this.querySelector('img').alt;
            openLightbox(src, alt);
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('click', function(e) {
        if (!navMobile || !mobileMenuBtn) return;
        var insideMenu = navMobile.contains(e.target);
        var onButton = mobileMenuBtn.contains(e.target);
        if (!insideMenu && !onButton && navMobile.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (lightbox && lightbox.classList.contains('active')) {
                closeLightbox();
            } else if (navMobile && navMobile.classList.contains('active')) {
                closeMobileMenu();
                if (mobileMenuBtn) mobileMenuBtn.focus();
            }
        }
    });

    // Cookie banner
    var cookieBanner = document.getElementById('cookieBanner');
    var cookieAccept = document.getElementById('cookieAccept');
    var cookieDecline = document.getElementById('cookieDecline');

    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    function setCookie(name, value, days) {
        var expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + '=' + value + '; expires=' + expires + '; path=/; SameSite=Lax';
    }

    function showCookieBanner() {
        if (cookieBanner) {
            setTimeout(function() {
                cookieBanner.classList.add('visible');
            }, 1000);
        }
    }

    function hideCookieBanner() {
        if (cookieBanner) {
            cookieBanner.classList.remove('visible');
        }
    }

    function loadGoogleAnalytics() {
        // Replace GA_MEASUREMENT_ID with your actual Google Analytics ID
        var gaId = 'GA_MEASUREMENT_ID';
        if (gaId === 'GA_MEASUREMENT_ID') return;
        
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaId;
        document.head.appendChild(script);
        
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', gaId, { anonymize_ip: true });
    }

    if (!getCookie('cookie_consent')) {
        showCookieBanner();
    } else if (getCookie('cookie_consent') === 'accepted') {
        loadGoogleAnalytics();
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', function() {
            setCookie('cookie_consent', 'accepted', 365);
            hideCookieBanner();
            loadGoogleAnalytics();
        });
    }

    if (cookieDecline) {
        cookieDecline.addEventListener('click', function() {
            setCookie('cookie_consent', 'declined', 365);
            hideCookieBanner();
        });
    }
})();
