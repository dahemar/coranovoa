let currentLanguage = 'gal';

// Funciones de utilidad
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Funcionalidad del cambio de idioma
const translations = {
    "gal": {
        "obra": "obra",
        "bio": "bio",
        "curaduria": "curaduría",
        "aldan": "aldán",
        "contacto": "contacto"
        // ... resto de traducciones
    },
    "esp": {
        "obra": "obra",
        "bio": "bio",
        "curaduria": "curaduría",
        "aldan": "aldán",
        "contacto": "contacto"
        // ... resto de traducciones
    },
    "en": {
        "obra": "work",
        "bio": "bio",
        "curaduria": "curatorship",
        "aldan": "aldán",
        "contacto": "contact"
        // ... resto de traducciones
    }
};

function changeLanguage(lang) {
    currentLanguage = lang;
    let selectedTranslations = translations[lang];

    // Update navigation links
    document.querySelector(".overlay-header nav a:nth-child(1)").textContent = selectedTranslations.obra;
    document.querySelector(".overlay-header nav a:nth-child(2)").textContent = selectedTranslations.bio;
    document.querySelector(".overlay-header nav a:nth-child(3)").textContent = selectedTranslations.aldan;
    document.querySelector(".overlay-header nav a:nth-child(4)").textContent = selectedTranslations.curaduria;
    document.querySelector(".overlay-header nav a:nth-child(5)").textContent = selectedTranslations.contacto;

    // Update language switcher active state
    document.querySelectorAll('.language-switcher a').forEach(link => {
        if (link.getAttribute('data-lang') === lang) {
            link.classList.add('active-lang');
        } else {
            link.classList.remove('active-lang');
        }
    });

    // Update HTML lang attribute
    document.documentElement.setAttribute("lang", lang);
    
    // Store language preference
    setCookie('selectedLanguage', lang, 30);
    
    return false;
}

// Inicialización común
document.addEventListener('DOMContentLoaded', function() {
    // ... código de inicialización
}); 

// Initialize on page load
window.onload = function() {
    // Check for saved language preference
    let savedLanguage = getCookie('selectedLanguage');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    }
    
    // Apply initial language
    changeLanguage(currentLanguage);
    
    // Add fonts-loaded class
    document.documentElement.classList.add('fonts-loaded');
    
    // Initialize page-specific functionality
    initializePageSpecific();
};

// Page-specific initialization
function initializePageSpecific() {
    // Check current page and initialize specific features
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'obra.html':
            initializeObra();
            break;
        case 'index.html':
            initializeIndex();
            break;
        // ... otros casos específicos
    }
}

// Obra page specific initialization
function initializeObra() {
    if (!document.querySelector('.obra-grid')) return;
    
    const obraItems = document.querySelectorAll('.obra-item');
    const mobileDetailPages = document.querySelectorAll('.mobile-detail-page');
    
    obraItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            handleObraClick(this, index);
        });
    });
}

// Index page specific initialization
function initializeIndex() {
    if (!document.querySelector('.video-container')) return;
    
    // Initialize video-specific features
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
} 