import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Card, RecetaCard } from '../../../../shared/components/card/card';

interface FiltroAplicado {
  tipo: 'dificultad' | 'categoria' | 'tiempo' | 'porciones';
  etiqueta: string;
}

@Component({
  selector: 'app-buscar-page',
  standalone: true,
  imports: [CommonModule, FormsModule, Card],
  templateUrl: './buscar-page.component.html',
  styleUrls: ['./buscar-page.component.scss']
})
export class BuscarPageComponent implements OnInit {
  private http = inject(HttpClient);

  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';
  private headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

  searchText = signal('');
  recetas = signal<RecetaCard[]>([]);
  cargando = signal(false);

  modalFiltrosAbierto = signal(false);

  dificultadSeleccionada = signal('Todas');
  categoriaSeleccionada = signal('Todas');
  tiempoMaximo = signal(90);
  porcionesMin = signal(1);
  porcionesMax = signal(6);

  filtrosAplicados = signal<FiltroAplicado[]>([]);

  readonly opcionesDificultad = ['Todas', 'Fácil', 'Intermedio', 'Difícil'];
  readonly opcionesCategoria = ['Todas', 'Desayuno', 'Comida principal', 'Cena', 'Merienda'];

  // Inicializa búsqueda
  ngOnInit(): void {
    this.buscarRecetas();
  }

  // Abre filtros
  abrirFiltros(): void {
    this.modalFiltrosAbierto.set(true);
  }

  // Cierra filtros
  cerrarFiltros(): void {
    this.modalFiltrosAbierto.set(false);
  }

  // Limpia filtros
  limpiarTodo(): void {
    this.dificultadSeleccionada.set('Todas');
    this.categoriaSeleccionada.set('Todas');
    this.tiempoMaximo.set(90);
    this.porcionesMin.set(1);
    this.porcionesMax.set(6);
    this.filtrosAplicados.set([]);
    this.buscarRecetas();
  }

  // Aplica filtros
  aplicarFiltros(): void {
    const chips: FiltroAplicado[] = [];

    if (this.dificultadSeleccionada() !== 'Todas') {
      chips.push({ tipo: 'dificultad', etiqueta: this.dificultadSeleccionada() });
    }
    if (this.categoriaSeleccionada() !== 'Todas') {
      chips.push({ tipo: 'categoria', etiqueta: this.categoriaSeleccionada() });
    }
    if (this.tiempoMaximo() < 90) {
      chips.push({ tipo: 'tiempo', etiqueta: `Máx. ${this.tiempoMaximo()} min` });
    }
    if (this.porcionesMin() > 1 || this.porcionesMax() < 6) {
      chips.push({ tipo: 'porciones', etiqueta: `${this.porcionesMin()}-${this.porcionesMax()} porciones` });
    }

    this.filtrosAplicados.set(chips);
    this.modalFiltrosAbierto.set(false);
    this.buscarRecetas();
  }

  // Elimina filtro
  quitarFiltro(filtro: FiltroAplicado): void {
    if (filtro.tipo === 'dificultad') this.dificultadSeleccionada.set('Todas');
    if (filtro.tipo === 'categoria') this.categoriaSeleccionada.set('Todas');
    if (filtro.tipo === 'tiempo') this.tiempoMaximo.set(90);
    if (filtro.tipo === 'porciones') {
      this.porcionesMin.set(1);
      this.porcionesMax.set(6);
    }

    this.filtrosAplicados.set(this.filtrosAplicados().filter(f => f.tipo !== filtro.tipo));
    this.buscarRecetas();
  }

  // Busca recetas
  buscarRecetas(): void {
    this.cargando.set(true);

    let params = new URLSearchParams();

    if (this.searchText().trim()) {
      params.set('texto', this.searchText().trim());
    }
    if (this.dificultadSeleccionada() !== 'Todas') {
      params.set('dificultad', this.dificultadSeleccionada());
    }
    if (this.categoriaSeleccionada() !== 'Todas') {
      params.set('categoria', this.categoriaSeleccionada());
    }
    if (this.tiempoMaximo() < 90) {
      params.set('tiempo_max', String(this.tiempoMaximo()));
    }
    if (this.porcionesMin() > 1) {
      params.set('porciones_min', String(this.porcionesMin()));
    }
    if (this.porcionesMax() < 6) {
      params.set('porciones_max', String(this.porcionesMax()));
    }

    this.http.get<any>(
      `${this.API_URL}api/recetas/buscar/filtrar?${params.toString()}`,
      { headers: this.headers }
    ).subscribe({
      next: (data) => {
        this.recetas.set(data.recetas || []);
        this.cargando.set(false);
      },
      error: () => {
        console.error('Error al buscar recetas');
        this.cargando.set(false);
      }
    });
  }
}