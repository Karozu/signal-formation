import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  switchMap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Product } from '../models/products.model';
import { ProductsService } from '../services/products.service';
import { E_FILTER } from '../models/filters.enum';

@Component({
  selector: 'app-observable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './observable.component.html',
  styleUrl: './observable.component.scss',
})
export class ObservableComponent implements OnInit {
  private _cart$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(
    []
  );
  private _currentFilter$: BehaviorSubject<string> =
    new BehaviorSubject<string>(E_FILTER.ALL);

  public cart$: Observable<Product[]> = this._cart$.asObservable();
  public total$?: Observable<number>;
  public filters$?: Observable<string[]>;
  public filteredProducts$?: Observable<Product[]>;

  private readonly _destroyRef = inject(DestroyRef);
  private readonly productsService = inject(ProductsService);

  ngOnInit() {
    this.filters$ = this.productsService.loadFilters();

    this.total$ = this.cart$.pipe(
      map((cart) => cart.reduce((total, product) => total + product.price, 0))
    );

    this.filteredProducts$ = combineLatest([
      this.productsService.loadProducts(),
      this._currentFilter$,
    ]).pipe(
      map(([products, filter]) => {
        if (filter === E_FILTER.ALL) {
          return products;
        }
        return products.filter((p) => p.category === filter);
      })
    );

    this._cart$
      .pipe(
        switchMap((cart) => this.productsService.saveCart(cart)),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();
  }

  public setCurrentFilter(filter: string): void {
    this._currentFilter$.next(filter);
  }

  public addToCart(product: Product): void {
    this._cart$.next([...this._cart$.value, product]);
  }

  public removeFromCart(index: number): void {
    const cart = [...this._cart$.value];
    cart.splice(index, 1);
    this._cart$.next(cart);
  }
}
