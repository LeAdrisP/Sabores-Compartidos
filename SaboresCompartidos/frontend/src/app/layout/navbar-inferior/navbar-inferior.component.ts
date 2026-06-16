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
  };

  ngOnInit(): void {
    this.actualizarTabActiva(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.actualizarTabActiva((event as NavigationEnd).urlAfterRedirects);
      });
  }

  setActiveTab(tabName: string): void {
    const ruta = this.rutas[tabName];
    if (ruta) {
      // Forzamos el cambio visual inmediato para que la línea naranja pinte sin retrasos
      this.activeTab = tabName; 
      this.router.navigate([ruta]).catch(err => {
        console.error('Error al navegar: Asegúrate de que la ruta exista en app.routes.ts', err);
      });
    } else {
      this.activeTab = tabName;
    }
    this.tabChanged.emit(tabName);
  }

  private actualizarTabActiva(url: string): void {
    if (url.includes('/perfil')) {
      this.activeTab = 'perfil';
      return;
    }
    if (url.includes('/mis_recetas')) {
      this.activeTab = 'mis_recetas'; // Esto activará la clase .on y pintará la línea naranja en PC
      return;
    }
    if (url.includes('/explorar')) {
      this.activeTab = 'inicio';
    }
    if(url.includes('./editar-receta')){
      this.activeTab = 'editar';
    }
  }
}
