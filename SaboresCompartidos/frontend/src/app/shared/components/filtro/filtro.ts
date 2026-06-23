// Se importa el decorador Component para definir el componente.
// FormsModule permite trabajar con formularios y enlazar valores desde la interfaz.
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Se importan módulos de Angular Material utilizados para construir
// los campos y listas desplegables del filtro.
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

/**
 * Interfaz que define la estructura de cada opción del selector.
 * Cada opción posee un valor interno y un texto visible para el usuario.
 */
interface momento {

  // Valor que será utilizado internamente por la aplicación.
  value: string;

  // Texto que aparecerá visible dentro del menú desplegable.
  viewValue: string;
}

// Decorador que define la configuración del componente.
@Component({

  // Nombre con el que el componente puede utilizarse dentro de otras plantillas.
  selector: 'app-filtro',

  // Módulos necesarios para el funcionamiento del componente.
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule
  ],

  // Archivo HTML asociado al componente.
  templateUrl: './filtro.html',

  // Archivo de estilos asociado.
  styleUrl: './filtro.scss',
})

export class Filtro {

  /**
   * Arreglo que contiene las opciones disponibles para el selector.
   * Cada elemento representa un momento del día en el que puede clasificarse una receta.
   */
  momentos: momento[] = [

    // Opción correspondiente al desayuno.
    {
      value: 'desayuno',
      viewValue: 'Desayuno'
    },

    // Opción correspondiente a una colación matutina.
    {
      value: 'colacion-mat',
      viewValue: 'Colación matutina'
    },

    // Opción correspondiente a la comida principal.
    {
      value: 'comida',
      viewValue: 'Comida'
    },

    // Opción correspondiente a la merienda.
    {
      value: 'merienda',
      viewValue: 'Merienda'
    },

    // Opción correspondiente a la cena.
    {
      value: 'cena',
      viewValue: 'Cena'
    },
  ];
}