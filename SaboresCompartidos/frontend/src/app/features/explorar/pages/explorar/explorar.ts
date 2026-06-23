import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Card, RecetaCard } from "../../../../shared/components/card/card";

@Component({
  selector: 'app-explorar',
  imports: [CommonModule, MatButtonToggleModule, Card],
  templateUrl: './explorar.html',
  styleUrl: './explorar.scss',
})
export class Explorar implements OnInit {
  private http = inject(HttpClient);

  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';
  private headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

  recetas = signal<RecetaCard[]>([]);
  cargando = signal(true);

  /** Carga todas las recetas publicadas desde el backend al iniciar la vista */
  ngOnInit(): void {
    this.cargarRecetas();
  }

  /**
   * Obtiene el feed completo de recetas desde el backend y lo asigna
   * al signal de recetas para que se rendericen como tarjetas.
   */
  cargarRecetas(): void {
    this.cargando.set(true);

    this.http.get<any>(`${this.API_URL}api/recetas/`, { headers: this.headers }).subscribe({
      next: (data) => {
        this.recetas.set(data.recetas || []);
        this.cargando.set(false);
      },
      error: () => {
        console.error('No se pudieron cargar las recetas');
        this.cargando.set(false);
      }
    });
  }
}