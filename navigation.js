let currentLanguage = 'gal';

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

const translations = {
    "gal": {
        "obra": "obra",
        "bio": "bio",
        "curaduria": "curaduría",
        "aldan": "aldán",
        "contacto": "contacto"
    },
    "esp": {
        "obra": "obra",
        "bio": "bio",
        "curaduria": "curaduría",
        "aldan": "aldán",
        "contacto": "contacto"
    },
    "en": {
        "obra": "work",
        "bio": "bio",
        "curaduria": "curatorship",
        "aldan": "aldán",
        "contacto": "contact"
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
    
    // Store the selected language
    setCookie('selectedLanguage', lang, 30);
    
    return false;
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', function() {
    let savedLanguage = getCookie('selectedLanguage');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    }
    changeLanguage(currentLanguage);

    // Add transition effect for navigation
    document.querySelectorAll('.overlay-header nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            document.querySelector('.page-container').classList.add('fade-exit');
            setTimeout(() => {
                window.location.href = url;
            }, 500);
        });
    });
}); 