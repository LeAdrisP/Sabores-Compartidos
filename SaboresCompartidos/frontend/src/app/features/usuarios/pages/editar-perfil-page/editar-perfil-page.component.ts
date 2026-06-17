import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-editar-perfil-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-perfil-page.component.html',
  styleUrls: ['./editar-perfil-page.component.scss']
})
export class EditarPerfilPageComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);

  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';

  // Campos editables
  nombre: string = '';
  username: string = '';
  bio: string = '';
  ubicacion: string = '';
  iniciales: string = '';

  isSessionActive: boolean = true;

  ngOnInit(): void {
    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

    this.http.get(`${this.API_URL}api/usuarios/${usuarioId}`, { headers }).subscribe({
      next: (data: any) => {
        this.nombre = data.nombre || '';
        this.username = data.username || '';
        this.bio = data.bio || '';
        this.ubicacion = data.ubicacion || '';
        this.iniciales = this.obtenerIniciales(this.nombre);
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

  toggleSession(): void {
    this.isSessionActive = !this.isSessionActive;
  }

  guardarPerfil(): void {
    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) return;

    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

    const body = {
      nombre: this.nombre,
      username: this.username,
      bio: this.bio,
      ubicacion: this.ubicacion
    };

    this.http.put(`${this.API_URL}api/usuarios/${usuarioId}`, body, { headers }).subscribe({
      next: () => {
        console.log('Perfil actualizado');
        this.router.navigate(['/perfil']);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/perfil']);
  }
}