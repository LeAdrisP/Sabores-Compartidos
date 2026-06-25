import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Card, RecetaCard } from '../../../../shared/components/card/card';

interface RecetaConCategoria extends RecetaCard {
  categoria?: string;
  momento_dia?: string;
}

@Component({
  selector: 'app-mis-recetas-page',
  standalone: true,
  imports: [CommonModule, FormsModule, Card],
  templateUrl: './mis-recetas-page.component.html',
  styleUrls: ['./mis-recetas-page.component.scss']
})
export class MisRecetasPageComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);

  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';
  private headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

  recetas = signal<RecetaConCategoria[]>([]);
  cargando = signal(true);

  textoBusqueda = signal('');

  categoriaActiva = signal('Todas');

  readonly categorias = ['Todas', 'Desayunos', 'Comidas', 'Cenas', 'Postres'];

  private readonly mapaCategorias: Record<string, string[]> = {
    'Desayunos': ['Desayuno'],
    'Comidas': ['Almuerzo', 'Comida principal'],
    'Cenas': ['Cena'],
    'Postres': ['Merienda']
  };

  recetasFiltradas = computed(() => {
    let resultado = this.recetas();

    const categoria = this.categoriaActiva();
    if (categoria !== 'Todas') {
      const valoresPermitidos = this.mapaCategorias[categoria] || [];
      resultado = resultado.filter(r => valoresPermitidos.includes(r.momento_dia || ''));
    }

    const texto = this.textoBusqueda().trim().toLowerCase();
    if (texto) {
      resultado = resultado.filter(r => r.titulo.toLowerCase().includes(texto));
    }

    return resultado;
  });

  // Carga recetas del usuario
  ngOnInit(): void {
    this.cargarMisRecetas();
  }

  // Obtiene recetas
  cargarMisRecetas(): void {
    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) {
      this.router.navigate(['/login']);
      return;
    }

    this.cargando.set(true);

    this.http.get<any>(
      `${this.API_URL}api/recetas/usuario/${usuarioId}`,
      { headers: this.headers }
    ).subscribe({
      next: (data) => {
        this.recetas.set(data.recetas || []);
        this.cargando.set(false);
      },
      error: () => {
        console.error('No se pudieron cargar tus recetas');
        this.cargando.set(false);
      }
    });
  }

  // Filtra categoría
  seleccionarCategoria(categoria: string): void {
    this.categoriaActiva.set(categoria);
  }
}