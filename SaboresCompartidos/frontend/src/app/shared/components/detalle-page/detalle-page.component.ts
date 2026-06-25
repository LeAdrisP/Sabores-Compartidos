import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import html2pdf from 'html2pdf.js';

interface Ingrediente {
  nombre: string;
  cantidad: string;
}

interface Receta {
  id: string;
  usuario_id: string;
  titulo: string;
  descripcion: string;
  autor_nombre: string;
  fecha_creacion: string;
  dificultad: string;
  tiempo_aproximado: string;
  porciones: number;
  categoria: string;
  momento_dia: string;
  tipo_platillo: string;
  imagen_url: string | null;
  ingredientes: Ingrediente[];
  preparacion: string[];
  likes: number;
}

@Component({
  selector: 'app-detalle-page',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule],
  templateUrl: './detalle-page.component.html',
  styleUrls: ['./detalle-page.component.scss']
})
export class DetallePageComponent implements OnInit {

  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';
  private headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

  readonly imagenDefault =
    'https://www.bettycrocker.lat/mx/wp-content/uploads/sites/2/2020/12/BCmexico-recipe-pastel-maravilla-de-chocolate.png';

  receta = signal<Receta | null>(null);
  cargando = signal(true);
  error = signal('');

  // Carga detalle de receta
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.cargarReceta(id);
      } else {
        this.error.set('No se proporcionó un ID de receta.');
        this.cargando.set(false);
      }
    });
  }

  // Obtiene receta por ID
  cargarReceta(id: string): void {
    this.cargando.set(true);
    this.http.get<any>(
      `${this.API_URL}api/recetas/${id}`,
      { headers: this.headers }
    ).subscribe({
      next: (data) => {
        this.receta.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la receta.');
        this.cargando.set(false);
      }
    });
  }

  // Calcula tiempo transcurrido
  tiempoRelativo(): string {
    const r = this.receta();
    if (!r) return '';
    const fecha = new Date(r.fecha_creacion);
    const ahora = new Date();
    const diffMin = Math.floor((ahora.getTime() - fecha.getTime()) / 60000);
    const diffHoras = Math.floor(diffMin / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffMin < 1) return 'Hace un momento';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHoras < 24) return `Hace ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`;
    if (diffDias < 7) return `Hace ${diffDias} día${diffDias > 1 ? 's' : ''}`;

    return fecha.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  // Regresa a pantalla anterior
  volver(): void {
    this.location.back();
  }

  // Descarga receta en PDF
  descargarPDF(): void {
    const r = this.receta();
    const elemento = document.querySelector('.screen-detail') as HTMLElement;
    if (!elemento) return;

    const opciones = {
      margin: 5,
      filename: `Receta-${r?.titulo ?? 'receta'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, mediaType: 'print' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    } as const;

    html2pdf().from(elemento).set(opciones).save();
  }

  // Verifica autor de receta
  esAutor(): boolean {
    const usuarioId = localStorage.getItem('usuario_id');
    return !!usuarioId && this.receta()?.usuario_id === usuarioId;
  }

  // Navega a edición
  editarReceta(): void {
    const r = this.receta();
    if (!r) return;

    this.router.navigate(['/editar-receta'], {
      queryParams: { id: r.id }
    });
  }

  // Solicita confirmación de eliminación
  confirmarEliminar(): void {
    const r = this.receta();
    if (!r) return;

    const confirmado = window.confirm(
      `¿Seguro que quieres eliminar "${r.titulo}"? Esta acción no se puede deshacer.`
    );

    if (!confirmado) return;

    this.eliminarReceta(r.id);
  }

  // Elimina receta
  private eliminarReceta(recetaId: string): void {
    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) return;

    this.http.delete(
      `${this.API_URL}api/recetas/${recetaId}?usuario_id=${usuarioId}`,
      { headers: this.headers }
    ).subscribe({
      next: () => {
        this.router.navigate(['/explorar']);
      },
      error: () => {
        this.error.set('No se pudo eliminar la receta.');
      }
    });
  }
}