// Se importa el decorador Component para definir el componente
// e inject para obtener servicios sin necesidad de utilizar un constructor.
import { Component, inject } from '@angular/core';

// CommonModule proporciona directivas básicas de Angular.
// Location permite interactuar con el historial de navegación del navegador.
import { CommonModule, Location } from '@angular/common';

// Se importan módulos de Angular Material utilizados en la vista.
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

// Se importa la librería html2pdf, la cual permite convertir
// elementos HTML en archivos PDF descargables.
import html2pdf from 'html2pdf.js';

// Decorador que define la configuración del componente.
@Component({

  // Nombre con el cual el componente puede utilizarse dentro de otras plantillas.
  selector: 'app-detalle-page',

  // Indica que el componente es independiente.
  standalone: true,

  // Módulos utilizados por la plantilla HTML.
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule
  ],

  // Archivo HTML asociado al componente.
  templateUrl: './detalle-page.component.html',

  // Archivo de estilos asociado.
  styleUrls: ['./detalle-page.component.scss']
})
export class DetallePageComponent {

  // Se obtiene una instancia del servicio Location.
  // Este servicio permite manipular el historial de navegación del navegador.
  private location = inject(Location);

  /**
   * Método encargado de regresar a la pantalla anterior.
   * Utiliza el historial del navegador en lugar de navegar a una ruta específica.
   */
  volver(): void {

    // Mensaje mostrado en consola para fines de depuración.
    console.log('Regresando a la pantalla anterior en el historial...');

    // Se retrocede una posición dentro del historial del navegador.
    this.location.back();
  }

  /**
   * Método encargado de convertir el contenido de la receta en un archivo PDF.
   * La captura se realiza sobre el contenedor principal de la vista.
   */
  descargarPDF(): void {

    // Mensaje informativo para verificar que el proceso ha comenzado.
    console.log('Iniciando descarga de la receta...');

    // Se busca dentro del DOM el elemento que contiene toda la información de la receta.
    const elemento = document.querySelector('.screen-detail') as HTMLElement;

    // Se verifica que el elemento exista.
    if (!elemento) {

      // Si no existe, se informa del error y se detiene el proceso.
      console.error('No se encontró la sección de la receta para exportar.');
      return;
    }

    // Se define la configuración que tendrá el documento PDF.
    const opciones = {

      // Margen del documento.
      margin: 5,

      // Nombre con el que se descargará el archivo.
      filename: 'Receta-Tlayudas-Oaxaqueñas.pdf',

      // Configuración de la imagen utilizada durante la conversión.
      image: {
        type: 'jpeg',
        quality: 0.98
      },

      // Configuración del motor html2canvas encargado de capturar la vista.
      html2canvas: {
        scale: 2,
        useCORS: true,
        mediaType: 'print'
      },

      // Configuración del documento PDF generado.
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }

    } as const;

    // Se inicia el proceso de conversión.
    // Primero se toma el elemento HTML,
    // después se aplican las opciones configuradas
    // y finalmente se descarga automáticamente el archivo PDF.
    html2pdf()
      .from(elemento)
      .set(opciones)
      .save();
  }
}