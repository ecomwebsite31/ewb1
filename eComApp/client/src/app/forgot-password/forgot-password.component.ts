// forgot-password.component.ts

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  username: string = '';
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  otpReceived: boolean = false;
  message: string = '';
  otp!: string;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {

  }

  requestOTP() {
    this.apiService.forgotPassword(this.username).subscribe(
      (response) => {
        console.log('OTP requested successfully:', response);
        this.message = '';
        this.otp = response.otp;
        this.otpReceived = true
        this.token = response.token
      },

      (error) => {
        this.message = error.error.message
        console.error('Error requesting OTP:', error);
      }
    );
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      console.error('Passwords do not match.');
      return;
    }

    this.apiService.changePassword({ token: this.token, username: this.username, newPassword: this.newPassword }).subscribe(
      (response) => {
        console.log('Password changed successfully:', response);
        // Handle success (e.g., redirect to login page)
        this.message = '';
        this.router.navigate(['/login'])
      },
      (error) => {
        this.message = error.error.message
        console.error('Error changing password:', error);
        // Handle error (e.g., show error message)
      }
    );
  }

  retry() {
    this.otpReceived = false,
      this.otp = '';
    this.username = '';
    this.newPassword = '';
  }
  reload() {
    window.location.reload();
  }
}
