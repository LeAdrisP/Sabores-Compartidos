// Define las rutas de navegación de la aplicación.
import { Routes } from '@angular/router';

/** Rutas principales de la aplicación */
export const routes: Routes = [

  // Redirige la ruta raíz al login.
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Pantalla de inicio de sesión.
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page.component')
        .then(m => m.LoginPageComponent)
  },

  // Feed principal de recetas.
  {
    path: 'explorar',
    loadComponent: () =>
      import('./features/explorar/pages/explorar/explorar')
        .then(m => m.Explorar)
  },

  // Perfil del usuario.
  {
    path: 'perfil',
    loadComponent: () =>
      import('./features/usuarios/pages/perfil-page/perfil-page.component')
        .then(m => m.PerfilPageComponent)
  },

  // Recuperación de contraseña.
  {
    path: 'recuperar',
    loadComponent: () =>
      import('./features/auth/pages/recuperar-page/recuperar-page.component')
        .then(m => m.RecuperarPageComponent)
  },

  // Registro de usuarios.
  {
    path: 'registro',
    loadComponent: () =>
      import('./features/auth/pages/registro-page/registro-page.component')
        .then(m => m.RegistroPageComponent)
  },

  // Edición de perfil.
  {
    path: 'editar-perfil',
    loadComponent: () =>
      import('./features/usuarios/pages/editar-perfil-page/editar-perfil-page.component')
        .then(m => m.EditarPerfilPageComponent)
  },

  // Recetas publicadas por el usuario.
  {
    path: 'mis_recetas',
    loadComponent: () =>
      import('./features/recetas/pages/mis-recetas-page/mis-recetas-page.component')
        .then(m => m.MisRecetasPageComponent)
  },

  // Detalle de una receta seleccionada.
  {
    path: 'detalle-receta',
    loadComponent: () =>
      import('./shared/components/detalle-page/detalle-page.component')
        .then(m => m.DetallePageComponent)
  },

  // Creación y edición de recetas.
  {
    path: 'editar-receta',
    loadComponent: () =>
      import('./features/recetas/pages/editar-receta/editar-receta')
        .then(m => m.EditarReceta)
  },

  // Búsqueda de recetas.
  {
    path: 'buscar',
    loadComponent: () =>
      import('./features/recetas/pages/buscar-page/buscar-page.component')
        .then(m => m.BuscarPageComponent)
  }

];