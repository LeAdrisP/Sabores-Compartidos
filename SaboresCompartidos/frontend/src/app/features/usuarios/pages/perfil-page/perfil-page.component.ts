import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-page.component.html',
  styleUrls: ['./perfil-page.component.scss']
})
export class PerfilPageComponent {
  private router = inject(Router);

  cerrarSesion(): void {
    this.router.navigate(['/login']);
  }

  navigateToEditarPerfil(): void {
    this.router.navigate(['/editar-perfil']);
  }
}
