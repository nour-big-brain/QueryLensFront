import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private readonly router: Router = inject(Router);
  private readonly authService: AuthService = inject(AuthService);
  private destroy$ = new Subject<void>();
  
  user: User | null = null;

  ngOnInit(): void {
    // Get current user
    this.user = this.authService.getCurrentUser();
    console.log('🔍 Initial user:', this.user);
    
    // Subscribe to user changes so component updates when user data changes
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(updatedUser => {
        this.user = updatedUser;
        console.log('✅ User profile updated:', this.user);
      });
  }

  onUpdateCredentials() {
    this.router.navigate(['/user-update']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}