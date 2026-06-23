import { Component, inject } from '@angular/core';

import { CommonModule, Location } from '@angular/common';

import { MatChipsModule } from '@angular/material/chips';

import { MatIconModule } from '@angular/material/icon';

import html2pdf from 'html2pdf.js';



@Component({

  selector: 'app-detalle-page',

  standalone: true,

  imports: [

    CommonModule,

    MatChipsModule,

    MatIconModule

  ],

  templateUrl: './detalle-page.component.html',

  styleUrls: ['./detalle-page.component.scss']

})

export class DetallePageComponent {

  private location = inject(Location);



  /**

   * Cierra la vista de detalles y regresa a la pantalla anterior

   */

  volver(): void {

    console.log('Regresando a la pantalla anterior en el historial...');

    this.location.back();

  }



  /**

   * Captura el contenedor de la receta y lo exporta como un PDF limpio

   */

  descargarPDF(): void {

    console.log('Iniciando descarga de la receta...');

   

    // Seleccionamos la pantalla de la receta (excluyendo márgenes externos si los hay)

    const elemento = document.querySelector('.screen-detail') as HTMLElement;

   

    if (!elemento) {

      console.error('No se encontró la sección de la receta para exportar.');

      return;

    }



    // Configuramos las propiedades del PDF para que se adapte perfectamente

    const opciones = {

      margin:       5,

      filename:     'Receta-Tlayudas-Oaxaqueñas.pdf',

      image:        { type: 'jpeg', quality: 0.98 },

      html2canvas:  { scale: 2, useCORS: true, mediaType: 'print' },

      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }

    }as const;



    // Lanzamos el proceso asíncrono de conversión y descarga

    html2pdf().from(elemento).set(opciones).save();

  }

}