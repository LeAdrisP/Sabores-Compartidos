// Se importan las herramientas necesarias desde Angular.
// Component permite definir un componente.
// OnInit permite ejecutar código automáticamente cuando se crea el componente.
// inject permite obtener servicios sin utilizar un constructor.
// signal permite crear variables reactivas que actualizan automáticamente la interfaz.
import { Component, OnInit, inject, signal } from '@angular/core';

// Se importa CommonModule para disponer de directivas básicas como *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// Se importa el módulo de Angular Material que permite utilizar botones de tipo toggle.
import { MatButtonToggleModule } from '@angular/material/button-toggle';

// HttpClient permite realizar peticiones HTTP al backend.
// HttpHeaders permite agregar encabezados personalizados a dichas peticiones.
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Se importa el componente Card encargado de mostrar una receta en forma de tarjeta.
// También se importa la interfaz RecetaCard que define la estructura de los datos de una receta.
import { Card, RecetaCard } from "../../../../shared/components/card/card";

// Decorador que define la configuración del componente.
@Component({

  // Nombre con el que este componente puede ser utilizado.
  selector: 'app-explorar',

  // Componentes y módulos necesarios para que este componente funcione correctamente.
  imports: [CommonModule, MatButtonToggleModule, Card],

  // Archivo HTML asociado a este componente.
  templateUrl: './explorar.html',

  // Archivo de estilos asociado al componente.
  styleUrl: './explorar.scss',
})

// La clase implementa la interfaz OnInit para ejecutar lógica al inicializarse.
export class Explorar implements OnInit {

  // Se obtiene una instancia del servicio HttpClient para realizar peticiones HTTP.
  private http = inject(HttpClient);

  // URL base donde se encuentra alojado el backend.
  // Todas las solicitudes se construirán a partir de esta dirección.
  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';

  // Encabezado personalizado utilizado para evitar la advertencia de ngrok.
  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });

  // Signal que almacena el arreglo de recetas obtenidas desde el backend.
  // Inicialmente comienza vacío.
  recetas = signal<RecetaCard[]>([]);

  // Signal que indica si las recetas se están cargando.
  // Se inicializa en true porque al abrir la vista se realizará una petición al servidor.
  cargando = signal(true);

  /** Carga todas las recetas publicadas desde el backend al iniciar la vista */
  ngOnInit(): void {

    // Cuando el componente es creado, se llama al método encargado de obtener las recetas.
    this.cargarRecetas();
  }

  /**
   * Método encargado de obtener todas las recetas almacenadas
   * en el backend y asignarlas al signal recetas para que
   * posteriormente se muestren como tarjetas en la interfaz.
   */
  cargarRecetas(): void {

    // Se establece el estado de carga en verdadero.
    // Esto puede utilizarse para mostrar un spinner o mensaje de carga.
    this.cargando.set(true);

    // Se realiza una petición GET al endpoint encargado de devolver todas las recetas.
    this.http.get<any>(
      `${this.API_URL}api/recetas/`,
      { headers: this.headers }
    ).subscribe({

      // Esta función se ejecuta cuando el servidor responde correctamente.
      next: (data) => {

        // Se almacenan las recetas recibidas en el signal recetas.
        // Si por alguna razón data.recetas no existe, se asigna un arreglo vacío.
        this.recetas.set(data.recetas || []);

        // Se indica que la carga ha finalizado.
        this.cargando.set(false);
      },

      // Esta función se ejecuta cuando ocurre un error en la petición.
      error: () => {

        // Se muestra un mensaje de error en la consola para depuración.
        console.error('No se pudieron cargar las recetas');

        // Se desactiva el estado de carga para evitar que la interfaz quede esperando indefinidamente.
        this.cargando.set(false);
      }
    });
  }
}