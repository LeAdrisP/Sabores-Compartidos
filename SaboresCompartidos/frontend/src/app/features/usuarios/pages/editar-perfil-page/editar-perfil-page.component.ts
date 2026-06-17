import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);
  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';

  nombre: string = '';
  username: string = '';
  bio: string = '';
  ubicacion: string = '';
  iniciales: string = '';

  isSessionActive: boolean = true;

  /**
   * Carga los datos actuales del perfil desde el backend al entrar a la pantalla.
   * Si no hay sesión activa, redirige al login.
   */
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
          this.username = data.nombre_usuario || '';
          this.bio = data.biografia || '';
          this.ubicacion = data.ubicacion || '';
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

  /** Alterna el estado del switch "Mantener sesión iniciada" */
  toggleSession(): void {
    this.isSessionActive = !this.isSessionActive;
  }

  /**
   * Envía los datos editados al backend para actualizar el perfil en Firestore.
   * Al completarse con éxito, redirige a la pantalla de perfil.
   */
  guardarPerfil(): void {
    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) return;

    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

    const body = {
        nombre: this.nombre,
        nombre_usuario: this.username,
        biografia: this.bio,
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

  /** Cancela la edición y regresa al perfil sin guardar cambios */
  cancelar(): void {
    this.router.navigate(['/perfil']);
  }
}