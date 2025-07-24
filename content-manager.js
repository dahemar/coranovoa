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
        
        // Procesar formato [img]URL[/img] (Imgur y otros)
        const imgTagMatch = cleanUrl.match(/\[img\](.*?)\[\/img\]/i);
        if (imgTagMatch) {
            cleanUrl = imgTagMatch[1].trim();
        }
        
        // Procesar URLs de Imgur
        if (cleanUrl.includes('imgur.com')) {
            // Convertir URLs de Imgur a formato directo
            if (cleanUrl.includes('/a/')) {
                // Album de Imgur - usar la primera imagen
                cleanUrl = cleanUrl.replace('/a/', '/').replace('imgur.com', 'i.imgur.com') + '.jpg';
            } else if (cleanUrl.includes('imgur.com/')) {
                // Imagen individual de Imgur
                const imgurId = cleanUrl.split('/').pop().split('.')[0];
                cleanUrl = `https://i.imgur.com/${imgurId}.jpg`;
            }
        }
        
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
        element.setAttribute('data-order', obra.orden || (index + 1)); // Usar columna orden o índice como fallback
        
        // Imagen - usar thumbnail si existe, sino usar url_imagen
        const imageUrl = obra.thumbnail && obra.thumbnail.trim() ? obra.thumbnail : obra.url_imagen;
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
        if (obra.titulo) {
            const titleDiv = document.createElement('div');
            titleDiv.className = 'obra-title';
            titleDiv.textContent = obra.titulo;
            element.appendChild(titleDiv);
        }
        
        // Año
        if (obra.año) {
            const yearDiv = document.createElement('div');
            yearDiv.className = 'obra-year';
            yearDiv.textContent = obra.año;
            element.appendChild(yearDiv);
        }
        
        // Descripción - usar el idioma actual
        const description = obra[`descripcion_${this.currentLanguage}`] || obra.descripcion_esp || obra.descripcion_gal || obra.descripcion_en;
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
        
        if (contactInfo.ig) {
            html += `<a href="https://www.instagram.com/intel_cora/" target="_blank">${contactInfo.ig}</a>`;
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
        element.id = `curaduria-${curaduria.orden || (index + 1)}-li`;
        
        const title = curaduria[`título_${this.currentLanguage}`] || curaduria.título_esp || curaduria.título_en;
        const description = this.processTextWithLineBreaks(curaduria[`descripción_${this.currentLanguage}`] || curaduria.descripción_esp || curaduria.descripción_en);
        
        const info = curaduria[`info_${this.currentLanguage}`] || curaduria.info_esp || curaduria.info_en || '';
        element.innerHTML = `
            <span><span class="atb-title">${title}</span>${info ? ` | ${info}` : ''}</span>
            <div class="expanded-content">
                <div class="hover-image" style="background-image: url('${curaduria.imagen_url}');"></div>
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
                    .filter(obra => obra.titulo) // Filtrar obras válidas por título
                    .sort((a, b) => parseInt(a.orden) - parseInt(b.orden)); // Ordenar por columna orden
                
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
        const order = obra.orden || (this.obrasData.indexOf(obra) + 1); // Usar columna orden o posición como fallback
        console.log('Looking for obra with order:', order);
        
        // Navegar a la página de detalle
        const detailUrl = `obra-detail.html?order=${order}`;
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
        const order = obra.orden || (this.obrasData.indexOf(obra) + 1); // Usar columna orden o posición como fallback
        detailPage.id = `${order}-detail`;
        
        // Obtener descripción en el idioma actual
        const description = this.processTextWithLineBreaks(obra[`descripcion_${this.currentLanguage}`] || obra.descripcion_esp || obra.descripcion_gal || obra.descripcion_en || '');
        
        // Obtener título limpio (sin HTML)
        const cleanTitle = obra.titulo || '';
        
        // Obtener imagen - usar url_imagen para la página de detalle
        const cleanImageUrl = this.extractImageUrl(obra.url_imagen);
        
        detailPage.innerHTML = `
            <a href="#" class="mobile-back-button">←</a>
            <h2 class="mobile-detail-title">${cleanTitle}</h2>
            <div class="mobile-detail-year">${obra.año || ''}</div>
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
                    // El orden se mantiene por la posición natural de las filas (sin columna order)
                
                // Agrupar entradas por sección
                const sections = {};
                bioEntries.forEach(entry => {
                    if (!sections[entry.sección]) {
                        sections[entry.sección] = [];
                    }
                    sections[entry.sección].push(entry);
                });
                
                // Actualizar cada sección
                Object.keys(sections).forEach(sectionName => {
                    const textElement = document.getElementById(`${sectionName}-text`);
                    if (textElement) {
                        // Obtener el contenido en el idioma actual
                        const content = sections[sectionName]
                            .map(entry => entry[`contenido_${this.currentLanguage}`] || entry.contenido_esp || entry.contenido_en)
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
                    .find(contact => contact.idioma === this.currentLanguage);
                
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
                    .map((row, index) => {
                        const project = {};
                        headers.forEach((header, headerIndex) => {
                            project[header] = row[headerIndex] || '';
                        });
                        // Usar el índice de la fila como orden automático
                        project.orden = index + 1;
                        return project;
                    });
                
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
                    // El orden se mantiene por la posición natural de las filas (sin columna order)
                
                // Actualizar el contenido de Aldán combinando todas las líneas
                const container = document.getElementById('aldan-content');
                if (container && aldanContent.length > 0) {
                    // Título fijo que no se puede editar en Google Sheets
                    const fixedTitle = '<span class="atb-title">Algo de ver<span class="atb-a-accent"><span class="base">a</span><span class="accent">´</span></span>n</span>';
                    
                    let fullContent = fixedTitle + ' '; // Espacio fijo después del título
                    aldanContent.forEach(item => {
                        const content = item[`contenido_${this.currentLanguage}`] || item.contenido_esp || item.content_en;
                        if (content) {
                            // Procesar URLs de Instagram automáticamente
                            let processedContent = content;
                            if (content.includes('https://www.instagram.com/')) {
                                const instagramUrl = content.trim();
                                const username = instagramUrl.split('/').pop(); // Obtener el username
                                processedContent = `<br><br><a href="${instagramUrl}" target="_blank" class="instagram-link">@${username}</a>`;
                            }
                            fullContent += processedContent;
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
                    const description = this.processTextWithLineBreaks(obra[`descripcion_${this.currentLanguage}`] || obra.descripcion_esp || obra.descripcion_gal || obra.descripcion_en || '');
                    descriptionElement.innerHTML = description;
                }
            }
        });
    }

    // Buscar obra por order (ahora usa columna orden)
    findObraByOrder(order) {
        return this.obrasData.find(obra => obra.orden == parseInt(order)) || null;
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