// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ProductCatalogComponent } from './product-catalog/product-catalog.component';
import { AddToCartComponent } from './add-to-cart/add-to-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AuthGuard } from './auth.guard';
import { AuthenticateGuard } from './auth/authenticate.guard';
import { AuthorizeGuard } from './auth/authorize.guard';

const routes: Routes = [
  { path: 'register', component: RegistrationComponent, canActivate: [AuthenticateGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthenticateGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [AuthenticateGuard] },
  { path: 'products', component: ProductCatalogComponent },
  { path: 'add-to-cart', component: AddToCartComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
