// Se importan las herramientas necesarias desde Angular.
// Component permite definir el componente.
// inject permite obtener servicios sin necesidad de utilizar un constructor.
// OnInit permite ejecutar código automáticamente al crear el componente.
// signal permite crear variables reactivas que actualizan automáticamente la interfaz.
import { Component, inject, OnInit, signal } from '@angular/core';

// Se importa CommonModule para disponer de directivas básicas como *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// Se importa FormsModule para trabajar con formularios y capturar información ingresada por el usuario.
import { FormsModule } from '@angular/forms';

// Router permite navegar entre las diferentes páginas de la aplicación.
import { Router } from '@angular/router';

// HttpClient permite realizar peticiones HTTP al backend.
// HttpHeaders permite agregar encabezados personalizados a dichas peticiones.
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Decorador que define la configuración del componente.
@Component({
  // Nombre con el que este componente podrá ser utilizado.
  selector: 'app-editar-perfil-page',

  // Indica que el componente es independiente.
  standalone: true,

  // Módulos necesarios para el funcionamiento del componente.
  imports: [CommonModule, FormsModule],

  // Archivo HTML asociado a este componente.
  templateUrl: './editar-perfil-page.component.html',

  // Archivo de estilos asociado.
  styleUrls: ['./editar-perfil-page.component.scss']
})
export class EditarPerfilPageComponent implements OnInit {

  // Se obtiene una instancia del servicio Router para poder navegar entre páginas.
  private router = inject(Router);

  // Se obtiene una instancia del servicio HttpClient para realizar peticiones al backend.
  private http = inject(HttpClient);

  // URL base del servidor donde se encuentra la API.
  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';

  // Encabezado personalizado para evitar la advertencia mostrada por ngrok.
  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });

  // Signals que almacenan la información básica del perfil del usuario.
  nombre = signal('');
  username = signal('');
  bio = signal('');
  ubicacion = signal('');
  correo = signal('');
  iniciales = signal('');

  // Signal encargado de almacenar el estado del interruptor de sesión activa.
  isSessionActive = signal(true);

  // Signals relacionados con el proceso de cambio de contraseña.
  // Almacenan la contraseña actual, la nueva contraseña y los mensajes de validación.
  contrasenaActual = signal('');
  nuevaContrasena = signal('');
  contrasenaValidada = signal(false);
  mensajeValidacion = signal('');
  errorValidacion = signal('');

  // Signals relacionados con la verificación del correo electrónico.
  codigoCorreoEnviado = signal(false);
  codigoCorreo = signal('');
  mensajeCorreoOk = signal('');
  errorCorreo = signal('');

  /**
   * Método que se ejecuta automáticamente cuando el componente es creado.
   * Se encarga de obtener la información del usuario desde el backend.
   */
  ngOnInit(): void {

    // Se obtiene el identificador del usuario almacenado en localStorage.
    const usuarioId = localStorage.getItem('usuario_id');

    // Si no existe una sesión activa, se redirige al usuario al login.
    if (!usuarioId) {
      this.router.navigate(['/login']);
      return;
    }

    // Se realiza una petición GET para obtener la información del usuario.
    this.http.get(`${this.API_URL}api/usuarios/${usuarioId}`, {
      headers: this.headers
    }).subscribe({

      // Si la respuesta es exitosa, se cargan los datos recibidos.
      next: (data: any) => {

        // Se asignan los valores recibidos a cada signal.
        this.nombre.set(data.nombre || '');
        this.username.set(data.nombre_usuario || '');
        this.bio.set(data.biografia || '');
        this.ubicacion.set(data.ubicacion || '');
        this.correo.set(data.correo || '');

        // Se generan las iniciales del nombre para utilizarlas como avatar.
        this.iniciales.set(this.obtenerIniciales(this.nombre()));
      },

      // Si ocurre un error, se muestra en consola.
      error: () => {
        console.error('No se pudo cargar el perfil');
      }
    });
  }

  /**
   * Genera las iniciales del nombre completo del usuario.
   * Si el nombre está vacío se devuelve "US" por defecto.
   */
  private obtenerIniciales(nombre: string): string {

    // Si no existe un nombre se devuelve "US".
    if (!nombre) return 'US';

    // Se divide el nombre por espacios, se toma la primera letra de cada palabra,
    // se unen todas las letras, se convierten a mayúsculas y se limitan a dos caracteres.
    return nombre
      .split(' ')
      .map(p => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  /**
   * Alterna el estado del interruptor de sesión.
   */
  toggleSession(): void {

    // Cambia el valor actual entre verdadero y falso.
    this.isSessionActive.set(!this.isSessionActive());
  }

  /**
   * Verifica que la contraseña actual sea correcta.
   * Si es válida, se habilita el cambio de contraseña.
   */
  confirmarContrasenaActual(): void {

    // Se obtiene el identificador del usuario.
    const usuarioId = localStorage.getItem('usuario_id');

    // Se verifica que exista una sesión y que se haya escrito una contraseña.
    if (!usuarioId || !this.contrasenaActual()) {

      // Se muestra un mensaje de error.
      this.errorValidacion.set('Ingresa tu contraseña actual.');
      return;
    }

    // Se limpia cualquier error previo.
    this.errorValidacion.set('');

    // Se envía la contraseña actual al backend para validarla.
    this.http.post(
      `${this.API_URL}api/usuarios/${usuarioId}/validar-contrasena`,
      { contrasena: this.contrasenaActual() },
      { headers: this.headers }
    ).subscribe({

      // Si la contraseña es correcta.
      next: () => {

        // Se habilita el cambio de contraseña.
        this.contrasenaValidada.set(true);

        // Se muestra un mensaje de confirmación.
        this.mensajeValidacion.set('Verificación correcta');
      },

      // Si la contraseña es incorrecta.
      error: () => {

        // Se bloquea el cambio de contraseña.
        this.contrasenaValidada.set(false);

        // Se informa del error.
        this.errorValidacion.set('Contraseña incorrecta.');
      }
    });
  }

  /**
   * Envía la nueva contraseña al backend.
   */
  guardarNuevaContrasena(): void {

    const usuarioId = localStorage.getItem('usuario_id');

    // Se verifica que exista una sesión, que la contraseña haya sido validada
    // y que se haya ingresado una nueva contraseña.
    if (!usuarioId || !this.contrasenaValidada() || !this.nuevaContrasena())
      return;

    // Se realiza la petición para actualizar la contraseña.
    this.http.put(
      `${this.API_URL}api/usuarios/${usuarioId}/cambiar-contrasena`,
      { nueva_contrasena: this.nuevaContrasena() },
      { headers: this.headers }
    ).subscribe({

      // Si la operación es exitosa.
      next: () => {

        // Se informa al usuario que la contraseña fue actualizada.
        this.mensajeValidacion.set('Contraseña actualizada con éxito');

        // Se limpian los campos utilizados.
        this.nuevaContrasena.set('');
        this.contrasenaActual.set('');
        this.contrasenaValidada.set(false);
      },

      // Si ocurre un error.
      error: () => {

        // Se muestra un mensaje de error.
        this.errorValidacion.set('No se pudo actualizar la contraseña.');
      }
    });
  }

  /**
   * Guarda los cambios realizados en el perfil.
   */
  guardarPerfil(): void {

    const usuarioId = localStorage.getItem('usuario_id');

    if (!usuarioId) return;

    // Se construye el cuerpo de la petición.
    const body = {
      nombre: this.nombre(),
      nombre_usuario: this.username(),
      biografia: this.bio(),
      ubicacion: this.ubicacion()
    };

    // Se envían los datos actualizados al backend.
    this.http.put(
      `${this.API_URL}api/usuarios/${usuarioId}`,
      body,
      { headers: this.headers }
    ).subscribe({

      // Si los cambios se guardan correctamente.
      next: () => {

        // Se regresa a la pantalla del perfil.
        this.router.navigate(['/perfil']);
      },

      // Si ocurre un error.
      error: (err) => {

        // Se muestra información del error en consola.
        console.error('Error al guardar:', err);
      }
    });
  }

  /**
   * Cancela la edición y regresa al perfil.
   */
  cancelar(): void {

    // Navega nuevamente a la pantalla de perfil.
    this.router.navigate(['/perfil']);
  }

  /**
   * Solicita al backend el envío de un código de verificación por correo.
   */
  enviarCodigoCorreo(): void {

    const usuarioId = localStorage.getItem('usuario_id');

    if (!usuarioId) return;

    // Se limpia cualquier error previo.
    this.errorCorreo.set('');

    // Se solicita el envío del código.
    this.http.post(
      `${this.API_URL}api/usuarios/${usuarioId}/enviar-codigo-correo`,
      {},
      { headers: this.headers }
    ).subscribe({

      // Si el envío es exitoso.
      next: () => {

        // Se habilita el campo para introducir el código.
        this.codigoCorreoEnviado.set(true);

        // Se muestra un mensaje de confirmación.
        this.mensajeCorreoOk.set('Código enviado a tu correo');
      },

      // Si ocurre un error.
      error: () => {

        // Se muestra un mensaje de error.
        this.errorCorreo.set('No se pudo enviar el código.');
      }
    });
  }

  /**
   * Valida el código recibido por correo.
   */
  confirmarCodigoCorreo(): void {

    const usuarioId = localStorage.getItem('usuario_id');

    if (!usuarioId || !this.codigoCorreo()) return;

    // Se limpia cualquier error anterior.
    this.errorCorreo.set('');

    // Se envía el código al backend para validarlo.
    this.http.post(
      `${this.API_URL}api/usuarios/${usuarioId}/validar-codigo-correo`,
      { codigo: this.codigoCorreo() },
      { headers: this.headers }
    ).subscribe({

      // Si el código es correcto.
      next: () => {

        // Se informa al usuario que el correo fue verificado.
        this.mensajeCorreoOk.set('Correo verificado correctamente');

        // Se restablece el estado del formulario.
        this.codigoCorreoEnviado.set(false);
        this.codigoCorreo.set('');
      },

      // Si el código es inválido.
      error: () => {

        // Se informa al usuario del error.
        this.errorCorreo.set('Código inválido o expirado.');
      }
    });
  }
}