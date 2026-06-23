// Se importa el tipo Routes desde Angular Router.
// Este tipo permite definir todas las rutas de navegación de la aplicación.
import { Routes } from '@angular/router';

/**
 * Arreglo principal que contiene todas las rutas disponibles de la aplicación.
 * Cada objeto representa una pantalla y especifica el componente que será cargado
 * cuando el usuario navegue a una determinada URL.
 *
 * Se utiliza lazy loading mediante loadComponent para mejorar el rendimiento,
 * cargando cada pantalla únicamente cuando sea necesaria.
 */
export const routes: Routes = [

  {
    // Ruta raíz de la aplicación.
    // Cuando el usuario entra sin especificar una ruta,
    // será redirigido automáticamente a la pantalla de login.
    path: '',

    // Ruta destino de la redirección.
    redirectTo: 'login',

    // La coincidencia debe ser exacta.
    pathMatch: 'full'
  },

  {
    // Ruta correspondiente a la pantalla de inicio de sesión.
    path: 'login',

    // Carga dinámica del componente LoginPageComponent.
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page.component')
        .then(m => m.LoginPageComponent)
  },

  {
    // Ruta del feed principal donde se muestran las recetas de la comunidad.
    path: 'explorar',

    // Carga dinámica del componente Explorar.
    loadComponent: () =>
      import('./features/explorar/pages/explorar/explorar')
        .then(m => m.Explorar)
  },

  {
    // Ruta correspondiente al perfil del usuario autenticado.
    path: 'perfil',

    // Carga dinámica del componente PerfilPageComponent.
    loadComponent: () =>
      import('./features/usuarios/pages/perfil-page/perfil-page.component')
        .then(m => m.PerfilPageComponent)
  },

  {
    // Ruta utilizada para recuperar la contraseña.
    path: 'recuperar',

    // Carga dinámica del componente RecuperarPageComponent.
    loadComponent: () =>
      import('./features/auth/pages/recuperar-page/recuperar-page.component')
        .then(m => m.RecuperarPageComponent)
  },

  {
    // Ruta correspondiente al registro de nuevos usuarios.
    path: 'registro',

    // Carga dinámica del componente RegistroPageComponent.
    loadComponent: () =>
      import('./features/auth/pages/registro-page/registro-page.component')
        .then(m => m.RegistroPageComponent)
  },

  {
    // Ruta para editar la información del perfil del usuario.
    path: 'editar-perfil',

    // Carga dinámica del componente EditarPerfilPageComponent.
    loadComponent: () =>
      import('./features/usuarios/pages/editar-perfil-page/editar-perfil-page.component')
        .then(m => m.EditarPerfilPageComponent)
  },

  {
    // Ruta donde se muestran las recetas pertenecientes al usuario.
    path: 'mis_recetas',

    // Carga dinámica del componente MisRecetasPageComponent.
    loadComponent: () =>
      import('./features/recetas/pages/mis-recetas-page/mis-recetas-page.component')
        .then(m => m.MisRecetasPageComponent)
  },

  {
    // Ruta utilizada para mostrar el detalle completo de una receta.
    // El parámetro :id permite identificar qué receta se desea visualizar.
    path: 'detalle-receta/:id',

    // Carga dinámica del componente DetallePageComponent.
    loadComponent: () =>
      import('./shared/components/detalle-page/detalle-page.component')
        .then(m => m.DetallePageComponent)
  },

  {
    // Ruta de la sección de comentarios de una receta.
    path: 'comentarios-page',

    // Carga dinámica del componente ComentariosPageComponent.
    loadComponent: () =>
      import('./shared/components/comentarios/comentarios-page.component')
        .then(m => m.ComentariosPageComponent)
  },

  {
    // Ruta utilizada para crear o editar una receta.
    path: 'editar-receta',

    // Carga dinámica del componente EditarReceta.
    loadComponent: () =>
      import('./features/recetas/pages/editar-receta/editar-receta')
        .then(m => m.EditarReceta)
  },

  {
    // Ruta correspondiente a la pantalla de búsqueda de recetas.
    path: 'buscar',

    // Carga dinámica del componente BuscarPageComponent.
    loadComponent: () =>
      import('./features/recetas/pages/buscar-page/buscar-page.component')
        .then(m => m.BuscarPageComponent)
  },
];