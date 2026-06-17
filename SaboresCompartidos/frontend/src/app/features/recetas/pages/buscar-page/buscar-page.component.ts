import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavbarInferiorComponent } from '../../../../layout/navbar-inferior/navbar-inferior.component'; // Ajusta la ruta de tu navbar si varía

@Component({
  selector: 'app-buscar-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar-page.component.html',
  styleUrls: ['./buscar-page.component.scss']
})
export class BuscarPageComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';

  searchText: string = '';
  filtroActivo: string = 'Todas';
  
  recetasOriginales: any[] = [];
  recetasFiltradas: any[] = [];

  ngOnInit(): void {
    this.obtenerRecetas();
  }

  obtenerRecetas(): void {
    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });
    // Usamos tu endpoint existente de recetas
    this.http.get(`${this.API_URL}api/recetas`, { headers }).subscribe({
      next: (data: any) => {
        // Si viene un objeto o arreglo, adáptalo
        this.recetasOriginales = Array.isArray(data) ? data : data.recetas || [];
        this.filtrarRecetas();
        this.cdr.detectChanges();
      },
      error: () => {
        console.error('Error al descargar recetas');
        // Datos quemados de respaldo idénticos a tu captura por si el back no responde
        this.recetasOriginales = [
          { nombre: 'Tlayudas oaxaqueñas', autor: 'Ana García', tiempo: '40 min', dificultad: 'Medio', dias: 'hace 2 días', likes: 34, color: '#FDF3E7' },
          { nombre: 'Ensalada de nopales', autor: 'Juan Perez', tiempo: '20 min', dificultad: 'Fácil', dias: 'hace 6 días', likes: 21, color: '#EAF7EE' },
          { nombre: 'Mole negro', autor: 'María López', tiempo: '180 min', dificultad: 'Difícil', dias: 'hace 12 días', likes: 91, color: '#EFA6A1' },
          { nombre: 'Flan de cajeta', autor: 'Carlos Ruiz', tiempo: '90 min', dificultad: 'Medio', dias: 'hace 1 día', likes: 58, color: '#FDF3E7' },
          { nombre: 'Caldo de res casero', autor: 'Luis Méndez', tiempo: '120 min', dificultad: 'Difícil', dias: 'hace 10 días', likes: 45, color: '#EFA6A1' }
        ];
        this.filtrarRecetas();
        this.cdr.detectChanges();
      }
    });
  }

  filtrarRecetas(): void {
    this.recetasFiltradas = this.recetasOriginales.filter(receta => {
      const cumpleBusqueda = receta.nombre.toLowerCase().includes(this.searchText.toLowerCase());
      const cumpleFiltro = this.filtroActivo === 'Todas' || receta.dificultad === this.filtroActivo;
      return cumpleBusqueda && cumpleFiltro;
    });
  }

  setFiltro(tipo: string): void {
    this.filtroActivo = tipo;
    this.filtrarRecetas();
  }
}