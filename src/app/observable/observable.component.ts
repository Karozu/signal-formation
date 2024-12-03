import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface Product {
  id: number;
  price: number;
  category: string;
  name: string;
}

@Component({
  selector: 'app-observable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './observable.component.html',
  styleUrl: './observable.component.scss',
})
export class ObservableComponent {
  private readonly _products$: BehaviorSubject<Product[]> = new BehaviorSubject<
    Product[]
  >([
    { id: 1, name: 'Laptop', price: 1200, category: 'Electronics' },
    { id: 2, name: 'Phone', price: 800, category: 'Electronics' },
    { id: 3, name: 'Shoes', price: 150, category: 'Fashion' },
    { id: 4, name: 'Watch', price: 200, category: 'Fashion' },
  ]);
  private _cart$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(
    []
  );
  private _currentFilter$: BehaviorSubject<string> =
    new BehaviorSubject<string>('All');
  private _filters$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([
    'All',
    'Electronics',
    'Fashion',
  ]);
  private _total$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _filteredProducts$: BehaviorSubject<Product[]> = new BehaviorSubject<
    Product[]
  >([]);

  public cart$: Observable<Product[]> = this._cart$.asObservable();
  public total$: Observable<number> = this._total$.asObservable();
  public filters$: Observable<string[]> = this._filters$.asObservable();
  public filteredProducts$: Observable<Product[]> =
    this._filteredProducts$.asObservable();

  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    // aucune erreur de compilation, ou est la sécurité ?
    // this._products$.next([]);
    this._cart$
      .pipe(
        tap((cart) => {
          let total = 0;
          cart.forEach((p) => {
            total += p.price;
          });
          this._total$.next(total);
        }),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();

    this._currentFilter$
      .pipe(
        tap((filter) => {
          if (filter === 'All') {
            this._filteredProducts$.next(this._products$.value);
            return;
          }

          this._filteredProducts$.next(
            this._products$.value.filter((p) => p.category === filter)
          );
        }),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();

    this._cart$
      .pipe(
        tap((c) => {
          console.log(
            'Appel vers une api pour enregistrer les données de notre panier :',
            c
          );
        }),
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

  public removeToCart(index: number): void {
    const cart = [...this._cart$.value];
    cart.splice(index, 1);
    this._cart$.next(cart);
  }
}
