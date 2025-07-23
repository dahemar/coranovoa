# 📋 ACTUALIZAR HOJA "ALDAN" EN GOOGLE SHEETS

## 🎯 **ESTRUCTURA CORRECTA**

La hoja "Aldan" debe tener **exactamente 4 columnas**:

| order | content_gal | content_esp | content_en |
|-------|-------------|-------------|------------|
| 1 | Contenido principal en gallego... | Contenido principal en español... | Main content in English... |
| 2 | Enlace Instagram en gallego... | Enlace Instagram en español... | Instagram link in English... |

## 🔧 **PASOS PARA ACTUALIZAR**

### **PASO 1: Crear nueva hoja**
1. **Ir a Google Sheets:** https://docs.google.com/spreadsheets/d/1GC8bqmQeQHD0H1QnIGAQbOPtBg19_4dkspwZEUjgi1k/edit?usp=sharing
2. **Crear nueva hoja** llamada "Aldan"
3. **Añadir las columnas** en la primera fila: `order,content_gal,content_esp,content_en`

### **PASO 2: Copiar el contenido**
Usar el archivo `cora_aldan_structure.csv` que ya está preparado con la estructura correcta.

## 📊 **EXPLICACIÓN DE COLUMNAS**

### **`order`** - Orden de visualización
- Números secuenciales (1, 2, 3, 4...)
- Para Aldán se usan 2 líneas:
  - **1** = Contenido principal del texto
  - **2** = Enlace de Instagram

### **`content_gal`** - Contenido en gallego
- Texto en gallego (línea 1: contenido principal, línea 2: enlace)
- Incluye HTML para formato

### **`content_esp`** - Contenido en español
- Texto en español (línea 1: contenido principal, línea 2: enlace)
- Incluye HTML para formato

### **`content_en`** - Contenido en inglés
- Texto en inglés (línea 1: contenido principal, línea 2: enlace)
- Incluye HTML para formato

## ✅ **EJEMPLO DE ESTRUCTURA**

```
order,content_gal,content_esp,content_en
1,"é un encontro anual autoxestionado, onde as únicas certezas son onde e cando: Aldán, Cangas do Morrazo, Galiza, en verán. O qué é indefinido, está por construír mediante o facer —como a propia práctica—, cambia cada vez...","es un encuentro anual autogestionado, donde las únicas certezas son dónde y cuándo: Aldán, Cangas do Morrazo, Galicia, en verano. El qué es indefinido, está por construir mediante el hacer —como la propia práctica—, cambia cada vez...","is a self-managed annual gathering, where the only certainties are where and when: Aldán, Cangas do Morrazo, Galicia, in summer. What it is remains undefined, to be built through doing—like practice itself—changing each time..."
2,"<br><br><a href=\"https://www.instagram.com/algo_de_veran_/\" target=\"_blank\" class=\"instagram-link\">@algo_de_veran_</a>","<br><br><a href=\"https://www.instagram.com/algo_de_veran_/\" target=\"_blank\" class=\"instagram-link\">@algo_de_veran_</a>","<br><br><a href=\"https://www.instagram.com/algo_de_veran_/\" target=\"_blank\" class=\"instagram-link\">@algo_de_veran_</a>"
```

**Nota:** El título "Algo de verán" con su formato HTML especial y un espacio se añaden automáticamente y no se pueden editar en Google Sheets.

## 🚨 **IMPORTANTE**

- **Solo 4 columnas** - No más, no menos
- **2 líneas** de contenido:
  - **Línea 1:** Contenido principal del texto
  - **Línea 2:** Enlace de Instagram (editable por separado)
- **HTML incluido** para formato y enlaces
- **Comillas** para proteger el contenido con comas
- **Sin columnas extra** o fragmentadas

## 🔄 **MIGRACIÓN RÁPIDA**

1. **Descargar** `cora_aldan_structure.csv`
2. **Importar** en Google Sheets (nueva hoja "Aldan")
3. **Verificar** que solo hay 4 columnas y 2 líneas de datos
4. **Probar** que funciona correctamente

## ✅ **RESULTADO**

Una vez actualizada la hoja:
- ✅ El cliente podrá editar el contenido principal de Aldán
- ✅ El cliente podrá editar el enlace de Instagram por separado
- ✅ Los idiomas funcionarán correctamente
- ✅ El formato HTML se preservará
- ✅ Los enlaces funcionarán

## 📝 **CONTENIDO ACTUAL**

### **Título fijo (no editable):**
- "Algo de verán" con formato HTML especial
- Espacio fijo después del título
- Se mantiene fijo en el código, no se puede editar en Google Sheets

### **Línea 1 - Contenido principal (editable):**
- Descripción del proyecto (sin el título)
- Información sobre el encuentro anual autogestionado
- Texto plano sin HTML especial

### **Línea 2 - Enlace Instagram (editable):**
- Enlace editable: @algo_de_veran_
- URL: https://www.instagram.com/algo_de_veran_/
- Formato HTML con clase CSS

## 🎯 **VENTAJAS DE LA NUEVA ESTRUCTURA**

- **Título protegido** - El formato especial se mantiene intacto
- **Enlace editable** por separado
- **Fácil mantenimiento** del contenido
- **Flexibilidad** para cambiar solo el enlace
- **Estructura clara** y organizada
- **Prevención de errores** - No se puede romper el formato del título

¿Necesitas ayuda con algún paso específico? 