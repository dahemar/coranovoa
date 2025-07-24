# 🎨 INTEGRACIÓN GOOGLE SHEETS - CORA NOVOA WEBSITE

## 📋 ESTRUCTURA DE LA HOJA DE GOOGLE SHEETS

### **Configuración General:**
- **Spreadsheet ID:** `1GC8bqmQeQHD0H1QnIGAQbOPtBg19_4dkspwZEUjgi1k`
- **API Key:** `AIzaSyBHQgbSv588A3qr-Kzeo6YrZ9TbVNlrSkc`
- **URL Pública:** https://docs.google.com/spreadsheets/d/1GC8bqmQeQHD0H1QnIGAQbOPtBg19_4dkspwZEUjgi1k/edit?usp=sharing

### **Hojas de la Spreadsheet:**

#### **1. HOJA "Obras"**
**Propósito:** Contenido dinámico para `obra.html` - Galería de 39 obras de arte

**Columnas:**
- `id` - Identificador único (obra1, obra2, etc.)
- `title_gal` - Título en gallego
- `title_esp` - Título en español  
- `title_en` - Título en inglés
- `year` - Año de la obra
- `image_url` - Ruta de la imagen (ej: images/branco_sobre_branco.webp)
- `description_gal` - Descripción en gallego
- `description_esp` - Descripción en español
- `description_en` - Descripción en inglés
- `category` - Categoría (escultura, instalacion, etc.)
- `order` - Orden de visualización

**Ejemplo de fila:**
```
obra1 | b s b | b s b | b s b | 2024 | images/branco_sobre_branco.webp | Descrición da obra... | Descripción de la obra... | Work description... | escultura | 1
```

#### **2. HOJA "Bio"**
**Propósito:** Contenido dinámico para `bio.html` - Biografía en 3 idiomas

**Columnas:**
- `language` - Idioma (gal, esp, en)
- `section` - Sección (education, meetings, publications, workshops, exhibitions)
- `content` - Contenido de la sección
- `order` - Orden de visualización

**Ejemplo de fila:**
```
gal | education | Contrato predoctoral en Arte: Producción e Investigación, UPV (actualmente) 2025... | 1
```

#### **3. HOJA "Contacto"**
**Propósito:** Contenido dinámico para `contacto.html` - Información de contacto

**Columnas:**
- `language` - Idioma (gal, esp, en)
- `email` - Email de contacto
- `phone` - Teléfono (vacío por ahora)
- `address` - Dirección (vacío por ahora)
- `social_media` - Redes sociales (@intel_cora)
- `order` - Orden de visualización

**Ejemplo de fila:**
```
gal | acoranovoa@gmail.com |  |  | @intel_cora | 1
```

#### **4. HOJA "Curaduria"**
**Propósito:** Contenido dinámico para `curaduria.html` - Proyectos de curaduría

**Columnas:**
- `id` - Identificador único (curaduria1, curaduria2, etc.)
- `title_gal` - Título en gallego
- `title_esp` - Título en español
- `title_en` - Título en inglés
- `description_gal` - Descripción en gallego
- `description_esp` - Descripción en español
- `description_en` - Descripción en inglés
- `image_url` - Ruta de la imagen (ej: images/2.webp)
- `year` - Año del proyecto
- `order` - Orden de visualización

**Ejemplo de fila:**
```
curaduria1 | Cando falo de corpo | Cando falo de corpo | When I Talk About Body | Cando falo de corpo propón... | Cando falo de corpo propone... | When I Talk About Body proposes... | images/2.webp | 2026 | 1
```

---

## 🚀 PASOS PARA IMPLEMENTAR LA INTEGRACIÓN

### **PASO 1: Crear el archivo content-manager.js**

Crear el archivo `content-manager.js` en la raíz de la web de Cora Novoa (`/Users/david/Desktop/cora 2/`):

```javascript
class ContentManager {
    constructor() {
        this.spreadsheetId = '1GC8bqmQeQHD0H1QnIGAQbOPtBg19_4dkspwZEUjgi1k';
        this.apiKey = 'AIzaSyBHQgbSv588A3qr-Kzeo6YrZ9TbVNlrSkc';
        this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
        this.currentLanguage = localStorage.getItem('language') || 'esp';
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
        
        let html = '';
        
        // Imagen
        const cleanUrl = this.extractImageUrl(obra.image_url);
        if (cleanUrl) {
            const img = document.createElement('img');
            img.src = cleanUrl;
            img.alt = obra[`title_${this.currentLanguage}`] || obra.title_esp;
            img.loading = index < 3 ? 'eager' : 'lazy';
            html += img.outerHTML;
        }
        
        // Título
        const title = obra[`title_${this.currentLanguage}`] || obra.title_esp;
        if (title) {
            html += `<h3>${title}</h3>`;
        }
        
        // Año
        if (obra.year) {
            html += `<p class="year">${obra.year}</p>`;
        }
        
        // Descripción
        const description = obra[`description_${this.currentLanguage}`] || obra.description_esp;
        if (description) {
            element.setAttribute('data-description', description);
        }
        
        element.innerHTML = html;
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
                
                const container = document.querySelector('.obra-container');
                if (container) {
                    container.innerHTML = '';
                    obras.forEach((obra, index) => {
                        const element = this.createObraElement(obra, index);
                        container.appendChild(element);
                    });
                }
            }
        } catch (error) {
            console.error('Error loading obras:', error);
        }
    }

    // Cargar bio
    async loadBio() {
        try {
            const response = await fetch(`${this.baseUrl}/${this.spreadsheetId}/values/Bio?key=${this.apiKey}`);
            const data = await response.json();
            
            if (data.values && data.values.length > 1) {
                const headers = data.values[0];
                const bioSections = data.values.slice(1)
                    .map(row => {
                        const section = {};
                        headers.forEach((header, index) => {
                            section[header] = row[index] || '';
                        });
                        return section;
                    })
                    .filter(section => section.language === this.currentLanguage)
                    .sort((a, b) => parseInt(a.order) - parseInt(b.order));
                
                const container = document.querySelector('.bio-container');
                if (container) {
                    container.innerHTML = '';
                    bioSections.forEach(section => {
                        const element = this.createBioElement(section);
                        container.appendChild(element);
                    });
                }
            }
        } catch (error) {
            console.error('Error loading bio:', error);
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

    // Cambiar idioma
    changeLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        
        // Recargar contenido según la página actual
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        switch (currentPage) {
            case 'obra.html':
                this.loadObras();
                break;
            case 'bio.html':
                this.loadBio();
                break;
            case 'contacto.html':
                this.loadContact();
                break;
            case 'curaduria.html':
                this.loadCuraduria();
                break;
        }
    }

    // Inicializar según la página
    init() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        switch (currentPage) {
            case 'obra.html':
                this.loadObras();
                break;
            case 'bio.html':
                this.loadBio();
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
```

### **PASO 2: Modificar los archivos HTML**

#### **Modificar obra.html:**
Añadir antes del cierre de `</body>`:
```html
<script src="content-manager.js"></script>
```

Y cambiar la función `changeLanguage` existente para incluir:
```javascript
// Dentro de la función changeLanguage existente, añadir:
if (window.contentManager) {
    window.contentManager.changeLanguage(lang);
}
```

#### **Modificar bio.html:**
Añadir antes del cierre de `</body>`:
```html
<script src="content-manager.js"></script>
```

Y cambiar la función `changeLanguage` existente para incluir:
```javascript
// Dentro de la función changeLanguage existente, añadir:
if (window.contentManager) {
    window.contentManager.changeLanguage(lang);
}
```

#### **Modificar contacto.html:**
Añadir antes del cierre de `</body>`:
```html
<script src="content-manager.js"></script>
```

Y cambiar la función `changeLanguage` existente para incluir:
```javascript
// Dentro de la función changeLanguage existente, añadir:
if (window.contentManager) {
    window.contentManager.changeLanguage(lang);
}
```

#### **Modificar curaduria.html:**
Añadir antes del cierre de `</body>`:
```html
<script src="content-manager.js"></script>
```

Y cambiar la función `changeLanguage` existente para incluir:
```javascript
// Dentro de la función changeLanguage existente, añadir:
if (window.contentManager) {
    window.contentManager.changeLanguage(lang);
}
```

### **PASO 3: Verificar la configuración de Google Cloud**

1. **Ir a Google Cloud Console:** https://console.cloud.google.com/
2. **Seleccionar el proyecto** creado para Cora Novoa
3. **Verificar que Google Sheets API esté habilitada**
4. **Verificar que la API Key tenga permisos** para Google Sheets API

### **PASO 4: Probar la integración**

1. **Abrir la web localmente** en el navegador
2. **Abrir las herramientas de desarrollador** (F12)
3. **Ir a la pestaña Console**
4. **Verificar que no hay errores** de carga
5. **Probar el cambio de idioma** en cada página
6. **Verificar que el contenido se carga** desde Google Sheets

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### **Error 403 - Forbidden:**
- Verificar que la API Key es correcta
- Verificar que Google Sheets API está habilitada
- Verificar que la Spreadsheet ID es correcta

### **Error 404 - Not Found:**
- Verificar que los nombres de las hojas son exactos
- Verificar que la Spreadsheet ID es correcta

### **Contenido no se carga:**
- Verificar que las hojas tienen datos
- Verificar que los nombres de las columnas coinciden
- Verificar la conexión a internet

### **Cambio de idioma no funciona:**
- Verificar que la función `changeLanguage` está modificada en cada HTML
- Verificar que `content-manager.js` está incluido en cada página

---

## 📱 FUNCIONALIDADES IMPLEMENTADAS

### **✅ Contenido dinámico:**
- Obras de arte con imágenes, títulos, años y descripciones
- Biografía organizada por secciones
- Información de contacto
- Proyectos de curaduría con imágenes y descripciones

### **✅ Multiidioma:**
- Gallego (gal)
- Español (esp)
- Inglés (en)
- Cambio de idioma en tiempo real
- Persistencia del idioma seleccionado

### **✅ Responsive:**
- Compatible con móviles
- Mantiene la funcionalidad existente
- Preserva el diseño original

### **✅ Performance:**
- Carga lazy de imágenes
- Caché del idioma seleccionado
- Manejo de errores

---

## 🎯 RESULTADO FINAL

Una vez implementado, la web de Cora Novoa tendrá:

1. **Contenido completamente dinámico** desde Google Sheets
2. **Gestión fácil** de contenido sin tocar código
3. **Multiidioma funcional** con cambio en tiempo real
4. **Mantenimiento simplificado** a través de hojas de cálculo
5. **Funcionalidad preservada** del diseño original

**¡La web estará lista para gestión de contenido desde Google Sheets!** 🚀 