import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar-inferior',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-inferior.component.html',
  styleUrls: ['./navbar-inferior.component.scss']
})
export class NavbarInferiorComponent implements OnInit {
  activeTab: string = 'inicio';

  @Output() tabChanged = new EventEmitter<string>();

  private router = inject(Router);

  private readonly rutas: Record<string, string> = {
    inicio: '/explorar',
    perfil: '/perfil',
    mis_recetas: '/mis_recetas',
    publicar:'/editar-receta',
    buscar: '/buscar',
  };

  /**
   * Detecta la ruta activa al cargar el componente y se suscribe a los eventos
   * de navegación para mantener el tab resaltado sincronizado con la URL actual.
   */
  ngOnInit(): void {
    this.actualizarTabActiva(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.actualizarTabActiva((event as NavigationEnd).urlAfterRedirects);
      });
  }

  /**
   * Navega a la ruta correspondiente al tab seleccionado y emite el evento
   * de cambio para que el componente padre pueda reaccionar si es necesario.
   */
  setActiveTab(tabName: string): void {
    const ruta = this.rutas[tabName];
    if (ruta) {
      this.activeTab = tabName; 
      this.router.navigate([ruta]).catch(err => {
        console.error('Error al navegar: Asegúrate de que la ruta exista en app.routes.ts', err);
      });
    } else {
      this.activeTab = tabName;
    }
    this.tabChanged.emit(tabName);
  }

  /**
   * Compara la URL actual contra las rutas conocidas para determinar
   * qué tab debe aparecer como activo en la barra de navegación.
   */
  private actualizarTabActiva(url: string): void {
    if (url.includes('/perfil')) {
      this.activeTab = 'perfil';
      return;
    }
    if (url.includes('/mis_recetas')) {
      this.activeTab = 'mis_recetas';
      return;
    }
    if (url.includes('/explorar')) {
      this.activeTab = 'inicio';
    }
    if(url.includes('./editar-receta')){
      this.activeTab = 'editar';
    }
    if (url.includes('/buscar')) { 
      this.activeTab = 'buscar'; return; 
    }
  }
}
