// 1. Asegúrate de importar 'OnDestroy' y 'Subscription'
import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs'; // 👈 Agregado

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-page.component.html',
  styleUrls: ['./perfil-page.component.scss']
})
export class PerfilPageComponent implements OnInit, OnDestroy { // 👈 2. Implementamos OnDestroy
  private router = inject(Router);
  private http = inject(HttpClient);

  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';
  
  // Guardaremos la suscripción aquí para poder apagarla
  private routerSubscription!: Subscription; 

  nombre = signal('Usuario');
  username = signal('@usuario');
  ubicacion = signal('');
  bio = signal('');
  iniciales = signal('US');
  recetas = signal(0);
  seguidores = signal(0);
  siguiendo = signal(0);

  ngOnInit(): void {
    this.cargarPerfil();

    // 👈 3. Guardamos la suscripción en nuestra variable
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.cargarPerfil();
    });
  }

  // 👈 4. ¡MÁGIA! Al salir del perfil, apagamos el escuchador por completo
  ngOnDestroy(): void {
    if (this.routerSubscription) {
      console.log('Apagando escuchadores del perfil de forma limpia...');
      this.routerSubscription.unsubscribe();
    }
  }

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
        this.recetas.set(data.recetas || 0);
        this.seguidores.set(data.seguidores || 0);
        this.siguiendo.set(data.siguiendo || 0);
        this.iniciales.set(this.obtenerIniciales(this.nombre()));
      },
      error: () => {
        console.error('No se pudo cargar el perfil');
      }
    });
  }

  private obtenerIniciales(nombre: string): string {
    if (!nombre) return 'US';
    return nombre.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  }

  cerrarSesion(): void {
    console.log('Borrando credenciales y cerrando sesión...');
    localStorage.clear(); // Limpieza absoluta y segura
    this.router.navigate(['/login']);
  }

  navigateToEditarPerfil(): void {
    this.router.navigate(['/editar-perfil']);
  }
} 