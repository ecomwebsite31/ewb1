// src/app/product-catalog/product-catalog.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.scss']
})
export class ProductCatalogComponent implements OnInit {
  products: any[] = [];
  quantityOptions: number[] = [1, 2, 3, 4, 5];
  cartItems: any[] = []; // Array to store items in the cart
  cardCount = 0;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cartService: CartService  // Inject CartService
  ) { }


  ngOnInit() {
    this.fetchProducts();
    this.cartService.cart$.subscribe((d) => {
      this.cardCount = d.length;
    })
  }

  fetchProducts() {
    this.apiService.getProducts().subscribe(
      (data) => {
        // Set default selectedQuantity to 1 for each product
        this.products = data.map((product: any) => ({ ...product, selectedQuantity: 1 }));
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  addToCart(product: any) {
    const existingItem = this.cartItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += product.selectedQuantity;
    } else {
      const cartItem = { ...product, quantity: product.selectedQuantity };
      this.cartService.addToCart(cartItem);  // Use CartService to add item to cart
      alert(`${product.selectedQuantity} - ${product.name} added to cart successfully.`)
    }
    product.selectedQuantity = 1;
    this.updateCartCount();
    // this.router.navigate(['/checkout']);
  }

  updateCartCount() {
    // You can update the cart count based on the length of the cartItems array
    const cartCount = this.cartItems.length;

    // Update the cart count as needed (e.g., store it in a variable)
    console.log('Cart Count:', cartCount);
  }

  // src/app/product-catalog/product-catalog.component.ts
  logout() {
    console.log('Logging out...');
    this.cartService.clearCart();  // Clear the cart on logout
    this.router.navigate(['/login']);
  }

  checkout() {
    this.router.navigate(['/checkout'])
  }

}
