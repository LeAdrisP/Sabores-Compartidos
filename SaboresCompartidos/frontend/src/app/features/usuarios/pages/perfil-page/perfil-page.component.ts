import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-page.component.html',
  styleUrls: ['./perfil-page.component.scss']
})
export class PerfilPageComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';
  
  nombre: string = 'Usuario';
  username: string = '@usuario';
  ubicacion: string = '';
  bio: string = '';
  iniciales: string = 'US';
  recetas: number = 0;
  seguidores: number = 0;
  siguiendo: number = 0;

  /**
   * Carga el perfil al iniciar y se suscribe a los eventos de navegación
   * para recargar los datos cada vez que el usuario regresa a esta pantalla.
   */
  ngOnInit(): void {
    this.cargarPerfil();
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.cargarPerfil();
    });
  }

  /**
   * Obtiene los datos del perfil del usuario desde el backend usando el ID
   * almacenado en localStorage. Si no hay sesión activa, redirige al login.
   */
  cargarPerfil(): void {
    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });
    
    this.http.get(`${this.API_URL}api/usuarios/${usuarioId}`, { headers }).subscribe({
      next: (data: any) => {
        this.nombre = data.nombre || 'Usuario';
        this.username = data.nombre_usuario || '@usuario';
        this.ubicacion = data.ubicacion || '';
        this.bio = data.biografia || '';
        this.recetas = data.recetas || 0;
        this.seguidores = data.seguidores || 0;
        this.siguiendo = data.seguiendo || 0;
        this.iniciales = this.obtenerIniciales(this.nombre);
        this.cdr.detectChanges(); 
      },
      error: () => {
        console.error('No se pudo cargar el perfil');
      }
    });
  }

  /**
   * Genera las iniciales del avatar a partir del nombre completo del usuario.
   * Devuelve 'US' como valor por defecto si el nombre está vacío.
   */
  private obtenerIniciales(nombre: string): string {
    if (!nombre) return 'US';
    return nombre.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  }

  /** Elimina la sesión del localStorage y redirige a la pantalla de login */
  cerrarSesion(): void {
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('correo');
    this.router.navigate(['/login']);
  }

  /** Navega a la pantalla de edición de perfil */
  navigateToEditarPerfil(): void {
    this.router.navigate(['/editar-perfil']);
  }
}