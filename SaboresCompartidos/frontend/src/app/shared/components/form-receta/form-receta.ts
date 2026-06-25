import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

interface IngredienteForm {
  nombre: string;
  cantidad: string;
}

@Component({
  selector: 'app-form-receta',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './form-receta.html',
  styleUrl: './form-receta.scss',
})
export class FormReceta implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';
  private headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

  recetaId: string | null = null;
  modoEdicion = signal(false);

  titulo = '';
  descripcion = '';
  tiempoAproximado = '';
  dificultad = '';
  porciones: number | null = null;
  categoria = '';
  momentoDia = '';
  tipoPlatillo = '';

  ingredientes: IngredienteForm[] = [{ nombre: '', cantidad: '' }];
  preparacion: string[] = [''];

  imagenArchivo: File | null = null;
  imagenPreview = signal<string | null>(null);

  errorMessage = signal('');
  enviando = signal(false);
  cargandoDatos = signal(false);

  // Cargar receta para editar
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.recetaId = id;
        this.modoEdicion.set(true);
        this.cargarRecetaExistente(id);
      }
    });
  }

  // Obtener datos de receta
  cargarRecetaExistente(id: string): void {
    this.cargandoDatos.set(true);

    this.http.get<any>(`${this.API_URL}api/recetas/${id}`, { headers: this.headers }).subscribe({
      next: (data) => {
        this.titulo = data.titulo;
        this.descripcion = data.descripcion;
        this.tiempoAproximado = data.tiempo_aproximado;
        this.dificultad = data.dificultad;
        this.porciones = data.porciones;
        this.categoria = data.categoria;
        this.momentoDia = data.momento_dia;
        this.tipoPlatillo = data.tipo_platillo;
        this.ingredientes = data.ingredientes.length ? data.ingredientes : [{ nombre: '', cantidad: '' }];
        this.preparacion = data.preparacion.length ? data.preparacion : [''];

        if (data.imagen_url) {
          this.imagenPreview.set(data.imagen_url);
        }

        this.cargandoDatos.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar la receta para editar.');
        this.cargandoDatos.set(false);
      }
    });
  }

  // Seleccionar imagen
  onImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imagenArchivo = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.imagenPreview.set(reader.result as string);
      reader.readAsDataURL(this.imagenArchivo);
    }
  }

  // Agregar ingrediente
  agregarIngrediente(): void {
    this.ingredientes.push({ nombre: '', cantidad: '' });
  }

  // Eliminar ingrediente
  eliminarIngrediente(index: number): void {
    if (this.ingredientes.length <= 1) return;
    this.ingredientes.splice(index, 1);
  }

  // Agregar paso
  agregarPaso(): void {
    this.preparacion.push('');
  }

  // Eliminar paso
  eliminarPaso(index: number): void {
    if (this.preparacion.length <= 1) return;
    this.preparacion.splice(index, 1);
  }

  // Guardar receta
  publicarReceta(): void {
    this.errorMessage.set('');

    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.titulo || !this.descripcion || !this.tiempoAproximado ||
        !this.dificultad || !this.porciones || !this.categoria ||
        !this.momentoDia || !this.tipoPlatillo) {
      this.errorMessage.set('Por favor llena todos los campos.');
      return;
    }

    const ingredientesValidos = this.ingredientes.filter(i => i.nombre && i.cantidad);
    const pasosValidos = this.preparacion.filter(p => p.trim() !== '');

    if (ingredientesValidos.length === 0) {
      this.errorMessage.set('Agrega al menos un ingrediente.');
      return;
    }

    if (pasosValidos.length === 0) {
      this.errorMessage.set('Agrega al menos un paso de preparación.');
      return;
    }

    this.enviando.set(true);

    const formData = new FormData();
    formData.append('titulo', this.titulo);
    formData.append('descripcion', this.descripcion);
    formData.append('tiempo_aproximado', this.tiempoAproximado);
    formData.append('dificultad', this.dificultad);
    formData.append('porciones', String(this.porciones));
    formData.append('categoria', this.categoria);
    formData.append('momento_dia', this.momentoDia);
    formData.append('tipo_platillo', this.tipoPlatillo);
    formData.append('ingredientes', JSON.stringify(ingredientesValidos));
    formData.append('preparacion', JSON.stringify(pasosValidos));
    formData.append('usuario_id', usuarioId);

    if (this.imagenArchivo) {
      formData.append('imagen', this.imagenArchivo);
    }

    const peticion = this.modoEdicion()
      ? this.http.put(`${this.API_URL}api/recetas/${this.recetaId}`, formData, { headers: this.headers })
      : this.http.post(`${this.API_URL}api/recetas/`, formData, { headers: this.headers });

    peticion.subscribe({
      next: () => {
        this.enviando.set(false);
        if (this.modoEdicion() && this.recetaId) {
          this.router.navigate(['/detalle-receta'], { queryParams: { id: this.recetaId } });
        } else {
          this.router.navigate(['/explorar']);
        }
      },
      error: (err) => {
        this.enviando.set(false);
        this.errorMessage.set(err.error?.detail || 'Error al guardar la receta.');
      }
    });
  }

  // Identificar elementos de lista
  trackByIndex(index: number): number {
    return index;
  }
}