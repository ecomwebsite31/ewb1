// src/app/authentication.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _isAuthenticated = false;
  private _isAdmin = false; // Set to true for demonstration, adjust based on your logic

  login() {
    this._isAuthenticated = true;
  }

  logout() {
    this._isAuthenticated = false;
  }

  isAdmin(): boolean {
    return this._isAdmin;
  }

  isAuthenticated(): boolean {
    return this._isAuthenticated;
  }
}
