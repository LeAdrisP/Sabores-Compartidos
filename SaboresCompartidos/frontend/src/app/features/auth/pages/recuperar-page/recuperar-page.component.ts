// 1. Asegúrate de importar 'OnInit' en @angular/core
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-recuperar-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperar-page.component.html',
  styleUrls: ['./recuperar-page.component.scss']
})
export class RecuperarPageComponent implements OnInit { // 👈 2. Agregamos implementacion OnInit
  private router = inject(Router);
  private http = inject(HttpClient);

  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';

  correo = signal('');
  codigo = signal('');
  nuevaContrasena = signal('');
  paso = signal<'correo' | 'codigo' | 'nueva'>('correo');
  errorMessage = signal('');
  contador = signal(60);

  private headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

  // 👈 3. ¡MÁGICA SOLUCIÓN! Al entrar a la pantalla limpiamos todo rastro anterior
  ngOnInit(): void {
    console.log('Inicializando recuperar-page: Limpiando estados anteriores...');
    this.paso.set('correo');
    this.correo.set('');
    this.codigo.set('');
    this.nuevaContrasena.set('');
    this.errorMessage.set('');
  }

  enviarCodigo(): void {
    console.log('Botón presionado, correo:', this.correo());
    this.errorMessage.set('');

    if (!this.correo()) {
      this.errorMessage.set('Por favor ingresa tu correo.');
      return;
    }

    this.http.post(`${this.API_URL}api/auth/recuperar/solicitar`, { correo: this.correo() }, { headers: this.headers }).subscribe({
      next: () => {
        this.paso.set('codigo');
        this.iniciarContador();
      },
      error: (err) => {
        console.error('Error HTTP:', err);
        this.errorMessage.set(err.error?.detail || 'No se pudo enviar el código.');
      }
    });
  }

  private iniciarContador(): void {
    this.contador.set(60);
    const intervalo = setInterval(() => {
      this.contador.set(this.contador() - 1);
      if (this.contador() <= 0) clearInterval(intervalo);
    }, 1000);
  }

  confirmarCodigo(digitos: string[]): void {
    this.codigo.set(digitos.join(''));
    this.paso.set('nueva');
  }

  restablecerContrasena(): void {
    if (!this.nuevaContrasena()) {
      this.errorMessage.set('Ingresa tu nueva contraseña.');
      return;
    }

    const body = {
      correo: this.correo(),
      codigo: this.codigo(),
      nueva_contrasena: this.nuevaContrasena()
    };

    this.http.post(`${this.API_URL}api/auth/recuperar/restablecer`, body, { headers: this.headers }).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.detail || 'Código inválido o expirado.');
      }
    });
  }

  volverAlLogin(): void {
    this.router.navigate(['/login']);
  }
}