import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarInferiorComponent } from './layout/navbar-inferior/navbar-inferior.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarInferiorComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {

  // Nombre de la aplicación.
  title = 'Sabores Compartidos';

  // Servicio de navegación.
  private router = inject(Router);

  // Controla si la barra de navegación debe mostrarse.
  mostrarNavegacion = signal(
    this.calcularVisibilidad(this.router.url)
  );

  // Actualiza la visibilidad de la navegación al cambiar de ruta.
  constructor() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects;

        this.mostrarNavegacion.set(
          this.calcularVisibilidad(url)
        );
      });
  }

  // Determina en qué pantallas debe ocultarse la navegación.
  private calcularVisibilidad(url: string): boolean {
    return !(

      url.includes('login') ||

      url.includes('registro') ||

      url.includes('recuperar') ||

      url.includes('editar-perfil')
    );
  }
}