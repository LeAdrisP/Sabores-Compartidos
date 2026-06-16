import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => 
      import('./features/auth/pages/login-page/login-page.component')
        .then(m => m.LoginPageComponent)
  },
  {
    path: 'explorar',
    loadComponent: () =>
      import('./features/explorar/pages/explorar/explorar')
        .then(m => m.Explorar)
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./features/usuarios/pages/perfil-page/perfil-page.component')
        .then(m => m.PerfilPageComponent)
  },

  {
    path: 'recuperar',
    loadComponent: () => 
      import('./features/auth/pages/recuperar-page/recuperar-page.component')
        .then(m => m.RecuperarPageComponent)
  },

  {
    path: 'registro',
    loadComponent: () => 
      import('./features/auth/pages/registro-page/registro-page.component')
        .then(m => m.RegistroPageComponent)
  },

  {
  path: 'editar-perfil',
  loadComponent: () => 
    import('./features/usuarios/pages/editar-perfil-page/editar-perfil-page.component')
      .then(m => m.EditarPerfilPageComponent)
  },

  {
    path: 'mis_recetas', // 👈 Tiene que llamarse exactamente igual al mapeo de tu Navbar
    loadComponent: () => 
      import('./features/recetas/pages/mis-recetas-page/mis-recetas-page.component')
        .then(m => m.MisRecetasPageComponent)
  },
  
  {
    path: "editar-receta",
    loadComponent : () =>
      import('./features/recetas/pages/editar-receta/editar-receta')
    .then(m => m.EditarReceta)
  }

];
