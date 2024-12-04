import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models/products.model';
import { ProductsService } from '../services/products.service';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { E_FILTER } from '../models/filters.enum';

@Component({
  selector: 'app-signal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signal.component.html',
  styleUrl: './signal.component.scss',
})
export class SignalComponent implements OnInit {
  public products = signal<Product[]>([]);
  public cart = signal<Product[]>([]);
  public currentFilter = signal(E_FILTER.ALL);
  public filters = signal<E_FILTER[]>([]);

  public total = computed(() =>
    this.cart().reduce((total, product) => total + product.price, 0)
  );

  public filteredProducts = computed(() => {
    const filter = this.currentFilter();
    if (filter === E_FILTER.ALL) {
      return this.products();
    }

    return this.products().filter((p) => p.category === filter);
  });

  private readonly _destroyRef = inject(DestroyRef);
  private readonly productsService = inject(ProductsService);

  constructor() {
    effect(() => {
      this.productsService.saveCart(this.cart());
    });
  }

  ngOnInit() {
    this.productsService
      .loadProducts()
      .pipe(
        tap((products) => this.products.set(products)),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();

    this.productsService
      .loadFilters()
      .pipe(
        tap((filters) => this.filters.set(filters)),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();
  }

  public addToCart(product: Product): void {
    this.cart.update((cart) => [...cart, product]);
  }

  public removeFromCart(index: number): void {
    this.cart.update((cart) => {
      const result = [...cart];
      result.splice(index, 1);
      return result;
    });
  }
}
