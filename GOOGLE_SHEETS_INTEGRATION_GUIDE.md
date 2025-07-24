# GUÍA DE INTEGRACIÓN GOOGLE SHEETS COMO CMS

## RESUMEN DEL SISTEMA
Este sistema permite usar Google Sheets como un CMS (Content Management System) para webs estáticas, permitiendo modificar contenido sin tocar código. Es completamente flexible y se adapta a cualquier estructura de web.

## DOS ENFOQUES DE IMPLEMENTACIÓN

### ENFOQUE 1: IMPLEMENTACIÓN CON REACT/VITE
**Recomendado para proyectos nuevos o conversiones de HTML estático**

### ENFOQUE 2: IMPLEMENTACIÓN CON HTML+JS+CSS PURO
**Recomendado para webs estáticas existentes o proyectos simples**

---

# ENFOQUE 1: IMPLEMENTACIÓN CON REACT/VITE

## ARQUITECTURA TÉCNICA

### 1. COMPONENTES PRINCIPALES
- **Google Sheets API**: Para obtener datos de las hojas de cálculo
- **React/Vite**: Framework para renderizar el contenido dinámicamente
- **React Router**: Para navegación entre páginas
- **useEffect**: Para hacer fetch de datos al cargar componentes

### 2. CONCEPTO GENERAL
Cada página o sección de la web corresponde a una hoja en Google Sheets:
- **Página principal**: Hoja "Main" o "Home"
- **Lista de elementos**: Hoja "Items" o "Content"
- **Detalles individuales**: Usa la misma hoja pero filtra por ID
- **Secciones específicas**: Hojas separadas según necesidades

## CONFIGURACIÓN DE GOOGLE SHEETS

### 1. PRINCIPIO GENERAL
Para cada página/sección de la web, crear una hoja con columnas que correspondan a los datos necesarios:

#### ESTRUCTURA BÁSICA DE UNA HOJA
```
A1: campo1
B1: campo2
C1: campo3
D1: campo4
... (tantas columnas como campos necesites)
```
- A2:D2 en adelante: datos de cada elemento
- Los nombres de las columnas dependen del contenido específico

#### EJEMPLOS DE ESTRUCTURAS POSIBLES

**Para una galería de imágenes:**
```
A1: title
B1: description
C1: imageUrl
D1: category
```

**Para un blog:**
```
A1: date
B1: title
C1: content
D1: imageUrl
E1: author
```

**Para un portafolio:**
```
A1: title
B1: description
C1: imageUrls
D1: linkUrl
E1: category
F1: date
```

**Para una tienda:**
```
A1: name
B1: price
C1: description
D1: imageUrl
E1: category
F1: inStock
```

**Para recetas:**
```
A1: title
B1: ingredients
C1: instructions
D1: imageUrl
E1: cookingTime
F1: difficulty
```

### 2. CONFIGURAR PERMISOS
- Hacer las hojas públicas (cualquiera con el link puede ver)
- O usar autenticación con API key (más seguro)

## IMPLEMENTACIÓN TÉCNICA

### 1. VARIABLES DE CONFIGURACIÓN
```javascript
const SPREADSHEET_ID = 'TU_SPREADSHEET_ID';
const API_KEY = 'TU_API_KEY';
const RANGE = 'NombreHoja!A2:F'; // Ajustar según columnas
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets/';
```

### 2. FUNCIÓN PARA OBTENER DATOS
```javascript
useEffect(() => {
  async function fetchData() {
    try {
      const url = `${BASE_URL}${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error fetching data');
      const data = await response.json();
      setData(data.values || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);
```

### 3. FUNCIÓN PARA EXTRAER URLs DE IMAGEN
```javascript
function extractImageUrl(rawUrl) {
  if (!rawUrl) return '';
  const match = rawUrl.match(/\[img\](.+?)\[\/img\]/i);
  if (match) {
    return match[1].trim();
  }
  return rawUrl.trim();
}
```

### 4. RENDERIZADO GENÉRICO DE CONTENIDO
```javascript
{data.map((row, idx) => {
  // Destructuring según las columnas de tu hoja
  const [field1 = '', field2 = '', field3 = '', field4 = ''] = row;
  
  return (
    <div key={idx}>
      {/* Renderizar según tus necesidades */}
      <h3>{field1}</h3>
      <p>{field2}</p>
      <img src={extractImageUrl(field3)} alt={field1} />
    </div>
  );
})}
```

## PASOS PARA IMPLEMENTAR EN NUEVA WEB

### FASE 1: ANÁLISIS Y PLANIFICACIÓN
1. **Identificar páginas/secciones** de la web
2. **Definir estructura de datos** para cada página
3. **Crear Google Sheets** con hojas correspondientes
4. **Obtener API Key** de Google Cloud Console
5. **Obtener Spreadsheet ID** de la URL de Google Sheets

### FASE 2: CONVERSIÓN DE HTML ESTÁTICO
1. **Convertir HTML a React**:
   - Crear componentes para cada página
   - Reemplazar contenido estático con variables
   - Implementar React Router para navegación

2. **Implementar fetch de datos**:
   - Usar useEffect para cargar datos al montar componentes
   - Manejar estados de loading y error
   - Mapear datos de Sheets a componentes

### FASE 3: FUNCIONALIDADES ESPECIALES
1. **Modal de imágenes** (si es necesario):
   - Estado para imagen seleccionada
   - Overlay con imagen ampliada
   - Cierre al hacer clic dentro o fuera

2. **Links en descripciones** (si es necesario):
   - Función linkify para convertir URLs en links
   - dangerouslySetInnerHTML para renderizar HTML
   - CSS para estilos de links

3. **Responsive design**:
   - Media queries para móvil/desktop
   - Diferentes layouts según tamaño de pantalla

## ESTRUCTURA DE ARCHIVOS RECOMENDADA

```
src/
├── pages/
│   ├── Home.jsx           # Página principal
│   ├── Items.jsx          # Lista de elementos
│   ├── ItemDetail.jsx     # Detalle de elemento individual
│   ├── Section1.jsx       # Sección específica 1
│   ├── Section2.jsx       # Sección específica 2
│   └── Contact.jsx        # Página de contacto
├── components/
│   ├── ImageModal.jsx     # Modal para imágenes
│   └── LoadingSpinner.jsx # Componente de carga
├── utils/
│   └── sheetsApi.js       # Funciones para Google Sheets
└── App.jsx                # Router principal
```

## CONFIGURACIÓN DE VITE

### vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // Para dominio personalizado
  plugins: [react()],
})
```

## VARIABLES DE ENTORNO
Crear archivo `.env`:
```
VITE_GOOGLE_SHEETS_API_KEY=tu_api_key
VITE_SPREADSHEET_ID=tu_spreadsheet_id
```

## DEPLOY
1. **Build**: `npm run build`
2. **Copiar dist/** a servidor web
3. **Configurar dominio personalizado** si es necesario
4. **Archivo CNAME** para dominio personalizado

## PATRÓN DE IMPLEMENTACIÓN

### 1. PARA CADA PÁGINA/COMPONENTE:
```javascript
// 1. Definir estado
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// 2. Fetch de datos
useEffect(() => {
  fetchData();
}, []);

// 3. Renderizar
if (loading) return <div>Cargando...</div>;
if (error) return <div>Error: {error}</div>;

return (
  <div>
    {data.map((row, idx) => {
      // Destructuring según tus columnas
      const [field1, field2, field3] = row;
      return (
        <div key={idx}>
          {/* Tu contenido específico */}
        </div>
      );
    })}
  </div>
);
```

---

# ENFOQUE 2: IMPLEMENTACIÓN CON HTML+JS+CSS PURO

## ARQUITECTURA TÉCNICA

### 1. COMPONENTES PRINCIPALES
- **Google Sheets API**: Para obtener datos de las hojas de cálculo
- **JavaScript Vanilla**: Para manipulación del DOM
- **HTML estático**: Estructura base de las páginas
- **CSS**: Estilos y responsive design

### 2. CONCEPTO GENERAL
Cada página HTML tiene su propio script que carga contenido específico de Google Sheets:
- **Página principal**: index.html + content-manager.js
- **Páginas específicas**: page1.html, page2.html, etc.
- **Contenido dinámico**: Se inserta en contenedores HTML predefinidos

## CONFIGURACIÓN DE GOOGLE SHEETS
*Igual que en el enfoque React*

## IMPLEMENTACIÓN TÉCNICA

### 1. CLASE CONTENT MANAGER
```javascript
class ContentManager {
    constructor() {
        this.spreadsheetId = 'TU_SPREADSHEET_ID';
        this.apiKey = 'TU_API_KEY';
        this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets/';
    }

    // Inicializar al cargar la página
    async init() {
        try {
            await this.loadContent();
        } catch (error) {
            console.error('Error loading content:', error);
            this.showFallbackContent();
        }
    }

    // Cargar contenido según la página actual
    async loadContent() {
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'page1':
                await this.loadPage1Content();
                break;
            case 'page2':
                await this.loadPage2Content();
                break;
            // ... más casos según páginas
        }
    }

    // Obtener página actual desde URL
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('page1.html')) return 'page1';
        if (path.includes('page2.html')) return 'page2';
        // ... más condiciones
        return 'home'; // Default
    }
}
```

### 2. FUNCIÓN PARA OBTENER DATOS
```javascript
async fetchSheetData(range) {
    const url = `${this.baseUrl}${this.spreadsheetId}/values/${range}?key=${this.apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.values || [];
}
```

### 3. FUNCIÓN PARA EXTRAER URLs DE IMAGEN
```javascript
extractImageUrl(rawUrl) {
    if (!rawUrl) return '';
    const match = rawUrl.match(/\[img\](.+?)\[\/img\]/i);
    if (match) {
        return match[1].trim();
    }
    return rawUrl.trim();
}
```

### 4. CREACIÓN DINÁMICA DE ELEMENTOS HTML
```javascript
createContentElement(field1, field2, field3, field4, index = 0) {
    const element = document.createElement('div');
    element.className = 'content-item';
    let html = '';
    
    const cleanUrl = this.extractImageUrl(field3);
    if (cleanUrl) {
        const img = document.createElement('img');
        img.src = cleanUrl;
        img.alt = field1 || 'Content item';
        img.loading = index < 3 ? 'eager' : 'lazy';
        html += img.outerHTML;
    }
    
    if (field1) {
        html += `<h3>${field1}</h3>`;
    }
    if (field2) {
        html += `<p>${field2}</p>`;
    }
    if (field4) {
        element.setAttribute('data-description', field4);
    }
    
    element.innerHTML = html;
    return element;
}
```

## ESTRUCTURA DE ARCHIVOS

```
/
├── index.html              # Página principal
├── page1.html              # Página específica 1
├── page2.html              # Página específica 2
├── contact.html            # Página de contacto
├── content-manager.js      # Clase principal para gestionar contenido
├── styles.css              # Estilos principales
├── sidebar.css             # Estilos del menú (si aplica)
├── images/                 # Imágenes estáticas
└── assets/                 # Otros assets
```

## IMPLEMENTACIÓN EN HTML

### 1. ESTRUCTURA HTML BASE
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Web</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <nav class="sidebar">
            <ul>
                <li><a href="index.html">Inicio</a></li>
                <li><a href="page1.html">Página 1</a></li>
                <li><a href="page2.html">Página 2</a></li>
                <li><a href="contact.html">Contacto</a></li>
            </ul>
        </nav>

        <main class="content">
            <!-- Contenedor donde se insertará el contenido dinámico -->
            <div id="content-container" class="content-container">
                <!-- El contenido se cargará aquí dinámicamente -->
            </div>
        </main>
    </div>
    
    <script src="content-manager.js"></script>
    <script>
        // Inicializar el content manager
        document.addEventListener('DOMContentLoaded', function() {
            const contentManager = new ContentManager();
            contentManager.init();
        });
    </script>
</body>
</html>
```

### 2. CARGA DE CONTENIDO ESPECÍFICO
```javascript
async loadPage1Content() {
    const data = await this.fetchSheetData('Page1!A2:D');
    const container = document.getElementById('content-container');
    
    if (!container) return;
    
    container.innerHTML = ''; // Limpiar contenido existente
    
    data.forEach((row, index) => {
        const [field1, field2, field3, field4] = row;
        const element = this.createContentElement(field1, field2, field3, field4, index);
        container.appendChild(element);
    });
    
    // Habilitar funcionalidades adicionales
    this.enableImageFullscreen();
}
```

## FUNCIONALIDADES ESPECIALES

### 1. MODAL DE IMÁGENES
```javascript
function enableImageFullscreen() {
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG') {
            showFullscreenImage(e.target.src, e.target.alt);
        }
    });
}

function showFullscreenImage(src, alt) {
    const overlay = document.createElement('div');
    overlay.className = 'image-modal-overlay';
    overlay.innerHTML = `
        <img src="${src}" alt="${alt}" class="image-modal-full">
    `;
    
    overlay.addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    document.body.appendChild(overlay);
}
```

### 2. LINKS EN DESCRIPCIONES
```javascript
function linkify(text) {
    if (!text) return '';
    return text.replace(/(https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+)/g, 
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}
```

## VENTAJAS DEL ENFOQUE HTML+JS

### ✅ **Ventajas:**
- **Más simple**: No requiere build process
- **Más rápido**: Carga directa sin compilación
- **Fácil deploy**: Solo subir archivos estáticos
- **Menos dependencias**: Solo JavaScript vanilla
- **Mejor SEO**: HTML estático en el servidor

### ❌ **Desventajas:**
- **Menos organizado**: Todo en un archivo grande
- **Menos escalable**: Difícil de mantener en proyectos grandes
- **Sin hot reload**: Recargar página para ver cambios
- **Menos reutilizable**: Código duplicado entre páginas

## CUÁNDO USAR CADA ENFOQUE

### 🎯 **Usar React/Vite cuando:**
- Proyecto nuevo o conversión completa
- Web compleja con muchas interacciones
- Equipo de desarrollo
- Necesitas componentes reutilizables
- Quieres mejor organización del código

### 🎯 **Usar HTML+JS cuando:**
- Web simple y estática
- Quieres implementación rápida
- No necesitas build process
- Hosting básico (solo archivos estáticos)
- Mantenimiento mínimo

## CONSIDERACIONES DE SEGURIDAD
- **API Key pública**: Solo permite lectura, no modificación
- **Rate limiting**: Google Sheets API tiene límites
- **Caché**: Considerar implementar caché para mejorar performance

## TROUBLESHOOTING COMÚN
1. **Error 403**: Verificar permisos de la hoja
2. **Error 404**: Verificar Spreadsheet ID
3. **Datos no cargan**: Verificar API Key
4. **Imágenes no aparecen**: Verificar rutas y permisos de archivos

## EJEMPLO DE USO COMPLETO

### 1. Definir estructura según tu web
Si tienes una web de productos:
```
Hoja "Products":
A1: name
B1: description
C1: price
D1: imageUrl
E1: category
F1: inStock
```

### 2. Implementar en React
```javascript
function Products() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetchProductsData().then(setProducts);
  }, []);
  
  return (
    <div>
      {products.map(product => {
        const [name, description, price, imageUrl, category, inStock] = product;
        return (
          <div key={name}>
            <img src={extractImageUrl(imageUrl)} alt={name} />
            <h3>{name}</h3>
            <p>{description}</p>
            <p>Precio: {price}</p>
            <p>Categoría: {category}</p>
            <p>Stock: {inStock}</p>
          </div>
        );
      })}
    </div>
  );
}
```

### 3. Implementar en HTML+JS
```html
<!-- products.html -->
<div id="products-container"></div>

<script>
class ProductManager extends ContentManager {
    async loadProductsContent() {
        const data = await this.fetchSheetData('Products!A2:F');
        const container = document.getElementById('products-container');
        
        data.forEach(row => {
            const [name, description, price, imageUrl, category, inStock] = row;
            const product = this.createProductElement(name, description, price, imageUrl, category, inStock);
            container.appendChild(product);
        });
    }
    
    createProductElement(name, description, price, imageUrl, category, inStock) {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <img src="${this.extractImageUrl(imageUrl)}" alt="${name}">
            <h3>${name}</h3>
            <p>${description}</p>
            <p>Precio: ${price}</p>
            <p>Categoría: ${category}</p>
            <p>Stock: ${inStock}</p>
        `;
        return div;
    }
}

const productManager = new ProductManager();
productManager.init();
</script>
```

## PASOS DE IMPLEMENTACIÓN GENERALES

### 1. ANÁLISIS DE LA WEB
- **Identificar todas las páginas** que necesitan contenido dinámico
- **Definir qué datos** necesita cada página
- **Crear estructura de datos** para cada tipo de contenido

### 2. CONFIGURACIÓN DE GOOGLE SHEETS
- **Crear una hoja** para cada página/sección
- **Definir columnas** según los datos necesarios
- **Configurar permisos** (público o con API key)
- **Obtener IDs** necesarios (Spreadsheet ID, API Key)

### 3. IMPLEMENTACIÓN TÉCNICA
- **Elegir enfoque** (React o HTML+JS)
- **Crear estructura de archivos** según el enfoque
- **Implementar fetch de datos** desde Google Sheets
- **Crear funciones de renderizado** para cada tipo de contenido

### 4. FUNCIONALIDADES ESPECIALES
- **Modales de imágenes** si es necesario
- **Links en descripciones** si es necesario
- **Responsive design** para móvil/desktop
- **Loading states** y manejo de errores

### 5. DEPLOY Y TESTING
- **Build** (si es React) o **subir archivos** (si es HTML+JS)
- **Configurar dominio** si es necesario
- **Testing** en diferentes dispositivos
- **Monitoreo** de errores

## NOTAS IMPORTANTES
- **Siempre manejar errores** en los fetch
- **Implementar loading states** para mejor UX
- **Validar datos** antes de renderizar
- **Documentar estructura de datos** para facilitar mantenimiento
- **El sistema es completamente flexible** - adapta las columnas a tus necesidades

## MANTENIMIENTO
- **Backup regular** de Google Sheets
- **Versionado** de cambios importantes
- **Testing** en diferentes dispositivos
- **Monitoreo** de errores de API

## VENTAJAS DEL SISTEMA
- **Sin base de datos**: Google Sheets actúa como base de datos
- **Fácil edición**: Cualquiera puede editar contenido sin tocar código
- **Flexible**: Se adapta a cualquier estructura de datos
- **Gratuito**: Google Sheets es gratuito para uso básico
- **Colaborativo**: Múltiples personas pueden editar simultáneamente
- **Versionado**: Google Sheets mantiene historial de cambios 