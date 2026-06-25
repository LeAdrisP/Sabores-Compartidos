import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Card, RecetaCard } from "../../../../shared/components/card/card";

@Component({
  selector: 'app-explorar',
  imports: [CommonModule, MatButtonToggleModule, Card],
  templateUrl: './explorar.html',
  styleUrl: './explorar.scss',
})
export class Explorar implements OnInit {
  private http = inject(HttpClient);

  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';
  private headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

  recetas = signal<RecetaCard[]>([]);
  idsFavoritos = signal<string[]>([]);
  cargando = signal(true);

  filtroActivo = signal('Populares');

  recetasOrdenadas = computed(() => {
    let lista = [...this.recetas()];
    const filtro = this.filtroActivo();

    if (filtro === 'Populares') {
      return lista.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    if (filtro === 'Recientes') {
      return lista.sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime());
    }
    if (filtro === 'Favoritos') {
      const ids = this.idsFavoritos();
      return lista.filter(r => ids.includes(r.id));
    }
    return lista;
  });

  // Inicializa datos
  ngOnInit(): void {
    this.cargarRecetas();
    this.cargarFavoritos();
  }

  // Carga recetas
  cargarRecetas(): void {
    this.cargando.set(true);

    this.http.get<any>(`${this.API_URL}api/recetas/`, { headers: this.headers }).subscribe({
      next: (data) => {
        this.recetas.set(data.recetas || []);
        this.cargando.set(false);
      },
      error: () => {
        console.error('No se pudieron cargar las recetas');
        this.cargando.set(false);
      }
    });
  }

  // Carga favoritos
  cargarFavoritos(): void {
    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) return;

    this.http.get<any>(`${this.API_URL}api/interacciones/favoritos/usuario/${usuarioId}`, { headers: this.headers }).subscribe({
      next: (data) => this.idsFavoritos.set(data.recetas_ids || []),
      error: () => console.error('No se pudieron cargar los favoritos')
    });
  }

  // Cambia filtro
  cambiarFiltro(filtro: string): void {
    this.filtroActivo.set(filtro);
    if (filtro === 'Favoritos') {
      this.cargarFavoritos();
    }
  }
}