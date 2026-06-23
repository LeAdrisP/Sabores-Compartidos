// Se importan las herramientas necesarias desde Angular.
// ApplicationConfig permite definir la configuración global de la aplicación.
// provideBrowserGlobalErrorListeners registra manejadores para capturar errores globales.
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

// Se importan las funciones relacionadas con el sistema de rutas.
// provideRouter registra las rutas de la aplicación.
// withRouterConfig permite personalizar el comportamiento del enrutador.
// withComponentInputBinding habilita la asignación automática de parámetros a propiedades de componentes.
import {
  provideRouter,
  withRouterConfig,
  withComponentInputBinding
} from '@angular/router';

// Se importa el proveedor encargado de habilitar el servicio HttpClient
// para realizar peticiones HTTP.
import { provideHttpClient } from '@angular/common/http';

// Se importan las rutas definidas en app.routes.ts.
import { routes } from './app.routes';

/**
 * Objeto que contiene la configuración principal de la aplicación.
 * Aquí se registran todos los proveedores globales que estarán disponibles
 * en cualquier componente o servicio.
 */
export const appConfig: ApplicationConfig = {

  // Arreglo que almacena todos los proveedores globales.
  providers: [

    /**
     * Registra escuchadores globales para capturar errores que puedan ocurrir
     * durante la ejecución de la aplicación.
     * Esto facilita la detección y manejo de excepciones inesperadas.
     */
    provideBrowserGlobalErrorListeners(),

    /**
     * Configura el sistema de rutas de Angular utilizando las rutas definidas
     * en app.routes.ts.
     */
    provideRouter(

      // Se registran todas las rutas de la aplicación.
      routes,

      /**
       * Configuración adicional del Router.
       * paramsInheritanceStrategy: 'always' permite que los parámetros de una ruta
       * padre sean heredados automáticamente por las rutas hijas.
       */
      withRouterConfig({
        paramsInheritanceStrategy: 'always'
      }),

      /**
       * Permite que los parámetros recibidos por las rutas se asignen
       * automáticamente a propiedades @Input() de los componentes.
       */
      withComponentInputBinding()
    ),

    /**
     * Registra HttpClient como proveedor global.
     * Esto permite realizar peticiones HTTP desde cualquier componente o servicio.
     */
    provideHttpClient()
  ]
};