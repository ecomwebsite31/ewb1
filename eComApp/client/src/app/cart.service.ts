// src/app/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();

  addToCart(item: any) {
    const currentCart = this.cartSubject.value;
    this.cartSubject.next([...currentCart, item]);
  }

  getCartItems() {
    return this.cartSubject.value;
  }

  clearCart() {
    this.cartSubject.next([]);
  }

  removeFromCart(item: any) {
    const currentCart = this.cartSubject.value;
    const updatedCart = currentCart.filter(cartItem => cartItem.id !== item.id);
    this.cartSubject.next(updatedCart);
  }

}
