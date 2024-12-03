import { Component, computed, effect, signal } from '@angular/core';
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
export class SignalComponent {
  public products = signal<Product[]>([
    { id: 1, name: 'Laptop', price: 1200, category: 'Electronics' },
    { id: 2, name: 'Phone', price: 800, category: 'Electronics' },
    { id: 3, name: 'Shoes', price: 150, category: 'Fashion' },
    { id: 4, name: 'Watch', price: 200, category: 'Fashion' },
  ]).asReadonly();

  public cart = signal<Product[]>([]);

  public currentFilter = signal<string>('All');
  public filters = signal<string[]>(['All', 'Electronics', 'Fashion']);

  public total = computed(() => {
    let total = 0;
    this.cart().forEach((p) => {
      total += p.price;
    });
    return total;
  });

  public filteredProducts = computed(() => {
    const filter = this.currentFilter();
    if (filter === 'All') {
      return this.products();
    }

    return this.products().filter((p) => p.category === filter);
  });

  constructor() {
    // erreur de compilation car n'est pas un WritableSignal
    // this.products.set([]);
    // this.products.update(() => []);
    effect(() => {
      console.log(
        'Appel vers une api pour enregistrer les données de notre panier :',
        this.cart()
      );
    });
  }

  public addToCart(product: Product): void {
    this.cart.update((cart) => [...cart, product]);
  }

  public removeToCart(index: number): void {
    const cart = [...this.cart()];
    cart.splice(index, 1);
    this.cart.update(() => cart);
  }
}
