// Se importa el decorador Component desde Angular.
// Este decorador permite definir la configuración y características de un componente.
import { Component } from '@angular/core';

// Se importa el componente Filtro ubicado en la carpeta compartida.
// Este componente podría utilizarse para aplicar filtros sobre información,
// aunque actualmente no está siendo utilizado dentro de este componente.
import { Filtro } from '../../../../shared/components/filtro/filtro';

// Se importa el componente FormReceta.
// Este componente contiene el formulario encargado de mostrar y editar la información de una receta.
import { FormReceta } from '../../../../shared/components/form-receta/form-receta';

// Decorador que define las propiedades y configuración del componente.
@Component({

  // Nombre con el cual este componente puede ser utilizado dentro de otras plantillas HTML.
  selector: 'app-editar-receta',

  // Componentes necesarios para que este componente funcione correctamente.
  // En este caso se utiliza FormReceta, que contiene el formulario de edición.
  imports: [FormReceta],

  // Archivo HTML asociado al componente.
  // En él se encuentra la estructura visual de la página de edición.
  templateUrl: './editar-receta.html',

  // Archivo SCSS asociado al componente.
  // Aquí se definen los estilos visuales de la página.
  styleUrl: './editar-receta.scss',
})

// Clase principal del componente.
// Actualmente no contiene propiedades ni métodos,
// ya que toda la lógica probablemente se encuentra en el componente FormReceta.
export class EditarReceta {}