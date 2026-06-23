// Se importan las herramientas necesarias desde Angular.
// Component permite definir un componente.
// inject permite obtener servicios sin necesidad de utilizar un constructor.
// signal permite crear variables reactivas que actualizan automáticamente la vista.
// OnInit es una interfaz que permite ejecutar código cuando el componente se inicializa.
import { Component, inject, signal, OnInit } from '@angular/core';

// Se importa CommonModule para disponer de directivas básicas como *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// Se importa FormsModule para trabajar con formularios y ngModel.
import { FormsModule } from '@angular/forms';

// Router permite navegar entre las diferentes páginas de la aplicación.
import { Router } from '@angular/router';

// HttpClient permite realizar peticiones HTTP al backend.
// HttpHeaders permite agregar encabezados personalizados a dichas peticiones.
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Decorador que define la configuración del componente.
@Component({
  // Nombre con el que el componente podrá ser utilizado en otras plantillas.
  selector: 'app-recuperar-page',

  // Indica que el componente es independiente y no necesita pertenecer a un módulo.
  standalone: true,

  // Módulos necesarios para el funcionamiento del componente.
  imports: [CommonModule, FormsModule],

  // Archivo HTML asociado al componente.
  templateUrl: './recuperar-page.component.html',

  // Archivo de estilos asociado al componente.
  styleUrls: ['./recuperar-page.component.scss']
})

// La clase implementa la interfaz OnInit para ejecutar lógica al iniciar el componente.
export class RecuperarPageComponent implements OnInit {

  // Se obtiene una instancia del servicio Router para realizar navegación entre páginas.
  private router = inject(Router);

  // Se obtiene una instancia del servicio HttpClient para enviar solicitudes HTTP al backend.
  private http = inject(HttpClient);

  // URL base del servidor donde se encuentra la API.
  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';

  // Signal que almacena el correo ingresado por el usuario.
  correo = signal('');

  // Signal que almacena el código de recuperación.
  codigo = signal('');

  // Signal que almacena la nueva contraseña.
  nuevaContrasena = signal('');

  // Signal que controla en qué etapa del proceso se encuentra el usuario.
  // Puede tener tres valores:
  // "correo" para solicitar el código,
  // "codigo" para verificar el código recibido,
  // "nueva" para establecer una nueva contraseña.
  paso = signal<'correo' | 'codigo' | 'nueva'>('correo');

  // Signal utilizado para mostrar mensajes de error.
  errorMessage = signal('');

  // Signal que almacena el tiempo restante del contador regresivo.
  contador = signal(60);

  // Encabezado personalizado utilizado para evitar advertencias de ngrok.
  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });

  // Este método se ejecuta automáticamente cuando se crea el componente.
  // Su objetivo es limpiar cualquier información anterior para comenzar
  // el proceso de recuperación desde cero.
  ngOnInit(): void {

    // Mensaje mostrado en consola para depuración.
    console.log('Inicializando recuperar-page: Limpiando estados anteriores...');

    // Se establece el primer paso del proceso.
    this.paso.set('correo');

    // Se vacía el correo almacenado.
    this.correo.set('');

    // Se elimina cualquier código almacenado previamente.
    this.codigo.set('');

    // Se elimina cualquier contraseña almacenada anteriormente.
    this.nuevaContrasena.set('');

    // Se eliminan mensajes de error previos.
    this.errorMessage.set('');
  }

  // Método encargado de solicitar al backend el envío del código de recuperación.
  enviarCodigo(): void {

    // Muestra en consola el correo ingresado para fines de depuración.
    console.log('Botón presionado, correo:', this.correo());

    // Se eliminan mensajes de error previos.
    this.errorMessage.set('');

    // Se verifica que el usuario haya ingresado un correo.
    if (!this.correo()) {

      // Si está vacío se muestra un mensaje de error.
      this.errorMessage.set('Por favor ingresa tu correo.');

      // Se detiene la ejecución del método.
      return;
    }

    // Se envía una petición POST al backend con el correo del usuario.
    this.http.post(
      `${this.API_URL}api/auth/recuperar/solicitar`,
      { correo: this.correo() },
      { headers: this.headers }
    ).subscribe({

      // Si el servidor responde correctamente.
      next: () => {

        // Se cambia al paso donde el usuario deberá ingresar el código.
        this.paso.set('codigo');

        // Se inicia el contador regresivo de 60 segundos.
        this.iniciarContador();
      },

      // Si ocurre algún error durante la solicitud.
      error: (err) => {

        // Se muestra el error recibido en consola.
        console.error('Error HTTP:', err);

        // Se muestra el mensaje recibido desde el backend.
        // Si no existe, se muestra un mensaje predeterminado.
        this.errorMessage.set(
          err.error?.detail || 'No se pudo enviar el código.'
        );
      }
    });
  }

  // Método privado encargado de iniciar un contador regresivo de 60 segundos.
  private iniciarContador(): void {

    // El contador comienza desde 60 segundos.
    this.contador.set(60);

    // Se crea un intervalo que se ejecutará cada segundo.
    const intervalo = setInterval(() => {

      // Se disminuye el valor actual del contador en una unidad.
      this.contador.set(this.contador() - 1);

      // Cuando el contador llega a cero se detiene el intervalo.
      if (this.contador() <= 0)
        clearInterval(intervalo);

    }, 1000);
  }

  // Método encargado de recibir los dígitos del código de recuperación.
  confirmarCodigo(digitos: string[]): void {

    // Convierte el arreglo de dígitos en una sola cadena.
    this.codigo.set(digitos.join(''));

    // Se cambia al paso donde se permitirá ingresar la nueva contraseña.
    this.paso.set('nueva');
  }

  // Método encargado de enviar la nueva contraseña al backend.
  restablecerContrasena(): void {

    // Se verifica que el usuario haya escrito una contraseña.
    if (!this.nuevaContrasena()) {

      // Si está vacía se muestra un mensaje de error.
      this.errorMessage.set('Ingresa tu nueva contraseña.');

      // Se detiene la ejecución del método.
      return;
    }

    // Se crea el cuerpo de la petición con la información requerida.
    const body = {

      // Correo del usuario.
      correo: this.correo(),

      // Código de recuperación ingresado.
      codigo: this.codigo(),

      // Nueva contraseña que será almacenada.
      nueva_contrasena: this.nuevaContrasena()
    };

    // Se envía una petición POST al endpoint encargado de cambiar la contraseña.
    this.http.post(
      `${this.API_URL}api/auth/recuperar/restablecer`,
      body,
      { headers: this.headers }
    ).subscribe({

      // Si el cambio fue exitoso.
      next: () => {

        // El usuario es redirigido nuevamente a la pantalla de login.
        this.router.navigate(['/login']);
      },

      // Si ocurre un error durante el proceso.
      error: (err) => {

        // Se muestra el mensaje recibido desde el backend.
        // Si no existe, se utiliza un mensaje predeterminado.
        this.errorMessage.set(
          err.error?.detail || 'Código inválido o expirado.'
        );
      }
    });
  }

  // Método encargado de regresar manualmente a la pantalla de inicio de sesión.
  volverAlLogin(): void {

    // Navega hacia la ruta correspondiente al login.
    this.router.navigate(['/login']);
  }
}