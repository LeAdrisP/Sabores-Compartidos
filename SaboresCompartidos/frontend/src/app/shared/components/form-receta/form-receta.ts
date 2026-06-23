import { Component, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MatSelectModule } from '@angular/material/select';

import { MatInputModule } from '@angular/material/input';

import { MatFormFieldModule } from '@angular/material/form-field';



interface IngredienteForm {

  nombre: string;

  cantidad: string;

}



@Component({

  selector: 'app-form-receta',

  standalone: true,

  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],

  templateUrl: './form-receta.html',

  styleUrl: './form-receta.scss',

})

export class FormReceta {

  private router = inject(Router);

  private http = inject(HttpClient);



  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';

  private headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });



  titulo = '';

  descripcion = '';

  tiempoAproximado = '';

  dificultad = '';

  porciones: number | null = null;

  categoria = '';

  momentoDia = '';

  tipoPlatillo = '';



  ingredientes: IngredienteForm[] = [{ nombre: '', cantidad: '' }];

  preparacion: string[] = [''];



  imagenArchivo: File | null = null;

  imagenPreview = signal<string | null>(null);



  errorMessage = signal('');

  enviando = signal(false);



  /** Captura el archivo de imagen seleccionado y genera una vista previa local */

  onImagenSeleccionada(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {

      this.imagenArchivo = input.files[0];



      const reader = new FileReader();

      reader.onload = () => this.imagenPreview.set(reader.result as string);

      reader.readAsDataURL(this.imagenArchivo);

    }

  }



  /** Agrega una nueva fila vacía de ingrediente al formulario */

  agregarIngrediente(): void {

    this.ingredientes.push({ nombre: '', cantidad: '' });

  }



  /** Elimina la fila de ingrediente en el índice indicado */

  eliminarIngrediente(index: number): void {

    if (this.ingredientes.length <= 1) return;

    this.ingredientes.splice(index, 1);

  }



  /** Agrega un nuevo paso vacío a la lista de preparación */

  agregarPaso(): void {

    this.preparacion.push('');

  }



  /** Elimina el paso de preparación en el índice indicado */

  eliminarPaso(index: number): void {

    if (this.preparacion.length <= 1) return;

    this.preparacion.splice(index, 1);

  }



  /**

   * Valida los campos obligatorios y construye el FormData con todos

   * los datos de la receta (incluyendo imagen si existe) para enviarlo

   * al backend como multipart/form-data.

   */

  publicarReceta(): void {

    this.errorMessage.set('');



    const usuarioId = localStorage.getItem('usuario_id');

    if (!usuarioId) {

      this.router.navigate(['/login']);

      return;

    }



    if (!this.titulo || !this.descripcion || !this.tiempoAproximado ||

        !this.dificultad || !this.porciones || !this.categoria ||

        !this.momentoDia || !this.tipoPlatillo) {

      this.errorMessage.set('Por favor llena todos los campos.');

      return;

    }



    const ingredientesValidos = this.ingredientes.filter(i => i.nombre && i.cantidad);

    const pasosValidos = this.preparacion.filter(p => p.trim() !== '');



    if (ingredientesValidos.length === 0) {

      this.errorMessage.set('Agrega al menos un ingrediente.');

      return;

    }



    if (pasosValidos.length === 0) {

      this.errorMessage.set('Agrega al menos un paso de preparación.');

      return;

    }



    this.enviando.set(true);



    const formData = new FormData();

    formData.append('titulo', this.titulo);

    formData.append('descripcion', this.descripcion);

    formData.append('tiempo_aproximado', this.tiempoAproximado);

    formData.append('dificultad', this.dificultad);

    formData.append('porciones', String(this.porciones));

    formData.append('categoria', this.categoria);

    formData.append('momento_dia', this.momentoDia);

    formData.append('tipo_platillo', this.tipoPlatillo);

    formData.append('ingredientes', JSON.stringify(ingredientesValidos));

    formData.append('preparacion', JSON.stringify(pasosValidos));

    formData.append('usuario_id', usuarioId);



    if (this.imagenArchivo) {

      formData.append('imagen', this.imagenArchivo);

    }



    this.http.post(`${this.API_URL}api/recetas/`, formData, { headers: this.headers }).subscribe({

      next: () => {

        this.enviando.set(false);

        this.router.navigate(['/explorar']);

      },

      error: (err) => {

        this.enviando.set(false);

        this.errorMessage.set(err.error?.detail || 'Error al publicar la receta.');

      }

    });

  }



    /** Permite que Angular identifique cada fila de ingrediente por su índice de forma estable */

  trackByIndex(index: number): number {

    return index;

  }

}