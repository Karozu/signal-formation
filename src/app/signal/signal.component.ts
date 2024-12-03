import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Product {
  id: number;
  price: number;
  category: string;
  name: string;
}

@Component({
  selector: 'app-signal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signal.component.html',
  styleUrl: './signal.component.scss',
})
export class SignalComponent {}
