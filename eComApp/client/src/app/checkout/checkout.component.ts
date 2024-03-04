// src/app/checkout/checkout.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CartService } from '../cart.service';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  orderPlaced: boolean = false;
  paymentOptions: string[] = ['Card', 'Internet Banking', 'UPI', 'Phone Number'];
  selectedPaymentOption: string = '';
  addressForm: FormGroup;
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  message: any

  constructor(
    private apiService: ApiService,
    private cartService: CartService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService
  ) {
    this.addressForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.cartService.cart$.subscribe(cartItems => {
      this.cartItems = cartItems;
    });
    // Check the authentication status and role on component initialization
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isAdmin = this.authService.isAdmin();
  }

  removeFromCart(item: any) {
    this.cartService.removeFromCart(item);
  }

  getTotalCartValue(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  placeOrder() {
    console.log('Selected Payment Option:', this.selectedPaymentOption);
    console.log('Address Form Valid:', this.addressForm.valid);

    if (this.selectedPaymentOption) {
      const orderDetails = {
        username: this.userService.getCurrentUser() || '',
        paymentOption: this.selectedPaymentOption,
        address: this.addressForm.value,
        cartItems: this.cartItems
      };

      console.log('Order Details:', orderDetails);

      // Call the API to place the order with order details
      this.apiService.checkout(orderDetails.username, orderDetails.cartItems, this.selectedPaymentOption, this.addressForm.value).subscribe(
        () => {
          // Order placed successfully
          this.orderPlaced = true;
          // Clear the cart after placing the order
          this.cartService.clearCart();
          this.message = null
        },
        (error) => {
          console.error('Error placing order:', error);
          this.message = error.error.message;
          // Handle error (e.g., display an error message)
        }
      );
    } else {
      console.error('Invalid payment option or address form. Unable to place the order.');
      // Handle the case where the payment option or address form is invalid
    }
  }

}
