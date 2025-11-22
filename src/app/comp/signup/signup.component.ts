// src/app/auth/signup/signup.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  };

  loading = false;
  error = '';
  success = '';
  submitted = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSignup() {
    this.submitted = true;

    if (!this.signupForm.username || !this.signupForm.email || !this.signupForm.password) {
      this.error = 'Please fill in all required fields';
      return;
    }

    if (this.signupForm.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    if (this.signupForm.password !== this.signupForm.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (!this.signupForm.agreeTerms) {
      this.error = 'You must agree to the terms';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.register(
      this.signupForm.username,
      this.signupForm.email,
      this.signupForm.password
    ).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Account created successfully! You can now log in.';
         this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Registration failed';
      }
    });
  }

  onReset() {
    this.signupForm = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    };
    this.submitted = false;
  }
}