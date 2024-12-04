import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/products.model';
import { E_FILTER } from '../models/filters.enum';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  loadProducts(): Observable<Product[]> {
    return of([
      { id: 1, name: 'Laptop', price: 1200, category: E_FILTER.ELECTRONICS },
      { id: 2, name: 'Phone', price: 800, category: E_FILTER.ELECTRONICS },
      { id: 3, name: 'Shoes', price: 150, category: E_FILTER.FASHION },
      { id: 4, name: 'Watch', price: 200, category: E_FILTER.FASHION },
    ]);
  }

  loadFilters(): Observable<E_FILTER[]> {
    return of([E_FILTER.ALL, E_FILTER.ELECTRONICS, E_FILTER.FASHION]);
  }

  saveCart(cart: Product[]): Observable<void> {
    console.log('Enregistrement des produits dans mon panier', cart);
    return of();
  }
}
