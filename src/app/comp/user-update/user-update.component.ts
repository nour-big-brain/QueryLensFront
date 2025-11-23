import { Component, inject, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

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
  private userService:UserService=inject(UserService);
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
      newPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    let updatedUser={
      username:this.editForm.get("username")?.value,
    }
    if(this.loggedInUser){
      this.userService.updateUser(this.loggedInUser._id,updatedUser.username).subscribe(
        res=>{
          console.log('this is the res',res);
          alert('Credentials succesfully updated');
          this.authService.logout();
        },
        err=>{
          console.log(err);
          alert('An error occurred while updating credentials');
        }
      )
    }
    
  }

  closePasswordModal() {
    this.showPasswordModal = false;
    this.passwordForm.reset();
  }

  onChangePassword() {
  if (this.passwordForm.valid && this.loggedInUser) {
    const { oldPassword, newPassword } = this.passwordForm.value;
    this.userService
      .changePassword(this.loggedInUser._id, oldPassword, newPassword)
      .subscribe(
        res => {
          alert(res.message || 'Password updated successfully!');
          this.authService.logout(); // log out for security, user must log in with new password
          this.closePasswordModal();
        },
        err => {
          alert(err.message || 'Failed to update password');
        }
      );
    }
  }
}
