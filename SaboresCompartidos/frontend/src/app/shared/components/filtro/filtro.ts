import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

interface momento {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-filtro',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './filtro.html',
  styleUrl: './filtro.scss',
})

export class Filtro {
  momentos: momento[] = [
    {value: 'desayuno', viewValue: 'Desayuno'},
    {value: 'colacion-mat', viewValue: 'Colación matutina'},
    {value: 'comida', viewValue: 'Comida'},
    {value: 'merienda', viewValue: 'Merienda'},
    {value: 'cena', viewValue: 'Cena'},
  ];
}