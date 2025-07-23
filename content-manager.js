class ContentManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'esp';
        
        // Usar configuración de Google Sheets si está disponible
        if (window.GOOGLE_SHEETS_CONFIG) {
            this.baseUrl = window.GOOGLE_SHEETS_CONFIG.baseUrl;
            this.spreadsheetId = window.GOOGLE_SHEETS_CONFIG.spreadsheetId;
            this.apiKey = window.GOOGLE_SHEETS_CONFIG.apiKey;
            console.log('Google Sheets integration enabled');
        } else {
            this.baseUrl = null;
            this.spreadsheetId = null;
            this.apiKey = null;
            console.log('Google Sheets integration disabled - using static content only');
        }
    }

    // Extraer URL de imagen limpia
    extractImageUrl(url) {
        if (!url) return null;
        return url.trim();
    }

    // Crear elemento de obra
    createObraElement(obra, index = 0) {
        const element = document.createElement('div');
        element.className = 'obra-item';
        element.setAttribute('data-id', obra.id);
        
        // Imagen
        const cleanUrl = this.extractImageUrl(obra.image_url);
        const imageDiv = document.createElement('div');
        imageDiv.className = 'obra-image';
        if (cleanUrl) {
            imageDiv.style.backgroundImage = `url('${cleanUrl}')`;
        }
        element.appendChild(imageDiv);
        
        // Título
        if (obra.title) {
            const titleDiv = document.createElement('div');
            titleDiv.className = 'obra-title';
            titleDiv.textContent = obra.title;
            element.appendChild(titleDiv);
        }
        
        // Año
        if (obra.year) {
            const yearDiv = document.createElement('div');
            yearDiv.className = 'obra-year';
            yearDiv.textContent = obra.year;
            element.appendChild(yearDiv);
        }
        
        // Descripción
        const description = obra[`description_${this.currentLanguage}`] || obra.description_esp;
        if (description) {
            element.setAttribute('data-description', description);
        }
        
        return element;
    }

    // Crear elemento de bio
    createBioElement(bioSection) {
        const element = document.createElement('div');
        element.className = 'bio-section';
        element.setAttribute('data-section', bioSection.section);
        
        const content = bioSection.content || '';
        element.innerHTML = `<div class="bio-content">${content}</div>`;
        
        return element;
    }

    // Crear elemento de contacto
    createContactElement(contactInfo) {
        const element = document.createElement('div');
        element.className = 'contact-info';
        
        let html = '';
        
        if (contactInfo.email) {
            html += `<a href="mailto:${contactInfo.email}">${contactInfo.email}</a><br><br>`;
        }
        
        if (contactInfo.social_media) {
            html += `<a href="https://www.instagram.com/intel_cora/" target="_blank">${contactInfo.social_media}</a>`;
        }
        
        element.innerHTML = html;
        return element;
    }

    // Crear elemento de curaduría
    createCuraduriaElement(curaduria, index = 0) {
        const element = document.createElement('li');
        element.id = `${curaduria.id}-li`;
        
        const title = curaduria[`title_${this.currentLanguage}`] || curaduria.title_esp;
        const description = curaduria[`description_${this.currentLanguage}`] || curaduria.description_esp;
        
        element.innerHTML = `
            <span><span class="atb-title">${title}</span> | ${curaduria.year || ''}</span>
            <div class="expanded-content">
                <div class="hover-image" style="background-image: url('${curaduria.image_url}');"></div>
                <div class="hover-text">
                    <span class="atb-title project-title">${title}</span>
                    ${description}
                </div>
            </div>
        `;
        
        return element;
    }

    // Cargar obras
    async loadObras() {
        try {
            const response = await fetch(`${this.baseUrl}/${this.spreadsheetId}/values/Obras?key=${this.apiKey}`);
            const data = await response.json();
            
            if (data.values && data.values.length > 1) {
                const headers = data.values[0];
                const obras = data.values.slice(1).map(row => {
                    const obra = {};
                    headers.forEach((header, index) => {
                        obra[header] = row[index] || '';
                    });
                    return obra;
                });
                
                const grid = document.querySelector('.obra-grid');
                if (grid) {
                    // Limpiar solo el contenido de la grilla, no toda la estructura
                    grid.innerHTML = '';
                    
                    obras.forEach((obra, index) => {
                        const element = this.createObraElement(obra, index);
                        grid.appendChild(element);
                    });
                    
                    // Re-inicializar los eventos de clic después de cargar el contenido dinámico
                    this.initializeObraEvents();
                }
            }
        } catch (error) {
            console.error('Error loading obras:', error);
        }
    }

    // Inicializar eventos de clic para las obras
    initializeObraEvents() {
        const obraItems = document.querySelectorAll('.obra-item');
        obraItems.forEach((item) => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const obraId = this.getAttribute('data-id');
                if (obraId) {
                    openDetailPageById(obraId);
                    history.pushState({page: obraId}, '', `obra.html?id=${obraId}`);
                }
            });
        });
        
        // Re-inicializar los eventos de los botones de retroceso
        const backButtons = document.querySelectorAll('.mobile-back-button');
        backButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                closeAllDetailPages();
                history.pushState({page: 'main'}, '', 'obra.html');
            });
        });
        
        // Aplicar el formato Junicode a los títulos
        document.querySelectorAll('.obra-title').forEach(function(el) {
            // Solo modificar si NO contiene etiquetas HTML (es texto plano)
            if (!el.innerHTML.includes('<span')) {
                el.innerHTML = el.innerHTML
                    .replace(/[\/\-_´*˙˚°]/g, function(match) {
                        return '<span class="junicode-slash">' + match + '</span>';
                    });
            }
        });
    }

    // Cargar bio
    async loadBio() {
        try {
            const response = await fetch(`${this.baseUrl}/${this.spreadsheetId}/values/Bio?key=${this.apiKey}`);
            const data = await response.json();
            
            if (data.values && data.values.length > 1) {
                const headers = data.values[0];
                const bioEntries = data.values.slice(1)
                    .map(row => {
                        const entry = {};
                        headers.forEach((header, index) => {
                            entry[header] = row[index] || '';
                        });
                        return entry;
                    })
                    .sort((a, b) => parseInt(a.order) - parseInt(b.order));
                
                // Agrupar entradas por sección
                const sections = {};
                bioEntries.forEach(entry => {
                    if (!sections[entry.section]) {
                        sections[entry.section] = [];
                    }
                    sections[entry.section].push(entry);
                });
                
                // Actualizar cada sección
                Object.keys(sections).forEach(sectionName => {
                    const textElement = document.getElementById(`${sectionName}-text`);
                    if (textElement) {
                        // Obtener el contenido en el idioma actual
                        const content = sections[sectionName]
                            .map(entry => entry[`content_${this.currentLanguage}`] || entry.content_esp)
                            .filter(content => content && content.trim() !== '')
                            .join('\n');
                        
                        // Actualizar el contenido
                        if (content && content.trim() !== '') {
                            // Preservar saltos de línea
                            textElement.innerHTML = content.replace(/\n/g, '<br>');
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error loading bio from Google Sheets:', error);
            // Si hay error, mantener el contenido estático original
            console.log('Keeping static content as fallback');
        }
    }

    // Cargar contacto
    async loadContact() {
        try {
            const response = await fetch(`${this.baseUrl}/${this.spreadsheetId}/values/Contacto?key=${this.apiKey}`);
            const data = await response.json();
            
            if (data.values && data.values.length > 1) {
                const headers = data.values[0];
                const contactInfo = data.values.slice(1)
                    .map(row => {
                        const contact = {};
                        headers.forEach((header, index) => {
                            contact[header] = row[index] || '';
                        });
                        return contact;
                    })
                    .find(contact => contact.language === this.currentLanguage);
                
                const container = document.querySelector('.aldan-text');
                if (container && contactInfo) {
                    const element = this.createContactElement(contactInfo);
                    container.innerHTML = element.innerHTML;
                }
            }
        } catch (error) {
            console.error('Error loading contact:', error);
        }
    }

    // Cargar curaduría
    async loadCuraduria() {
        try {
            const response = await fetch(`${this.baseUrl}/${this.spreadsheetId}/values/Curaduria?key=${this.apiKey}`);
            const data = await response.json();
            
            if (data.values && data.values.length > 1) {
                const headers = data.values[0];
                const curaduriaProjects = data.values.slice(1)
                    .map(row => {
                        const project = {};
                        headers.forEach((header, index) => {
                            project[header] = row[index] || '';
                        });
                        return project;
                    })
                    .sort((a, b) => parseInt(a.order) - parseInt(b.order));
                
                const container = document.querySelector('.curaduria-list');
                if (container) {
                    container.innerHTML = '';
                    curaduriaProjects.forEach((project, index) => {
                        const element = this.createCuraduriaElement(project, index);
                        container.appendChild(element);
                    });
                }
            }
        } catch (error) {
            console.error('Error loading curaduria:', error);
        }
    }

    // Cargar Aldán
    async loadAldan() {
        try {
            const response = await fetch(`${this.baseUrl}/${this.spreadsheetId}/values/Aldan?key=${this.apiKey}`);
            const data = await response.json();
            
            if (data.values && data.values.length > 1) {
                const headers = data.values[0];
                const aldanContent = data.values.slice(1)
                    .map(row => {
                        const content = {};
                        headers.forEach((header, index) => {
                            content[header] = row[index] || '';
                        });
                        return content;
                    })
                    .sort((a, b) => parseInt(a.order) - parseInt(b.order));
                
                // Actualizar el contenido de Aldán combinando todas las líneas
                const container = document.querySelector('.aldan-text');
                if (container && aldanContent.length > 0) {
                    // Título fijo que no se puede editar en Google Sheets
                    const fixedTitle = '<span class="atb-title">Algo de ver<span class="atb-a-accent"><span class="base">a</span><span class="accent">´</span></span>n</span>';
                    
                    let fullContent = fixedTitle + ' '; // Espacio fijo después del título
                    aldanContent.forEach(item => {
                        const content = item[`content_${this.currentLanguage}`] || item.content_esp;
                        if (content) {
                            fullContent += content;
                        }
                    });
                    if (fullContent) {
                        container.innerHTML = fullContent;
                    }
                }
            }
        } catch (error) {
            console.error('Error loading aldan:', error);
        }
    }

    // Cambiar idioma
    changeLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        
        // Recargar contenido según la página actual
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        switch (currentPage) {
            case 'obra.html':
                // Para obras, solo actualizar títulos si es necesario
                this.updateObraTitles();
                break;
            case 'bio.html':
                this.loadBio();
                break;
            case 'aldan.html':
                this.loadAldan();
                break;
            case 'contacto.html':
                this.loadContact();
                break;
            case 'curaduria.html':
                this.loadCuraduria();
                break;
        }
    }

    // Los títulos de las obras ahora son fijos y no necesitan actualización
    async updateObraTitles() {
        // Los títulos ya no cambian con el idioma, son fijos
        console.log('Obra titles are now fixed and do not need updating');
    }

    // Inicializar según la página
    init() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        switch (currentPage) {
            case 'obra.html':
                // Para obras, mantener el contenido estático original
                // Solo inicializar eventos si no están ya inicializados
                if (!window.obraEventsInitialized) {
                    this.initializeObraEvents();
                    window.obraEventsInitialized = true;
                }
                break;
            case 'bio.html':
                // Para bio, solo cargar contenido dinámico si Google Sheets está configurado
                if (this.spreadsheetId && this.apiKey) {
                    this.loadBio();
                } else {
                    console.log('Google Sheets not configured for bio, using static content');
                }
                break;
            case 'aldan.html':
                // Para Aldán, solo cargar contenido dinámico si Google Sheets está configurado
                if (this.spreadsheetId && this.apiKey) {
                    this.loadAldan();
                } else {
                    console.log('Google Sheets not configured for aldan, using static content');
                }
                break;
            case 'contacto.html':
                this.loadContact();
                break;
            case 'curaduria.html':
                this.loadCuraduria();
                break;
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.contentManager = new ContentManager();
    window.contentManager.init();
}); 