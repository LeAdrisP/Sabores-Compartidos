import { Component } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Filtro } from '../filtro/filtro';  

@Component({
  selector: 'app-form-receta',
  imports: [MatFormFieldModule, MatInputModule,MatSelectModule, Filtro,],
  templateUrl: './form-receta.html',
  styleUrl: './form-receta.scss',
})
export class FormReceta {}
