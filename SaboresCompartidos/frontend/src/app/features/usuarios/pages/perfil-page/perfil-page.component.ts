// Se importan las herramientas necesarias desde Angular.
// Component permite definir el componente.
// inject permite obtener servicios sin utilizar constructor.
// OnInit permite ejecutar código al crear el componente.
// OnDestroy permite ejecutar código antes de destruir el componente.
// signal permite crear variables reactivas.
import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';

// Se importa CommonModule para utilizar directivas básicas como *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// Router permite navegar entre las páginas.
// NavigationEnd representa el evento que se dispara cuando una navegación termina correctamente.
import { Router, NavigationEnd } from '@angular/router';

// HttpClient permite realizar peticiones HTTP al backend.
// HttpHeaders permite agregar encabezados personalizados.
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Se importa filter para filtrar únicamente ciertos eventos provenientes del Router.
import { filter } from 'rxjs/operators';

// Subscription representa una suscripción a un Observable.
// Se utilizará para guardar la suscripción a los eventos del Router y posteriormente cancelarla.
import { Subscription } from 'rxjs';

// Decorador que define las características del componente.
@Component({

  // Nombre con el cual puede utilizarse este componente.
  selector: 'app-perfil-page',

  // Indica que el componente es independiente.
  standalone: true,

  // Módulos necesarios para el funcionamiento del componente.
  imports: [CommonModule],

  // Archivo HTML asociado.
  templateUrl: './perfil-page.component.html',

  // Archivo de estilos asociado.
  styleUrls: ['./perfil-page.component.scss']
})

// La clase implementa OnInit y OnDestroy.
// OnInit se ejecuta cuando el componente se crea.
// OnDestroy se ejecuta cuando el componente es destruido.
export class PerfilPageComponent implements OnInit, OnDestroy {

  // Se obtiene una instancia del Router para realizar navegación.
  private router = inject(Router);

  // Se obtiene una instancia del servicio HttpClient para comunicarse con el backend.
  private http = inject(HttpClient);

  // URL base del servidor donde se encuentra la API.
  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';

  // Variable que almacenará la suscripción a los eventos del Router.
  // Esto permitirá cancelarla posteriormente para evitar fugas de memoria.
  private routerSubscription!: Subscription;

  // Signals que almacenan la información del perfil del usuario.
  nombre = signal('Usuario');
  username = signal('@usuario');
  ubicacion = signal('');
  bio = signal('');
  iniciales = signal('US');

  // Signals que almacenan estadísticas del perfil.
  recetas = signal(0);
  seguidores = signal(0);
  siguiendo = signal(0);

  /**
   * Método ejecutado automáticamente cuando el componente es creado.
   * Se encarga de cargar los datos del perfil y mantenerlos actualizados
   * cada vez que ocurre una navegación.
   */
  ngOnInit(): void {

    // Se cargan inicialmente los datos del usuario.
    this.cargarPerfil();

    // Se crea una suscripción que escuchará los eventos del Router.
    // Solo se tomarán aquellos eventos que sean NavigationEnd.
    this.routerSubscription = this.router.events.pipe(

      // Filtra únicamente los eventos de tipo NavigationEnd.
      filter(event => event instanceof NavigationEnd)

    ).subscribe(() => {

      // Cada vez que finalice una navegación se volverán a cargar los datos del perfil.
      this.cargarPerfil();
    });
  }

  /**
   * Método ejecutado automáticamente cuando el componente es destruido.
   * Su objetivo es liberar recursos y cancelar suscripciones activas.
   */
  ngOnDestroy(): void {

    // Se verifica que exista una suscripción activa.
    if (this.routerSubscription) {

      // Mensaje de depuración.
      console.log('Apagando escuchadores del perfil de forma limpia...');

      // Se cancela la suscripción para evitar fugas de memoria.
      this.routerSubscription.unsubscribe();
    }
  }

  /**
   * Obtiene la información del usuario desde el backend.
   */
  cargarPerfil(): void {

    // Se recupera el identificador del usuario almacenado en localStorage.
    const usuarioId = localStorage.getItem('usuario_id');

    // Si no existe una sesión activa, se redirige al login.
    if (!usuarioId) {

      this.router.navigate(['/login']);
      return;
    }

    // Se crea un encabezado personalizado para evitar advertencias de ngrok.
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    // Se realiza una petición GET para obtener los datos del usuario.
    this.http.get(`${this.API_URL}api/usuarios/${usuarioId}`, {
      headers
    }).subscribe({

      // Si la petición es exitosa.
      next: (data: any) => {

        // Se almacenan los datos recibidos en los signals correspondientes.
        this.nombre.set(data.nombre || 'Usuario');
        this.username.set(data.nombre_usuario || '@usuario');
        this.ubicacion.set(data.ubicacion || '');
        this.bio.set(data.biografia || '');
        this.recetas.set(data.recetas || 0);
        this.seguidores.set(data.seguidores || 0);
        this.siguiendo.set(data.siguiendo || 0);

        // Se generan las iniciales del nombre para utilizarlas como avatar.
        this.iniciales.set(this.obtenerIniciales(this.nombre()));
      },

      // Si ocurre un error durante la petición.
      error: () => {

        // Se muestra un mensaje de error en consola.
        console.error('No se pudo cargar el perfil');
      }
    });
  }

  /**
   * Genera las iniciales del nombre del usuario.
   * Si el nombre está vacío devuelve "US".
   */
  private obtenerIniciales(nombre: string): string {

    // Si el nombre está vacío se devuelve "US".
    if (!nombre)
      return 'US';

    // Se divide el nombre por espacios, se obtiene la primera letra de cada palabra,
    // se unen todas las letras, se convierten a mayúsculas y se limitan a dos caracteres.
    return nombre
      .split(' ')
      .map(p => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  /**
   * Cierra la sesión del usuario.
   */
  cerrarSesion(): void {

    // Mensaje de depuración.
    console.log('Borrando credenciales y cerrando sesión...');

    // Se elimina toda la información almacenada localmente.
    localStorage.clear();

    // Se redirige al usuario a la pantalla de inicio de sesión.
    this.router.navigate(['/login']);
  }

  /**
   * Redirige al usuario hacia la pantalla de edición del perfil.
   */
  navigateToEditarPerfil(): void {

    // Se cambia la ruta actual hacia la página de edición del perfil.
    this.router.navigate(['/editar-perfil']);
  }
}