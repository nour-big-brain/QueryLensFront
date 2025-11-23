import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{

private readonly router:Router=inject(Router);
private authService:AuthService=inject(AuthService);
user!:User | null
  ngOnInit(): void {
    this.user=this.authService.getCurrentUser()
  }
  onUpdateCredentials(){
    this.router.navigate(['/user-update']);
  }

}
