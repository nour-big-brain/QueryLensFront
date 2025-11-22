import { Component, inject, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css'
})
export class UserUpdateComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  loggedInUser!: User | null;
  private fb: FormBuilder = inject(FormBuilder);
  editForm!: FormGroup;
  passwordForm!: FormGroup;
  showPasswordModal = false;

  ngOnInit(): void {
    this.loggedInUser = this.authService.getCurrentUser();
    this.editForm = this.fb.nonNullable.group({
      username: ['', Validators.required]
    });
    if (this.loggedInUser) {
      this.editForm.patchValue({
        username: this.loggedInUser.username,
      });
    }

    this.passwordForm = this.fb.nonNullable.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    // Handle username update
  }

  closePasswordModal() {
    this.showPasswordModal = false;
    this.passwordForm.reset();
  }

  onChangePassword() {
    // Handle password update
    if (this.passwordForm.valid) {
      const { oldPassword, newPassword } = this.passwordForm.value;
      // Call your AuthService method to update password here
      this.closePasswordModal();
    }
  }
}
