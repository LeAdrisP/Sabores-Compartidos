// Se importan las herramientas necesarias desde Angular.
// Component permite definir el componente.
// Input permite recibir información desde un componente padre.
// inject permite obtener servicios sin utilizar un constructor.
import { Component, Input, inject } from '@angular/core';

// Se importan los módulos de Angular Material utilizados por la tarjeta.
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

// Router permite navegar entre las diferentes páginas de la aplicación.
import { Router } from '@angular/router';

/**
 * Interfaz que define la estructura de los datos que recibirá una tarjeta de receta.
 * Cada propiedad describe información específica de una receta publicada.
 */
export interface RecetaCard {

  // Identificador único de la receta.
  id: string;

  // Título de la receta.
  titulo: string;

  // Nombre del autor que publicó la receta.
  autor_nombre: string;

  // Fecha en la que fue creada la receta.
  fecha_creacion: string;

  // Nivel de dificultad de la preparación.
  dificultad: string;

  // Tiempo aproximado requerido para realizar la receta.
  tiempo_aproximado: string;

  // Número de porciones que produce la receta.
  porciones: number;

  // URL de la imagen asociada a la receta.
  // Puede ser null si la receta no posee fotografía.
  imagen_url: string | null;

  // Cantidad de likes recibidos.
  likes: number;
}

// Decorador que define la configuración del componente.
@Component({

  // Nombre con el que este componente puede utilizarse en otras plantillas.
  selector: 'app-card',

  // Indica que es un componente independiente.
  standalone: true,

  // Módulos de Angular Material utilizados por la tarjeta.
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],

  // Archivo HTML asociado.
  templateUrl: './card.html',

  // Archivo de estilos asociado.
  styleUrl: './card.scss',
})
export class Card {

  // Se obtiene una instancia del Router para controlar la navegación.
  private router = inject(Router);

  /**
   * Propiedad recibida desde el componente padre.
   * Contiene toda la información que será mostrada dentro de la tarjeta.
   */
  @Input()
  receta!: RecetaCard;

  /**
   * Imagen por defecto utilizada cuando una receta no posee una fotografía asociada.
   */
  readonly imagenDefault =
    'https://www.bettycrocker.lat/mx/wp-content/uploads/sites/2/2020/12/BCmexico-recipe-pastel-maravilla-de-chocolate.png';

  /**
   * Convierte la fecha de creación de la receta en un texto relativo
   * más fácil de interpretar por el usuario.
   * Ejemplos:
   * Hace un momento
   * Hace 15 min
   * Hace 2 horas
   * Hace 3 días
   */
  tiempoRelativo(): string {

    // Se convierte la fecha almacenada en la receta en un objeto Date.
    const fecha = new Date(this.receta.fecha_creacion);

    // Se obtiene la fecha y hora actuales.
    const ahora = new Date();

    // Se calcula la diferencia en milisegundos entre ambas fechas.
    const diffMs = ahora.getTime() - fecha.getTime();

    // Se convierte la diferencia a minutos.
    const diffMin = Math.floor(diffMs / 60000);

    // Se convierte la diferencia a horas.
    const diffHoras = Math.floor(diffMin / 60);

    // Se convierte la diferencia a días.
    const diffDias = Math.floor(diffHoras / 24);

    // Si la diferencia es menor a un minuto.
    if (diffMin < 1)
      return 'Hace un momento';

    // Si la diferencia es menor a una hora.
    if (diffMin < 60)
      return `Hace ${diffMin} min`;

    // Si la diferencia es menor a un día.
    if (diffHoras < 24)
      return `Hace ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`;

    // Si la diferencia es menor a una semana.
    if (diffDias < 7)
      return `Hace ${diffDias} día${diffDias > 1 ? 's' : ''}`;

    // Si han pasado más de siete días, se devuelve una fecha normal.
    return fecha.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  /**
   * Navega hacia la pantalla de comentarios de la receta seleccionada.
   * También detiene la propagación del evento para evitar que se ejecute
   * el evento de clic asociado a la tarjeta completa.
   */
  irAComentarios(event: Event): void {

    // Se evita que el evento continúe propagándose hacia elementos superiores.
    event.stopPropagation();

    // Se navega hacia la pantalla de comentarios enviando el id de la receta
    // como parámetro de consulta.
    this.router.navigate(
      ['/comentarios-page'],
      {
        queryParams: {
          recetaId: this.receta.id
        }
      }
    );
  }

  /**
   * Navega hacia la vista detallada de la receta seleccionada.
   */
  verDetalle(): void {

    // Se redirige a la pantalla de detalle enviando el id de la receta
    // mediante parámetros de consulta.
    this.router.navigate(
      ['/detalle-receta'],
      {
        queryParams: {
          id: this.receta.id
        }
      }
    );
  }
}