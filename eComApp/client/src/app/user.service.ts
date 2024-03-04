// src/app/user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: any = null;

  getCurrentUser() {
    return localStorage.getItem('currentUser');
  }

  setCurrentUser(email: string) {
    this.currentUser = email;
    localStorage.setItem('currentUser', email);
  }

  clearCurrentUser() {
    this.currentUser = '';
  }
}
