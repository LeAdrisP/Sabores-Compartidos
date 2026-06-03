import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import { MatButtonToggle } from '@angular/material/button-toggle';

@Component({
  selector: 'app-card',
  imports: [MatCardModule, 
            MatButtonModule, 
            MatIconModule, 
            MatChipsModule
          ],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {}