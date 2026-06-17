import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';

    // Datos del perfil con valores por defecto para usuario nuevo
  nombre: string = 'Usuario';
  username: string = '@usuario';
  ubicacion: string = '';
  bio: string = '';
  iniciales: string = 'US';
  recetas: number = 0;
  seguidores: number = 0;
  siguiendo: number = 0;

  ngOnInit(): void {
    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

    this.http.get(`${this.API_URL}api/usuarios/${usuarioId}`, { headers }).subscribe({
      next: (data: any) => {
        this.nombre = data.nombre || this.generarNombreAleatorio();
        this.username = data.username || this.generarUsernameAleatorio();
        this.ubicacion = data.ubicacion || '';
        this.bio = data.bio || '';
        this.iniciales = this.obtenerIniciales(this.nombre);
      },
      error: () => {
        // Si falla la carga, dejamos los valores por defecto
        this.nombre = this.generarNombreAleatorio();
        this.username = this.generarUsernameAleatorio();
        this.iniciales = this.obtenerIniciales(this.nombre);
      }
    });
  }

  private generarNombreAleatorio(): string {
    const nombres = ['Chef Nuevo', 'Cocinero Oaxaqueño', 'Foodie Mexicano'];
    return nombres[Math.floor(Math.random() * nombres.length)];
  }

  private generarUsernameAleatorio(): string {
    const num = Math.floor(Math.random() * 9999);
    return `@usuario${num}`;
  }

  private obtenerIniciales(nombre: string): string {
    return nombre.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  }


  cerrarSesion(): void {
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('correo');
    this.router.navigate(['/login']);
  }

  navigateToEditarPerfil(): void {
    this.router.navigate(['/editar-perfil']);
  }
}
