// Se importan las herramientas necesarias desde Angular.
// Component permite crear el componente.
// EventEmitter permite enviar eventos hacia componentes padres.
// inject permite obtener servicios sin utilizar un constructor.
// OnInit permite ejecutar código cuando el componente es creado.
// Output permite exponer eventos para que otros componentes puedan escucharlos.
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';

// Se importa CommonModule para disponer de directivas básicas como *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// NavigationEnd representa el evento que se produce cuando una navegación finaliza.
// Router permite cambiar entre las diferentes rutas de la aplicación.
import { NavigationEnd, Router } from '@angular/router';

// filter permite filtrar los eventos emitidos por el Router y procesar solo los que interesan.
import { filter } from 'rxjs/operators';

// Decorador que define las propiedades y configuración del componente.
@Component({

  // Nombre con el que este componente puede utilizarse en otras plantillas.
  selector: 'app-navbar-inferior',

  // Indica que este componente es independiente y no necesita un módulo.
  standalone: true,

  // Módulos necesarios para su funcionamiento.
  imports: [CommonModule],

  // Archivo HTML asociado al componente.
  templateUrl: './navbar-inferior.component.html',

  // Archivo de estilos asociado.
  styleUrls: ['./navbar-inferior.component.scss']
})
export class NavbarInferiorComponent implements OnInit {

  // Variable que almacena el nombre del tab que actualmente está seleccionado.
  // Por defecto, se considera que el usuario se encuentra en la pantalla principal.
  activeTab: string = 'inicio';

  // Evento que será emitido cuando el usuario cambie de pestaña.
  // Esto permite que un componente padre pueda reaccionar ante el cambio.
  @Output()
  tabChanged = new EventEmitter<string>();

  // Se obtiene una instancia del Router para controlar la navegación.
  private router = inject(Router);

  // Objeto que relaciona cada pestaña con su ruta correspondiente.
  // La clave representa el nombre del tab y el valor la URL asociada.
  private readonly rutas: Record<string, string> = {

    // Ruta principal.
    inicio: '/explorar',

    // Ruta del perfil del usuario.
    perfil: '/perfil',

    // Ruta donde se muestran las recetas propias del usuario.
    mis_recetas: '/mis_recetas',

    // Ruta para crear o editar una receta.
    publicar: '/editar-receta',

    // Ruta para buscar recetas.
    buscar: '/buscar',
  };

  /**
   * Método que se ejecuta automáticamente al crear el componente.
   * Se encarga de identificar la ruta actual y mantenerse escuchando
   * cambios de navegación para actualizar la pestaña activa.
   */
  ngOnInit(): void {

    // Se analiza la URL actual y se determina cuál tab debe aparecer seleccionado.
    this.actualizarTabActiva(this.router.url);

    // Se crea una suscripción a los eventos del Router.
    this.router.events

      // Solo se procesarán eventos del tipo NavigationEnd.
      .pipe(filter((event) => event instanceof NavigationEnd))

      // Cada vez que finalice una navegación se actualizará la pestaña activa.
      .subscribe((event) => {

        // Se obtiene la URL final y se envía al método encargado de determinar el tab activo.
        this.actualizarTabActiva(
          (event as NavigationEnd).urlAfterRedirects
        );
      });
  }

  /**
   * Método encargado de cambiar la pestaña activa y navegar hacia
   * la ruta asociada al tab seleccionado.
   */
  setActiveTab(tabName: string): void {

    // Se obtiene la ruta asociada al nombre del tab recibido.
    const ruta = this.rutas[tabName];

    // Se verifica que exista una ruta asociada.
    if (ruta) {

      // Se actualiza la pestaña activa.
      this.activeTab = tabName;

      // Se intenta navegar hacia la ruta correspondiente.
      this.router.navigate([ruta]).catch(err => {

        // Si ocurre un error se muestra en consola.
        console.error(
          'Error al navegar: Asegúrate de que la ruta exista en app.routes.ts',
          err
        );
      });

    } else {

      // Si no existe una ruta asociada, solo se actualiza visualmente el tab.
      this.activeTab = tabName;
    }

    // Se emite un evento para notificar al componente padre del cambio realizado.
    this.tabChanged.emit(tabName);
  }

  /**
   * Método privado encargado de determinar cuál pestaña debe aparecer activa
   * comparando la URL actual con las rutas conocidas.
   */
  private actualizarTabActiva(url: string): void {

    // Si la URL corresponde al perfil, se activa la pestaña perfil.
    if (url.includes('/perfil')) {
      this.activeTab = 'perfil';
      return;
    }

    // Si la URL corresponde a las recetas del usuario, se activa dicha pestaña.
    if (url.includes('/mis_recetas')) {
      this.activeTab = 'mis_recetas';
      return;
    }

    // Si la URL corresponde a explorar, se activa la pestaña inicio.
    if (url.includes('/explorar')) {
      this.activeTab = 'inicio';
      return;
    }

    // Si la URL corresponde a la pantalla de publicación o edición de recetas,
    // se activa la pestaña publicar.
    if (url.includes('/editar-receta')) {
      this.activeTab = 'publicar';
      return;
    }

    // Si la URL corresponde a la pantalla de búsqueda,
    // se activa la pestaña buscar.
    if (url.includes('/buscar')) {
      this.activeTab = 'buscar';
      return;
    }
  }
}