import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface RecetaTop {
  id: string;
  titulo: string;
  imagen_url: string | null;
  tiempo_aproximado: string;
  likes: number;
}

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-page.component.html',
  styleUrls: ['./perfil-page.component.scss']
})
export class PerfilPageComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private http = inject(HttpClient);

  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';
  private routerSubscription!: Subscription;

  nombre = signal('Usuario');
  username = signal('@usuario');
  ubicacion = signal('');
  bio = signal('');
  iniciales = signal('US');

  totalRecetas = signal(0);

  topRecetas = signal<RecetaTop[]>([]);

  // Cargar perfil
  ngOnInit(): void {
    this.cargarPerfil();
    this.cargarTopRecetas();

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.cargarPerfil();
      this.cargarTopRecetas();
    });
  }

  // Liberar suscripción
  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Obtener datos del perfil
  cargarPerfil(): void {
    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

    this.http.get(`${this.API_URL}api/usuarios/${usuarioId}`, { headers }).subscribe({
      next: (data: any) => {
        this.nombre.set(data.nombre || 'Usuario');
        this.username.set(data.nombre_usuario || '@usuario');
        this.ubicacion.set(data.ubicacion || '');
        this.bio.set(data.biografia || '');
        this.iniciales.set(this.obtenerIniciales(this.nombre()));
      },
      error: () => console.error('No se pudo cargar el perfil')
    });

    this.contarRecetasUsuario(usuarioId);
  }

  // Contar recetas
  private contarRecetasUsuario(usuarioId: string): void {
    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

    this.http.get<any>(`${this.API_URL}api/recetas/usuario/${usuarioId}`, { headers }).subscribe({
      next: (data) => {
        this.totalRecetas.set((data.recetas || []).length);
      },
      error: () => console.error('No se pudo contar las recetas')
    });
  }

  // Cargar recetas destacadas
  cargarTopRecetas(): void {
    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) return;

    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

    this.http.get<any>(`${this.API_URL}api/recetas/usuario/${usuarioId}/top`, { headers }).subscribe({
      next: (data) => {
        this.topRecetas.set(data.recetas || []);
      },
      error: () => console.error('No se pudieron cargar las recetas mejor valoradas')
    });
  }

  // Generar iniciales
  private obtenerIniciales(nombre: string): string {
    if (!nombre) return 'US';
    return nombre.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  }

  // Cerrar sesión
  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // Ir a editar perfil
  navigateToEditarPerfil(): void {
    this.router.navigate(['/editar-perfil']);
  }
}