import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule} from '@angular/material/button-toggle';
import { Card } from "../../../../shared/components/card/card";
import { Router } from '@angular/router';

@Component({
  selector: 'app-explorar',
  imports: [CommonModule,
            MatButtonToggleModule,
            Card
  ],
  templateUrl: './explorar.html',
  styleUrl: './explorar.scss',
})
export class Explorar implements OnInit{
//Para probar el diseño, luego se eliminará y se reemplazará por datos reales
private router = inject(Router);

  public cards: Array<any> =[]

  ngOnInit(): void {
    this.cards = [
      {title: 'Receta 1', description: 'Descripción de la receta 1'},
      {title: 'Receta 2', description: 'Descripción de la receta 2'},
      {title: 'Receta 3', description: 'Descripción de la receta 3'},
      {title: 'Receta 4', description: 'Descripción de la receta 4'},
      {title: 'Receta 5', description: 'Descripción de la receta 5'},
      {title: 'Receta 6', description: 'Descripción de la receta 6'},
      {title: 'Receta 7', description: 'Descripción de la receta 7'},
      {title: 'Receta 8', description: 'Descripción de la receta 8'},
      {title: 'Receta 9', description: 'Descripción de la receta 9'},
      {title: 'Receta 10', description: 'Descripción de la receta 10'},
      {title: 'Receta 11', description: 'Descripción de la receta 11'},
      {title: 'Receta 12', description: 'Descripción de la receta 12'},
    ]
  }

  verDetalleReceta(): void {
    console.log('Abriendo información detallada de la receta...');
    this.router.navigate(['/detalle-receta']);
  }
}
