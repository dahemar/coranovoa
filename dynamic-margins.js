// ===== SMOOTH RESPONSIVE MARGIN ADJUSTMENT SYSTEM =====
// This script calculates dynamic left margins to keep content centered as window shrinks

(function() {
    'use strict';
    
    // Only run on desktop (769px and above)
    if (window.innerWidth < 769) return;
    
    let resizeTimeout;
    let isInitialLoad = true;
    
    function calculateDynamicMargin() {
        const windowWidth = window.innerWidth;
        
        // Base calculation: smooth interpolation between breakpoints
        let margin;
        
        if (windowWidth >= 1200) {
            // Large screens: 160px margin
            margin = 160;
        } else if (windowWidth >= 769) {
            // Smooth interpolation between 769px and 1200px
            const ratio = (windowWidth - 769) / (1200 - 769);
            margin = 40 + (ratio * 120); // From 40px to 160px
        } else {
            // Mobile: use default mobile styles
            margin = 40;
        }
        
        // Apply the calculated margin
        document.documentElement.style.setProperty('--dynamic-margin', margin + 'px');
    }
    
    function enableTransitions() {
        // Add transitioning class to enable CSS transitions
        const overlayContent = document.querySelector('.overlay-content');
        const overlayHeader = document.querySelector('.overlay-header');
        
        if (overlayContent) overlayContent.classList.add('transitioning');
        if (overlayHeader) overlayHeader.classList.add('transitioning');
    }
    
    function disableTransitions() {
        // Remove transitioning class to disable CSS transitions
        const overlayContent = document.querySelector('.overlay-content');
        const overlayHeader = document.querySelector('.overlay-header');
        
        if (overlayContent) overlayContent.classList.remove('transitioning');
        if (overlayHeader) overlayHeader.classList.remove('transitioning');
    }
    
    // Calculate on load without transitions
    calculateDynamicMargin();
    
    // Enable transitions after initial load
    window.addEventListener('load', function() {
        setTimeout(() => {
            isInitialLoad = false;
            enableTransitions();
        }, 100);
    });
    
    // Calculate on resize with debouncing and transitions
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        
        // Only enable transitions if not initial load
        if (!isInitialLoad) {
            enableTransitions();
        }
        
        resizeTimeout = setTimeout(function() {
            calculateDynamicMargin();
            
            // Disable transitions after resize completes
            if (!isInitialLoad) {
                setTimeout(disableTransitions, 300);
            }
        }, 16); // ~60fps
    });
    
    // Recalculate when orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(calculateDynamicMargin, 100);
    });
})(); 