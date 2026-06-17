import { Component } from '@angular/core';
import { Filtro } from '../../../../shared/components/filtro/filtro'; 
import { FormReceta } from '../../../../shared/components/form-receta/form-receta'; 

@Component({
  selector: 'app-editar-receta',
  imports: [FormReceta,],
  templateUrl: './editar-receta.html',
  styleUrl: './editar-receta.scss',
})
export class EditarReceta {}
