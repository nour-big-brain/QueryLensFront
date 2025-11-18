// src/app/auth/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = {
    username: '',
    password: '',
    rememberMe: true
  };

  loading = false;
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (!this.loginForm.username || !this.loginForm.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.login(this.loginForm.username, this.loginForm.password).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Login successful! Redirecting...';
        setTimeout(() => this.router.navigate(['/dashboard']), 1000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Login failed';
      }
    });
  }
}