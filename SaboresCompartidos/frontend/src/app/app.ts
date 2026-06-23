// Se importan las herramientas necesarias desde Angular.
// Component permite definir el componente.
// inject permite obtener servicios sin utilizar un constructor.
// signal permite crear variables reactivas.
import { Component, inject, signal } from '@angular/core';

// CommonModule proporciona directivas básicas como *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// Router permite controlar la navegación.
// RouterOutlet es el contenedor donde Angular mostrará cada pantalla.
// NavigationEnd representa el evento que ocurre al finalizar una navegación.
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';

// filter permite filtrar únicamente ciertos eventos del Router.
import { filter } from 'rxjs/operators';

// Se importa el componente de la barra de navegación inferior.
import { NavbarInferiorComponent } from './layout/navbar-inferior/navbar-inferior.component';

// Decorador que define la configuración del componente principal.
@Component({

  // Nombre con el cual Angular identifica este componente.
  selector: 'app-root',

  // Indica que es un componente independiente.
  standalone: true,

  // Componentes y módulos utilizados dentro de la plantilla.
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarInferiorComponent
  ],

  // Archivo HTML asociado.
  templateUrl: './app.html',

  // Archivo de estilos asociado.
  styleUrls: ['./app.scss']
})
export class App {

  /**
   * Nombre de la aplicación.
   * Puede utilizarse para mostrar el título en diferentes partes de la interfaz.
   */
  title = 'Sabores Compartidos';

  /**
   * Se obtiene una instancia del Router para controlar los cambios de ruta.
   */
  private router = inject(Router);

  /**
   * Signal encargado de controlar la visibilidad de la barra de navegación inferior.
   * El valor inicial se calcula utilizando la ruta actual.
   */
  mostrarNavegacion = signal(
    this.calcularVisibilidad(this.router.url)
  );

  /**
   * Constructor del componente.
   * Se suscribe a los eventos del Router para detectar cada vez que
   * el usuario cambia de pantalla.
   */
  constructor() {

    // Se escucha el flujo de eventos del Router.
    this.router.events

      // Se filtran únicamente los eventos NavigationEnd,
      // que representan una navegación finalizada correctamente.
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )

      // Se ejecuta cada vez que termina una navegación.
      .subscribe((event) => {

        // Se obtiene la URL actual después de redirecciones.
        const url = (event as NavigationEnd).urlAfterRedirects;

        // Se actualiza el signal para mostrar u ocultar la barra de navegación.
        this.mostrarNavegacion.set(
          this.calcularVisibilidad(url)
        );
      });
  }

  /**
   * Determina si la barra de navegación inferior debe mostrarse
   * dependiendo de la pantalla actual.
   *
   * Se oculta en:
   * - Login
   * - Registro
   * - Recuperación de contraseña
   * - Edición de perfil
   */
  private calcularVisibilidad(url: string): boolean {

    // Devuelve false si la URL pertenece a alguna de las pantallas
    // donde la barra de navegación no debe aparecer.
    return !(

      url.includes('login') ||

      url.includes('registro') ||

      url.includes('recuperar') ||

      url.includes('editar-perfil')
    );
  }
}