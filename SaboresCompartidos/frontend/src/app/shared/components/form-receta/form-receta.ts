// Se importan las herramientas necesarias desde Angular.
// Component permite definir el componente.
// inject permite obtener servicios sin utilizar un constructor.
// signal permite crear variables reactivas.
import { Component, inject, signal } from '@angular/core';

// Se importa CommonModule para disponer de directivas básicas como *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// FormsModule permite trabajar con formularios y capturar información ingresada por el usuario.
import { FormsModule } from '@angular/forms';

// Router permite navegar entre las diferentes páginas de la aplicación.
import { Router } from '@angular/router';

// HttpClient permite realizar peticiones al backend.
// HttpHeaders permite agregar encabezados personalizados a dichas peticiones.
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Se importan componentes de Angular Material utilizados por el formulario.
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

/**
 * Interfaz que define la estructura de cada ingrediente de la receta.
 * Cada ingrediente posee un nombre y una cantidad.
 */
interface IngredienteForm {

  // Nombre del ingrediente.
  nombre: string;

  // Cantidad correspondiente al ingrediente.
  cantidad: string;
}

// Decorador que define la configuración del componente.
@Component({

  // Nombre con el cual el componente puede utilizarse dentro de otras plantillas.
  selector: 'app-form-receta',

  // Indica que el componente es independiente.
  standalone: true,

  // Módulos necesarios para el funcionamiento del componente.
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],

  // Archivo HTML asociado.
  templateUrl: './form-receta.html',

  // Archivo de estilos asociado.
  styleUrl: './form-receta.scss',
})
export class FormReceta {

  // Se obtiene una instancia del Router para controlar la navegación.
  private router = inject(Router);

  // Se obtiene una instancia del servicio HttpClient para comunicarse con el backend.
  private http = inject(HttpClient);

  // URL base del servidor donde se encuentra la API.
  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';

  // Encabezado personalizado utilizado para evitar advertencias de ngrok.
  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });

  // Variables que almacenan la información principal de la receta.
  titulo = '';
  descripcion = '';
  tiempoAproximado = '';
  dificultad = '';
  porciones: number | null = null;
  categoria = '';
  momentoDia = '';
  tipoPlatillo = '';

  // Arreglo que almacena todos los ingredientes ingresados.
  // Se inicializa con una fila vacía.
  ingredientes: IngredienteForm[] = [
    {
      nombre: '',
      cantidad: ''
    }
  ];

  // Arreglo que almacena los pasos de preparación.
  // Inicialmente contiene un solo paso vacío.
  preparacion: string[] = [''];

  // Variable que almacena el archivo de imagen seleccionado por el usuario.
  imagenArchivo: File | null = null;

  // Signal utilizado para mostrar una vista previa de la imagen.
  imagenPreview = signal<string | null>(null);

  // Signal que almacena mensajes de error.
  errorMessage = signal('');

  // Signal que indica si la receta se encuentra en proceso de envío.
  enviando = signal(false);

  /**
   * Captura la imagen seleccionada por el usuario y genera una vista previa.
   */
  onImagenSeleccionada(event: Event): void {

    // Se obtiene el input que originó el evento.
    const input = event.target as HTMLInputElement;

    // Se verifica que exista un archivo seleccionado.
    if (input.files && input.files[0]) {

      // Se almacena el archivo en memoria.
      this.imagenArchivo = input.files[0];

      // Se crea un lector de archivos.
      const reader = new FileReader();

      // Cuando la lectura finalice, se almacena la imagen codificada
      // para mostrar una vista previa.
      reader.onload = () => {
        this.imagenPreview.set(reader.result as string);
      };

      // Se inicia la lectura del archivo.
      reader.readAsDataURL(this.imagenArchivo);
    }
  }

  /**
   * Agrega una nueva fila vacía de ingrediente.
   */
  agregarIngrediente(): void {

    // Se añade un nuevo objeto vacío al arreglo de ingredientes.
    this.ingredientes.push({
      nombre: '',
      cantidad: ''
    });
  }

  /**
   * Elimina un ingrediente según su posición.
   */
  eliminarIngrediente(index: number): void {

    // Se evita eliminar la última fila disponible.
    if (this.ingredientes.length <= 1)
      return;

    // Se elimina el ingrediente indicado.
    this.ingredientes.splice(index, 1);
  }

  /**
   * Agrega un nuevo paso vacío a la preparación.
   */
  agregarPaso(): void {

    // Se agrega una nueva posición al arreglo.
    this.preparacion.push('');
  }

  /**
   * Elimina un paso de preparación.
   */
  eliminarPaso(index: number): void {

    // Se evita eliminar el último paso disponible.
    if (this.preparacion.length <= 1)
      return;

    // Se elimina el paso indicado.
    this.preparacion.splice(index, 1);
  }

  /**
   * Valida la información del formulario y envía la receta al backend.
   */
  publicarReceta(): void {

    // Se limpian mensajes de error anteriores.
    this.errorMessage.set('');

    // Se recupera el identificador del usuario almacenado localmente.
    const usuarioId = localStorage.getItem('usuario_id');

    // Si no existe una sesión activa, se redirige al login.
    if (!usuarioId) {

      this.router.navigate(['/login']);
      return;
    }

    // Se verifica que todos los campos obligatorios estén llenos.
    if (
      !this.titulo ||
      !this.descripcion ||
      !this.tiempoAproximado ||
      !this.dificultad ||
      !this.porciones ||
      !this.categoria ||
      !this.momentoDia ||
      !this.tipoPlatillo
    ) {

      this.errorMessage.set('Por favor llena todos los campos.');
      return;
    }

    // Se obtienen únicamente los ingredientes válidos.
    const ingredientesValidos = this.ingredientes.filter(
      i => i.nombre && i.cantidad
    );

    // Se obtienen únicamente los pasos válidos.
    const pasosValidos = this.preparacion.filter(
      p => p.trim() !== ''
    );

    // Se verifica que exista al menos un ingrediente.
    if (ingredientesValidos.length === 0) {

      this.errorMessage.set('Agrega al menos un ingrediente.');
      return;
    }

    // Se verifica que exista al menos un paso de preparación.
    if (pasosValidos.length === 0) {

      this.errorMessage.set('Agrega al menos un paso de preparación.');
      return;
    }

    // Se indica que el proceso de envío ha comenzado.
    this.enviando.set(true);

    // Se crea un objeto FormData para enviar información multipart/form-data.
    const formData = new FormData();

    // Se agregan todos los datos principales de la receta.
    formData.append('titulo', this.titulo);
    formData.append('descripcion', this.descripcion);
    formData.append('tiempo_aproximado', this.tiempoAproximado);
    formData.append('dificultad', this.dificultad);
    formData.append('porciones', String(this.porciones));
    formData.append('categoria', this.categoria);
    formData.append('momento_dia', this.momentoDia);
    formData.append('tipo_platillo', this.tipoPlatillo);

    // Los arreglos se convierten a formato JSON antes de enviarlos.
    formData.append(
      'ingredientes',
      JSON.stringify(ingredientesValidos)
    );

    formData.append(
      'preparacion',
      JSON.stringify(pasosValidos)
    );

    // Se agrega el identificador del usuario.
    formData.append('usuario_id', usuarioId);

    // Si existe una imagen, se adjunta al formulario.
    if (this.imagenArchivo) {

      formData.append('imagen', this.imagenArchivo);
    }

    // Se envía la receta al backend.
    this.http.post(
      `${this.API_URL}api/recetas/`,
      formData,
      { headers: this.headers }
    ).subscribe({

      // Si el proceso finaliza correctamente.
      next: () => {

        // Se desactiva el indicador de envío.
        this.enviando.set(false);

        // Se redirige a la pantalla principal.
        this.router.navigate(['/explorar']);
      },

      // Si ocurre un error.
      error: (err) => {

        // Se desactiva el indicador de envío.
        this.enviando.set(false);

        // Se muestra el mensaje recibido por el backend.
        this.errorMessage.set(
          err.error?.detail || 'Error al publicar la receta.'
        );
      }
    });
  }

  /**
   * Permite que Angular identifique cada elemento del arreglo
   * mediante su índice para optimizar el renderizado.
   */
  trackByIndex(index: number): number {

    // Devuelve el índice actual.
    return index;
  }
}