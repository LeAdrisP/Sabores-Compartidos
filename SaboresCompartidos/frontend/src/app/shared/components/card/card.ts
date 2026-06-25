import { Component, Input, inject, signal, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface RecetaCard {
  id: string;
  titulo: string;
  autor_nombre: string;
  fecha_creacion: string;
  dificultad: string;
  tiempo_aproximado: string;
  porciones: number;
  imagen_url: string | null;
  likes: number;
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);

  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';
  private headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

  @Input() receta!: RecetaCard;

  readonly imagenDefault =
    'https://www.bettycrocker.lat/mx/wp-content/uploads/sites/2/2020/12/BCmexico-recipe-pastel-maravilla-de-chocolate.png';

  yaDioLike = signal(false);
  contadorLikes = signal(0);
  esFavorito = signal(false);

  private enviandoLike = false;
  private enviandoFavorito = false;

  // Inicializa interacciones
  ngOnInit(): void {
    this.contadorLikes.set(this.receta.likes || 0);

    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) return;

    this.http
      .get<any>(
        `${this.API_URL}api/interacciones/likes/${this.receta.id}/${usuarioId}`,
        { headers: this.headers }
      )
      .subscribe({
        next: (data) => this.yaDioLike.set(data.liked),
        error: () => {},
      });

    this.http
      .get<any>(
        `${this.API_URL}api/interacciones/favoritos/${this.receta.id}/${usuarioId}`,
        { headers: this.headers }
      )
      .subscribe({
        next: (data) => this.esFavorito.set(data.favorito),
        error: () => {},
      });
  }

  // Gestiona likes
  toggleLike(event: Event): void {
    event.stopPropagation();

    if (this.enviandoLike) return;

    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) {
      this.router.navigate(['/login']);
      return;
    }

    const likeAnterior = this.yaDioLike();
    const contadorAnterior = this.contadorLikes();
    this.yaDioLike.set(!likeAnterior);
    this.contadorLikes.set(likeAnterior ? contadorAnterior - 1 : contadorAnterior + 1);

    this.enviandoLike = true;

    this.http
      .post<any>(
        `${this.API_URL}api/interacciones/likes/${this.receta.id}`,
        { usuario_id: usuarioId },
        { headers: this.headers }
      )
      .subscribe({
        next: (data) => {
          this.yaDioLike.set(data.liked);
          this.contadorLikes.set(data.likes);
          this.enviandoLike = false;
        },
        error: () => {
          this.yaDioLike.set(likeAnterior);
          this.contadorLikes.set(contadorAnterior);
          this.enviandoLike = false;
        },
      });
  }

  // Gestiona favoritos
  toggleFavorito(event: Event): void {
    event.stopPropagation();

    if (this.enviandoFavorito) return;

    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) {
      this.router.navigate(['/login']);
      return;
    }

    const favoritoAnterior = this.esFavorito();
    this.esFavorito.set(!favoritoAnterior);

    this.enviandoFavorito = true;

    this.http
      .post<any>(
        `${this.API_URL}api/interacciones/favoritos/${this.receta.id}`,
        { usuario_id: usuarioId },
        { headers: this.headers }
      )
      .subscribe({
        next: (data) => {
          this.esFavorito.set(data.favorito);
          this.enviandoFavorito = false;
        },
        error: () => {
          this.esFavorito.set(favoritoAnterior);
          this.enviandoFavorito = false;
        },
      });
  }

  // Calcula tiempo transcurrido
  tiempoRelativo(): string {
    const fecha = new Date(this.receta.fecha_creacion);
    const ahora = new Date();
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMin / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffMin < 1) return 'Hace un momento';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHoras < 24) return `Hace ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`;
    if (diffDias < 7) return `Hace ${diffDias} día${diffDias > 1 ? 's' : ''}`;

    return fecha.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  // Abre comentarios
  irAComentarios(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/comentarios-page'], {
      queryParams: { recetaId: this.receta.id },
    });
  }

  // Muestra detalle de receta
  verDetalle(): void {
    if (!this.receta?.id) return;
    this.router.navigate(['/detalle-receta'], {
      queryParams: { id: this.receta.id },
    });
  }
}