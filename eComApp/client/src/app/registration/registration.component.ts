// src/app/registration/registration.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  user = {
    username: '',
    password: ''
  };
  errorMessage: string = ''; // Variable to store error messages

  constructor(private apiService: ApiService, private router: Router, private userService: UserService) { }

  register() {
    this.apiService.register(this.user).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        // Redirect to the catalog page after successful registration
        alert("Registration Successfull");
        this.userService.setCurrentUser(this.user.username);
        // Redirect to the products page
        setTimeout(() => {
            
        }, 1000)
        
      },
      (error) => {
        console.error('Registration failed:', error);
        // Display an error message to the user
        this.errorMessage = error.error.message;
      }
    );
  }
}
