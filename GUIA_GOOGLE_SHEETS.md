# 📊 Guía de Uso del Sistema Google Sheets - Cora Novoa

## 🎯 **Descripción General**

Este sistema permite gestionar el contenido del sitio web de Cora Novoa directamente desde Google Sheets, sin necesidad de modificar código. Los cambios se reflejan automáticamente en el sitio web.

---

## 📊 **Estructura de las Hojas de Cálculo**

### **📁 Hoja: "obras"**

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| `orden` | Número de orden (1, 2, 3...) | `1` |
| `titulo` | Título de la obra | `"Acción de Prensión"` |
| `año` | Año de creación | `2023` |
| `url_imagen` | URL de la imagen | `"images/accion_de_prension.webp"` |
| `descripcion_esp` | Descripción en español | `"Obra que explora..."` |
| `descripcion_gal` | Descripción en gallego | `"Obra que explora..."` |
| `descripcion_en` | Descripción en inglés | `"Work that explores..."` |

### **📁 Hoja: "bio"**

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| `seccion` | Tipo de sección | `"biografia"`, `"exposiciones"`, `"premios"` |
| `titulo_esp` | Título en español | `"Biografía"` |
| `titulo_gal` | Título en gallego | `"Biografía"` |
| `titulo_en` | Título en inglés | `"Biography"` |
| `contenido_esp` | Contenido en español | `"Cora Novoa nació en..."` |
| `contenido_gal` | Contenido en gallego | `"Cora Novoa naceu en..."` |
| `contenido_en` | Contenido en inglés | `"Cora Novoa was born in..."` |

### **📁 Hoja: "contacto"**

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| `tipo` | Tipo de contacto | `"email"`, `"telefono"`, `"redes"` |
| `valor_esp` | Valor en español | `"info@coranovoa.com"` |
| `valor_gal` | Valor en gallego | `"info@coranovoa.com"` |
| `valor_en` | Valor en inglés | `"info@coranovoa.com"` |

### **📁 Hoja: "curaduria"**

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| `orden` | Número de orden | `1` |
| `titulo_esp` | Título en español | `"Introducción"` |
| `titulo_gal` | Título en gallego | `"Introdución"` |
| `titulo_en` | Título en inglés | `"Introduction"` |
| `contenido_esp` | Contenido en español | `"Este texto explora..."` |
| `contenido_gal` | Contenido en gallego | `"Este texto explora..."` |
| `contenido_en` | Contenido en inglés | `"This text explores..."` |

### **📁 Hoja: "aldan"**

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| `seccion` | Tipo de sección | `"introduccion"`, `"proyecto"` |
| `titulo_esp` | Título en español | `"Proyecto Aldán"` |
| `titulo_gal` | Título en gallego | `"Proxecto Aldán"` |
| `titulo_en` | Título en inglés | `"Aldán Project"` |
| `contenido_esp` | Contenido en español | `"El proyecto Aldán..."` |
| `contenido_gal` | Contenido en gallego | `"O proxecto Aldán..."` |
| `contenido_en` | Contenido en inglés | `"The Aldán project..."` |

---

## ✏️ **Cómo Editar Contenido**

### **🖼️ Añadir una Nueva Obra**

1. **Abre la hoja "obras"**
2. **Añade una nueva fila** al final
3. **Completa los campos:**
   - `orden`: Número secuencial (ej: `15`)
   - `titulo`: Título de la obra
   - `año`: Año
   - `url_imagen`: Ruta de la imagen (ej: `"images/nueva_obra.webp"`)
   - `descripcion_esp`: Descripción en español
   - `descripcion_gal`: Descripción en gallego
   - `descripcion_en`: Descripción en inglés

4. **Guarda la hoja** - Los cambios aparecerán automáticamente en el sitio

### **📝 Editar una Obra Existente**

1. **Localiza la fila** de la obra por su `orden`
2. **Modifica los campos** que necesites
3. **Guarda la hoja** - Los cambios se reflejan inmediatamente

### **🗑️ Eliminar una Obra**

1. **Selecciona toda la fila** de la obra
2. **Elimina la fila** (no solo borrar contenido)
3. **Guarda la hoja**

---


### **📝 Referenciar Imágenes**

El sistema soporta completamente Imgur con múltiples formatos:

1. **Formato [img]:** `[img]https://i.imgur.com/hX8nFLp.jpeg[/img]`
2. **URL directa:** `https://imgur.com/hX8nFLp`
3. **URL completa:** `https://i.imgur.com/hX8nFLp.jpeg`

---

## 🔧 **Solución de Problemas**

### **❌ Si el contenido no se actualiza**

1. **Recarga la página** (F5)
2. **Limpia el caché del navegador**