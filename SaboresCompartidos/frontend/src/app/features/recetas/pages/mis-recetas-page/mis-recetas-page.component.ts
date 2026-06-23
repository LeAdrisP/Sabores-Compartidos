// Se importa el decorador Component y la función inject desde Angular.
// Component permite definir un componente.
// inject permite obtener servicios sin necesidad de utilizar un constructor.
import { Component, inject } from '@angular/core';

// Se importa CommonModule para disponer de directivas básicas como *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// Se importa Router para permitir la navegación entre las diferentes páginas de la aplicación.
import { Router } from '@angular/router';

// Decorador que define la configuración del componente.
@Component({

  // Nombre con el cual este componente puede ser utilizado dentro de otras plantillas.
  selector: 'app-mis-recetas-page',

  // Indica que el componente es independiente y no necesita pertenecer a un módulo.
  standalone: true,

  // Módulos necesarios para el funcionamiento del componente.
  imports: [CommonModule],

  // Archivo HTML asociado al componente.
  templateUrl: './mis-recetas-page.component.html',

  // Archivo de estilos asociado al componente.
  styleUrls: ['./mis-recetas-page.component.scss']
})
export class MisRecetasPageComponent {

  // En futuras versiones aquí podrían declararse arreglos o interfaces
  // para almacenar las recetas del usuario y trabajar con datos dinámicos.

  // Se obtiene una instancia del servicio Router.
  // Este servicio permite cambiar entre las distintas rutas de la aplicación.
  private router = inject(Router);

  /**
   * Método encargado de abrir la vista detallada de una receta.
   * Actualmente redirige a la pantalla correspondiente al detalle de receta.
   */
  verDetalleReceta(): void {

    // Se muestra un mensaje en consola para fines de depuración.
    // Permite verificar que el método fue ejecutado correctamente.
    console.log('Navegando a la vista extendida de la preparación...');

    // Se realiza la navegación hacia la ruta correspondiente al detalle de la receta.
    this.router.navigate(['/detalle-receta']);
  }
}