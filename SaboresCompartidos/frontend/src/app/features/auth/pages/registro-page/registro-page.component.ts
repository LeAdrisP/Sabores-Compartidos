// Se importan las herramientas principales desde Angular.
// Component permite crear un componente.
// inject permite obtener servicios sin utilizar un constructor.
// signal permite crear variables reactivas cuyos cambios se reflejan automáticamente en la interfaz.
import { Component, inject, signal } from '@angular/core';

// Se importa CommonModule para poder utilizar directivas comunes como *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// Router permite navegar entre las diferentes páginas de la aplicación.
import { Router } from '@angular/router';

// FormsModule permite trabajar con formularios y capturar datos ingresados por el usuario.
import { FormsModule } from '@angular/forms';

// HttpClient permite realizar peticiones HTTP al backend.
// HttpHeaders permite agregar encabezados personalizados a dichas peticiones.
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Decorador que define la configuración del componente.
@Component({

  // Nombre con el que este componente puede ser utilizado.
  selector: 'app-registro-page',

  // Indica que el componente es independiente y no requiere formar parte de un módulo.
  standalone: true,

  // Módulos necesarios para el funcionamiento del componente.
  imports: [CommonModule, FormsModule],

  // Archivo HTML asociado al componente.
  templateUrl: './registro-page.component.html',

  // Archivo de estilos asociado al componente.
  styleUrls: ['./registro-page.component.scss']
})
export class RegistroPageComponent {

  // Se obtiene una instancia del servicio Router para poder navegar entre páginas.
  private router = inject(Router);

  // Se obtiene una instancia del servicio HttpClient para enviar solicitudes al backend.
  private http = inject(HttpClient);

  // URL base del servidor donde se encuentra la API.
  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';

  // Signal que almacena el correo electrónico ingresado por el usuario.
  correo = signal('');

  // Signal que almacena la contraseña ingresada por el usuario.
  contrasena = signal('');

  // Signal que almacena la confirmación de la contraseña.
  // Su función es verificar que ambas contraseñas sean iguales.
  confirmar_contrasena = signal('');

  // Signal que almacena el estado del checkbox "Mantener sesión iniciada".
  isRemembered = signal(false);

  // Signal encargado de almacenar mensajes de error para mostrarlos en la interfaz.
  errorMessage = signal('');

  /** Alterna el estado del checkbox "Mantener sesión iniciada" */
  toggleRemember(): void {

    // Obtiene el valor actual del checkbox y lo invierte.
    // Si estaba en true pasará a false y viceversa.
    this.isRemembered.set(!this.isRemembered());
  }

  /**
   * Método encargado de validar la información del formulario
   * y enviar los datos al backend para registrar un nuevo usuario.
   */
  onRegisterSubmit(): void {

    // Se elimina cualquier mensaje de error anterior.
    this.errorMessage.set('');

    // Se verifica que todos los campos hayan sido llenados.
    if (!this.correo() || !this.contrasena() || !this.confirmar_contrasena()) {

      // Si algún campo está vacío, se muestra un mensaje de error.
      this.errorMessage.set('Por favor, llena todos los campos.');

      // Se detiene la ejecución del método.
      return;
    }

    // Se verifica que la contraseña y su confirmación sean iguales.
    if (this.contrasena() !== this.confirmar_contrasena()) {

      // Si son diferentes, se informa al usuario.
      this.errorMessage.set('Las contraseñas no coinciden.');

      // Se detiene la ejecución del método.
      return;
    }

    // Se crea el cuerpo de la petición con los datos que serán enviados al backend.
    const body = {

      // Correo del nuevo usuario.
      correo: this.correo(),

      // Contraseña ingresada.
      contrasena: this.contrasena(),

      // Confirmación de la contraseña.
      confirmar_contrasena: this.confirmar_contrasena()
    };

    // Se crea un encabezado personalizado para evitar advertencias de ngrok.
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    // Se realiza una petición POST al endpoint encargado de registrar usuarios.
    this.http.post(`${this.API_URL}api/auth/registro`, body, { headers }).subscribe({

      // Esta función se ejecuta cuando el servidor responde correctamente.
      next: (response: any) => {

        // Se guarda el identificador del usuario en localStorage.
        // Esto permite conservar la información incluso al cerrar la aplicación.
        localStorage.setItem('usuario_id', response.usuario_id);

        // También se almacena el correo del usuario.
        localStorage.setItem('correo', this.correo());

        // Una vez completado el registro, se redirige al usuario hacia la pantalla de login.
        this.router.navigate(['/login']);
      },

      // Esta función se ejecuta cuando ocurre un error durante la petición.
      error: (err) => {

        // Se muestra el mensaje de error recibido desde el backend.
        // Si el servidor no envía un mensaje específico, se utiliza uno predeterminado.
        this.errorMessage.set(
          err.error?.detail || 'Hubo un problema al conectar con el servidor.'
        );
      }
    });
  }

  /** Método encargado de cancelar el registro y regresar al login */
  volverAlLogin(): void {

    // Se navega hacia la pantalla de inicio de sesión.
    this.router.navigate(['/login']);
  }
}