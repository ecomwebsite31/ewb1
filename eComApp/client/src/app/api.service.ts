// src/app/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from './api.constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = API_BASE_URL;

  constructor(private http: HttpClient) { }

  register(user: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}${API_ENDPOINTS.REGISTER}`, user);
  }

  login(user: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}${API_ENDPOINTS.LOGIN}`, user);
  }

  changePassword(data: { username: string; token: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}${API_ENDPOINTS.CHANGE_PASSWORD}`, data);
  }

  forgotPassword(username: string): Observable<any> {
    return this.http.post(`${this.baseUrl}${API_ENDPOINTS.FORGOT_PASSWORD}`, { username, });
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}${API_ENDPOINTS.PRODUCTS}`);
  }

  addToCart(data: { username: string; productId: string; quantity: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}${API_ENDPOINTS.ADD_TO_CART}`, data);
  }

  checkout(username: string, cartItem: any, paymentOption: string, address: string): Observable<any> {
    return this.http.post(`${this.baseUrl}${API_ENDPOINTS.CHECKOUT}`, { username, cartItem, paymentOption, address });
  }
}
