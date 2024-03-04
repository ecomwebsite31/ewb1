// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user = {
    username: '',
    password: ''
  };
  message: any;

  constructor(private apiService: ApiService, private userService: UserService, private router: Router) { }

  login() {
    this.apiService.login(this.user).subscribe(
      (response) => {
        console.log('Login successful:', response);
        // Save user details in UserService
        this.userService.setCurrentUser(this.user.username);
        // Redirect to the products page
        this.router.navigate(['/products']);
        this.message = null
      },
      (error) => {
        console.error('Login failed:', error);
        // Handle error (e.g., show error message)
        this.message = error.error.message
      }
    );
  }
}
