// Se importan las herramientas necesarias desde Angular.
// Component permite crear el componente.
// inject permite obtener servicios sin usar constructor.
// OnInit permite ejecutar código al iniciar el componente.
// ChangeDetectorRef permite forzar la actualización de la vista cuando sea necesario.
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';

// Se importa CommonModule para utilizar directivas básicas como *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// Se importa FormsModule para trabajar con formularios y capturar datos escritos por el usuario.
import { FormsModule } from '@angular/forms';

// HttpClient permite realizar peticiones HTTP al backend.
// HttpHeaders permite agregar encabezados personalizados a dichas peticiones.
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Se importa el componente de la barra de navegación inferior.
// Aunque no se utiliza directamente en este archivo, puede estar presente en la plantilla HTML.
import { NavbarInferiorComponent } from '../../../../layout/navbar-inferior/navbar-inferior.component';


// Decorador que define la configuración del componente.
@Component({

  // Nombre con el que se podrá utilizar este componente.
  selector: 'app-buscar-page',

  // Indica que el componente es independiente.
  standalone: true,

  // Módulos necesarios para su funcionamiento.
  imports: [CommonModule, FormsModule],

  // Archivo HTML asociado al componente.
  templateUrl: './buscar-page.component.html',

  // Archivo de estilos asociado.
  styleUrls: ['./buscar-page.component.scss']
})
export class BuscarPageComponent implements OnInit {

  // Se obtiene una instancia de HttpClient para comunicarse con el backend.
  private http = inject(HttpClient);

  // Se obtiene una instancia de ChangeDetectorRef para actualizar manualmente la vista cuando sea necesario.
  private cdr = inject(ChangeDetectorRef);

  // URL base del servidor backend.
  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';

  // Variable que almacena el texto escrito por el usuario en la barra de búsqueda.
  searchText: string = '';

  // Variable que almacena el filtro actualmente seleccionado.
  // Inicialmente se muestran todas las recetas.
  filtroActivo: string = 'Todas';

  // Arreglo que almacena todas las recetas obtenidas desde el backend.
  recetasOriginales: any[] = [];

  // Arreglo que almacenará únicamente las recetas que cumplan con los filtros aplicados.
  recetasFiltradas: any[] = [];

  // Este método se ejecuta automáticamente cuando el componente se inicializa.
  ngOnInit(): void {

    // Se llama al método encargado de obtener las recetas.
    this.obtenerRecetas();
  }

  // Método encargado de descargar las recetas desde el backend.
  obtenerRecetas(): void {

    // Se crea un encabezado personalizado para evitar advertencias de ngrok.
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    // Se realiza una petición GET al endpoint de recetas.
    this.http.get(`${this.API_URL}api/recetas`, { headers }).subscribe({

      // Esta función se ejecuta cuando la respuesta del servidor es exitosa.
      next: (data: any) => {

        // Se verifica si los datos recibidos son directamente un arreglo.
        // Si no lo son, se intenta obtener el arreglo desde la propiedad "recetas".
        // Si tampoco existe, se asigna un arreglo vacío.
        this.recetasOriginales = Array.isArray(data)
          ? data
          : data.recetas || [];

        // Una vez obtenidas las recetas, se aplican los filtros correspondientes.
        this.filtrarRecetas();

        // Se fuerza la actualización de la vista.
        this.cdr.detectChanges();
      },

      // Esta función se ejecuta cuando ocurre un error durante la petición.
      error: () => {

        // Se muestra un mensaje de error en consola.
        console.error('Error al descargar recetas');

        // Como respaldo, se cargan datos predefinidos para evitar que la pantalla quede vacía.
        this.recetasOriginales = [

          {
            nombre: 'Tlayudas oaxaqueñas',
            autor: 'Ana García',
            tiempo: '40 min',
            dificultad: 'Medio',
            dias: 'hace 2 días',
            likes: 34,
            color: '#FDF3E7'
          },

          {
            nombre: 'Ensalada de nopales',
            autor: 'Juan Perez',
            tiempo: '20 min',
            dificultad: 'Fácil',
            dias: 'hace 6 días',
            likes: 21,
            color: '#EAF7EE'
          },

          {
            nombre: 'Mole negro',
            autor: 'María López',
            tiempo: '180 min',
            dificultad: 'Difícil',
            dias: 'hace 12 días',
            likes: 91,
            color: '#EFA6A1'
          },

          {
            nombre: 'Flan de cajeta',
            autor: 'Carlos Ruiz',
            tiempo: '90 min',
            dificultad: 'Medio',
            dias: 'hace 1 día',
            likes: 58,
            color: '#FDF3E7'
          },

          {
            nombre: 'Caldo de res casero',
            autor: 'Luis Méndez',
            tiempo: '120 min',
            dificultad: 'Difícil',
            dias: 'hace 10 días',
            likes: 45,
            color: '#EFA6A1'
          }
        ];

        // Se aplican los filtros a los datos de respaldo.
        this.filtrarRecetas();

        // Se actualiza la vista.
        this.cdr.detectChanges();
      }
    });
  }

  // Método encargado de filtrar las recetas según el texto buscado y la dificultad seleccionada.
  filtrarRecetas(): void {

    // Se recorre el arreglo de recetas originales y solo se conservan las que cumplan ambas condiciones.
    this.recetasFiltradas = this.recetasOriginales.filter(receta => {

      // Verifica si el nombre de la receta contiene el texto escrito por el usuario.
      // Se convierten ambos textos a minúsculas para evitar diferencias entre mayúsculas y minúsculas.
      const cumpleBusqueda =
        receta.nombre.toLowerCase().includes(this.searchText.toLowerCase());

      // Verifica si la dificultad coincide con el filtro seleccionado.
      // Si el filtro es "Todas", se aceptan todas las recetas.
      const cumpleFiltro =
        this.filtroActivo === 'Todas' ||
        receta.dificultad === this.filtroActivo;

      // La receta será incluida únicamente si cumple ambas condiciones.
      return cumpleBusqueda && cumpleFiltro;
    });
  }

  // Método encargado de cambiar el filtro de dificultad.
  setFiltro(tipo: string): void {

    // Se guarda el nuevo filtro seleccionado.
    this.filtroActivo = tipo;

    // Se vuelven a filtrar las recetas con el nuevo criterio.
    this.filtrarRecetas();
  }
}