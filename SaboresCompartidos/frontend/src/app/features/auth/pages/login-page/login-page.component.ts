// Se importan las herramientas necesarias desde Angular.
// Component permite definir un componente.
// inject se utiliza para obtener instancias de servicios sin usar constructor.
// signal permite crear variables reactivas que actualizan automáticamente la vista.
import { Component, inject, signal } from '@angular/core';

// Se importa CommonModule para disponer de directivas básicas como *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// Se importa FormsModule para poder trabajar con formularios y el enlace bidireccional con ngModel.
import { FormsModule } from '@angular/forms';

// Router permite cambiar entre páginas y RouterModule habilita las directivas relacionadas con rutas.
import { Router, RouterModule } from '@angular/router';

// HttpClient permite realizar peticiones HTTP al backend.
// HttpHeaders permite agregar encabezados personalizados a las peticiones.
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Decorador que define la configuración del componente.
@Component({
  // Nombre con el que este componente puede ser utilizado en una plantilla HTML.
  selector: 'app-login-page',

  // Indica que este componente es independiente y no necesita pertenecer a un módulo.
  standalone: true,

  // Módulos necesarios para el funcionamiento del componente.
  imports: [CommonModule, FormsModule, RouterModule],

  // Archivo HTML asociado al componente.
  templateUrl: './login-page.component.html',

  // Archivo de estilos asociado al componente.
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  // Se obtiene una instancia del servicio Router para poder navegar entre páginas.
  private router = inject(Router);

  // Se obtiene una instancia del servicio HttpClient para realizar peticiones al backend.
  private http = inject(HttpClient);

  // Dirección base del servidor donde se encuentra la API.
  // Todas las solicitudes al backend utilizarán esta URL como referencia.
  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';

  // Signal que almacena el correo electrónico escrito por el usuario.
  // Su valor inicial es una cadena vacía.
  correo = signal('');

  // Signal que almacena la contraseña ingresada por el usuario.
  contrasena = signal('');

  // Signal que representa el estado del checkbox "Mantener sesión iniciada".
  // Comienza con el valor false.
  isRemembered = signal(false);

  // Signal que almacena mensajes de error para mostrarlos en pantalla.
  errorMessage = signal('');

  /** Alterna el estado del checkbox "Mantener sesión iniciada" */
  toggleRemember(): void {

    // Obtiene el valor actual de isRemembered y lo invierte.
    // Si era true pasa a false y viceversa.
    this.isRemembered.set(!this.isRemembered());
  }

  /**
   * Método encargado de validar los datos del formulario y
   * enviar las credenciales al backend para iniciar sesión.
   */
  onLoginSubmit(): void {

    // Muestra en consola el correo ingresado por el usuario.
    // Esto resulta útil para depurar y verificar que los datos se estén capturando correctamente.
    console.log('Intentando iniciar sesión con:', this.correo());

    // Limpia cualquier mensaje de error previo.
    this.errorMessage.set('');

    // Verifica que ambos campos hayan sido llenados.
    // Si alguno está vacío se muestra un mensaje de error y se detiene la ejecución.
    if (!this.correo() || !this.contrasena()) {
      this.errorMessage.set('Por favor, llena todos los campos.');
      return;
    }

    // Se crea el cuerpo de la petición con los datos que espera el backend.
    const body = {
      correo: this.correo(),
      contrasena: this.contrasena()
    };

    // Se crea un encabezado personalizado para evitar advertencias de ngrok.
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    // Se realiza una petición POST al endpoint de login.
    this.http.post(`${this.API_URL}api/auth/login`, body, { headers }).subscribe({

      // Esta función se ejecuta cuando el servidor responde exitosamente.
      next: (response: any) => {

        // Se muestra la respuesta recibida en consola.
        console.log('Login exitoso', response);

        // Se almacena el identificador del usuario en localStorage.
        // Esto permite conservar información incluso después de cerrar la página.
        localStorage.setItem('usuario_id', response.usuario_id);

        // También se almacena el correo del usuario.
        localStorage.setItem('correo', this.correo());

        // Se redirige al usuario hacia la pantalla de explorar.
        this.router.navigate(['/explorar']);
      },

      // Esta función se ejecuta si ocurre un error en la petición.
      error: () => {

        // Se muestra un mensaje indicando que las credenciales son incorrectas.
        this.errorMessage.set('Correo o contraseña incorrecta.');
      }
    });
  }

  /** Redirige a la pantalla de registro */
  navigateToRegistro(): void {

    // Cambia la ruta actual hacia la página de registro.
    this.router.navigate(['/registro']);
  }

  /** Redirige a la pantalla de recuperación de contraseña */
  navigateToRecuperar(event: Event): void {

    // Evita que el evento continúe propagándose a otros elementos del DOM.
    event.stopPropagation();

    // Cancela el comportamiento predeterminado del elemento que generó el evento.
    event.preventDefault();

    // Mensaje de depuración para confirmar que la navegación fue iniciada.
    console.log('Redirigiendo a la pantalla de recuperación limpiamente...');

    // Se intenta navegar hacia la ruta de recuperación de contraseña.
    this.router.navigate(['/recuperar']).catch(err => {

      // Si ocurre un error durante la navegación, se muestra en consola.
      console.error('Error al intentar navegar a /recuperar:', err);
    });
  }
}