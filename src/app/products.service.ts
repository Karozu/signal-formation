import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {Product} from "./models/products.model";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  loadProducts(): Observable<Product[]> {
    return of([
      { id: 1, name: 'Laptop', price: 1200, category: 'Electronics' },
      { id: 2, name: 'Phone', price: 800, category: 'Electronics' },
      { id: 3, name: 'Shoes', price: 150, category: 'Fashion' },
      { id: 4, name: 'Watch', price: 200, category: 'Fashion' },
    ]);
  }

  loadFilters(): Observable<string[]> {
    return of([
      'All',
      'Electronics',
      'Fashion',
    ]);
  }

  saveCart(cart: Product[]): Observable<void> {
    return of();
  }
}
