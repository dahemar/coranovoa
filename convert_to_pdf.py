#!/usr/bin/env python3
"""
Script para convertir la guía HTML a PDF usando weasyprint
"""

import os
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration

def convert_html_to_pdf():
    """Convierte el archivo HTML a PDF"""
    
    # Configurar fuentes
    font_config = FontConfiguration()
    
    # Leer el archivo HTML
    html_file = 'guia-uso-final.html'
    
    if not os.path.exists(html_file):
        print(f"Error: No se encontró el archivo {html_file}")
        return False
    
    try:
        # Crear el objeto HTML
        html_doc = HTML(filename=html_file)
        
        # Generar el PDF
        output_file = 'Guia_Uso_Google_Sheets_Cora_Novoa.pdf'
        html_doc.write_pdf(output_file, font_config=font_config)
        
        print(f"✅ PDF generado exitosamente: {output_file}")
        print(f"📄 Archivo guardado en: {os.path.abspath(output_file)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error al generar el PDF: {str(e)}")
        return False

if __name__ == "__main__":
    print("🔄 Convirtiendo HTML a PDF...")
    success = convert_html_to_pdf()
    
    if success:
        print("\n🎉 ¡Conversión completada!")
        print("📖 Puedes abrir el archivo PDF con cualquier visor de PDF")
    else:
        print("\n💥 Error en la conversión") 