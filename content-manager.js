class ContentManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'esp';
        
        // Configuración específica de Cora Novoa Google Sheets
        this.spreadsheetId = '1GC8bqmQeQHD0H1QnIGAQbOPtBg19_4dkspwZEUjgi1k';
        this.apiKey = 'AIzaSyBHQgbSv588A3qr-Kzeo6YrZ9TbVNlrSkc';
        this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
        
        // Almacenar datos de obras para acceso rápido
        this.obrasData = [];
        
        console.log('Google Sheets integration enabled for Cora Novoa');
    }

    // Extraer URL de imagen limpia
    extractImageUrl(url) {
        if (!url) return null;
        
        let cleanUrl = url.trim();
        
        // Corregir nombres de archivo problemáticos
        if (cleanUrl === 'images/com') {
            cleanUrl = 'images/com_posturas.webp';
        } else if (cleanUrl === 'images/con') {
            cleanUrl = 'images/con_tacto.webp';
        } else if (cleanUrl === 'images/pegada_p.webp') {
            cleanUrl = 'images/pegada p.webp';
        } else if (cleanUrl === 'images/branco_sobre_branco.webp') {
            cleanUrl = 'images/blanco_sobre_blanco.webp';
        } else if (cleanUrl === 'images/obra37_placeholder.webp' || cleanUrl === 'placeholder.webp' || cleanUrl === 'images/placeholder.webp') {
            cleanUrl = 'images/lorem_ipsum.webp'; // Usar una imagen placeholder
        }
        
        return cleanUrl;
    }

    // Crear elemento de obra
    createObraElement(obra, index = 0) {
        const element = document.createElement('div');
        element.className = 'obra-item';
        element.setAttribute('data-order', obra.order);
        
        // Imagen - usar thumbnail si existe, sino usar image_url
        const imageUrl = obra.thumbnail && obra.thumbnail.trim() ? obra.thumbnail : obra.image_url;
        const cleanUrl = this.extractImageUrl(imageUrl);
        const imageDiv = document.createElement('div');
        imageDiv.className = 'obra-image';
        if (cleanUrl) {
            imageDiv.style.backgroundImage = `url('${cleanUrl}')`;
            // Añadir manejo de errores para imágenes
            imageDiv.onerror = () => {
                console.warn(`Failed to load image: ${cleanUrl}`);
                imageDiv.style.backgroundImage = 'none';
                imageDiv.style.backgroundColor = '#f0f0f0';
                imageDiv.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">Image not available</div>';
            };
        }
        element.appendChild(imageDiv);
        
        // Título - usar el título único (no cambia con idioma)
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
        
        // Descripción - usar el idioma actual
        const description = obra[`description_${this.currentLanguage}`] || obra.description_esp || obra.description_gal || obra.description_en;
        if (description) {
            element.setAttribute('data-description', this.processTextWithLineBreaks(description));
        }
        
        // Añadir evento de clic para abrir la página de detalle
        element.addEventListener('click', (e) => {
            e.preventDefault();
            this.openObraDetail(obra);
        });
        
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

    // Procesar texto con saltos de línea
    processTextWithLineBreaks(text) {
        if (!text) return '';
        // Convert \n to <br> tags and preserve existing HTML
        return text.replace(/\n/g, '<br>');
    }

    // Crear elemento de curaduría
    createCuraduriaElement(curaduria, index = 0) {
        const element = document.createElement('li');
        element.id = `${curaduria.id}-li`;
        
        const title = curaduria[`title_${this.currentLanguage}`] || curaduria.title_esp;
        const description = this.processTextWithLineBreaks(curaduria[`description_${this.currentLanguage}`] || curaduria.description_esp);
        
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
            console.log('Loading obras from Google Sheets...');
            console.log('URL:', `${this.baseUrl}/${this.spreadsheetId}/values/Obras?key=${this.apiKey}`);
            
            const response = await fetch(`${this.baseUrl}/${this.spreadsheetId}/values/Obras?key=${this.apiKey}`);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Response data:', data);
            
            if (data.values && data.values.length > 1) {
                const headers = data.values[0];
                console.log('Headers found:', headers);
                
                const obras = data.values.slice(1)
                    .map(row => {
                        const obra = {};
                        headers.forEach((header, index) => {
                            obra[header] = row[index] || '';
                        });
                        return obra;
                    })
                    .filter(obra => obra.order && obra.title); // Filtrar obras válidas por order y title
                
                // Ordenar por el campo order
                obras.sort((a, b) => parseInt(a.order) - parseInt(b.order));
                
                // Almacenar datos para acceso rápido
                this.obrasData = obras;
                
                console.log('Obras loaded:', obras.length);
                console.log('First obra:', obras[0]);
                
                const grid = document.querySelector('.obra-grid');
                if (grid) {
                    // Limpiar solo el contenido de la grilla, no toda la estructura
                    grid.innerHTML = '';
                    
                    obras.forEach((obra, index) => {
                        const element = this.createObraElement(obra, index);
                        grid.appendChild(element);
                    });
                    
                    console.log('Obras loaded successfully');
                    return obras; // Retornar las obras cargadas
                } else {
                    console.error('Obra grid not found');
                    throw new Error('Obra grid not found');
                }
            } else {
                console.error('No data found in Google Sheets');
                console.error('Data structure:', data);
                throw new Error('No data found in Google Sheets');
            }
        } catch (error) {
            console.error('Error loading obras:', error);
            console.error('Error details:', error.message);
            throw error; // Re-lanzar el error para que se pueda manejar
        }
    }

    // Abrir página de detalle de obra
    openObraDetail(obra) {
        console.log('Opening obra detail for:', obra);
        
        // Guardar datos de la obra en localStorage para que la página de detalle los pueda acceder
        const obrasData = this.obrasData || [];
        localStorage.setItem('obrasData', JSON.stringify(obrasData));
        
        console.log('Saved obrasData to localStorage:', obrasData.length, 'obras');
        console.log('Looking for obra with order:', obra.order);
        
        // Navegar a la página de detalle
        const detailUrl = `obra-detail.html?order=${obra.order}`;
        console.log('Navigating to:', detailUrl);
        window.location.href = detailUrl;
    }

    // Generar páginas de detalle dinámicamente (ya no se usa)
    generateDetailPages(obras) {
        // Esta función ya no se usa, las páginas de detalle ahora usan obra-detail.html
        console.log('Detail pages are now handled by obra-detail.html template');
    }

    // Crear página de detalle para una obra
    createDetailPage(obra) {
        const detailPage = document.createElement('div');
        detailPage.className = 'mobile-detail-page';
        detailPage.id = `${obra.order}-detail`;
        
        // Obtener descripción en el idioma actual
        const description = this.processTextWithLineBreaks(obra[`description_${this.currentLanguage}`] || obra.description_esp || obra.description_gal || obra.description_en || '');
        
        // Obtener título limpio (sin HTML)
        const cleanTitle = obra.title || '';
        
        // Obtener imagen - usar image_url para la página de detalle
        const cleanImageUrl = this.extractImageUrl(obra.image_url);
        
        detailPage.innerHTML = `
            <a href="#" class="mobile-back-button">←</a>
            <h2 class="mobile-detail-title">${cleanTitle}</h2>
            <div class="mobile-detail-year">${obra.year || ''}</div>
            <img src="${cleanImageUrl}" alt="${cleanTitle}" class="mobile-detail-image" loading="lazy">
            <div class="mobile-detail-text">${description}</div>
        `;
        
        return detailPage;
    }

    // Inicializar eventos de clic para las obras
    initializeObraEvents() {
        const obraItems = document.querySelectorAll('.obra-item');
        obraItems.forEach((item) => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const obraOrder = this.getAttribute('data-order');
                if (obraOrder) {
                    openDetailPageById(obraOrder);
                    history.pushState({page: obraOrder}, '', `obra.html?order=${obraOrder}`);
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
                // Si ya tenemos los datos cargados, solo actualizar descripciones
                if (this.obrasData.length > 0) {
                    this.updateDetailPageDescriptions();
                    console.log('Updated detail page descriptions for language:', lang);
                } else {
                    // Si no tenemos datos, recargar todo
                    this.loadObras();
                }
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

    // Actualizar descripciones de páginas de detalle
    updateDetailPageDescriptions() {
        const detailPages = document.querySelectorAll('.mobile-detail-page');
        detailPages.forEach(detailPage => {
            const obraOrder = detailPage.id.replace('-detail', '');
            const descriptionElement = detailPage.querySelector('.mobile-detail-text');
            
            if (descriptionElement) {
                // Buscar la obra correspondiente en los datos cargados
                const obra = this.findObraByOrder(obraOrder);
                if (obra) {
                    const description = this.processTextWithLineBreaks(obra[`description_${this.currentLanguage}`] || obra.description_esp || obra.description_gal || obra.description_en || '');
                    descriptionElement.innerHTML = description;
                }
            }
        });
    }

    // Buscar obra por order
    findObraByOrder(order) {
        return this.obrasData.find(obra => obra.order == order) || null;
    }

    // Inicializar según la página
    init() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        switch (currentPage) {
            case 'obra.html':
                // Cargar obras desde Google Sheets
                this.loadObras();
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