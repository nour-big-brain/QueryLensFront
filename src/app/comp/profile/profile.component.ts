import { Component, inject, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RoleService } from '../../services/role.service';
import { NgStyle } from '@angular/common';

export interface User {
  username: string;
  email: string;
  isActive: boolean;
  role:String;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  private authService = inject(AuthService);
  private roleService = inject(RoleService);

  public isLoggedIn: boolean = false;
  public user!: any;
  public initial="";
  avatarColors = ['#f44336', '#e91e63', '#9c27b0', '#3f51b5', '#03a9f4', '#009688', '#4caf50', '#ff9800', '#795548'];
  
  ngOnInit(): void {    
    this.loadUser();
  }

  getAvatarColor(username: string): string {
    if (!username) return '#777'; 
    const index = username.charCodeAt(0) % this.avatarColors.length;
    return this.avatarColors[index];
  }

  getRandomColor() {
    return this.avatarColors[Math.floor(Math.random() * this.avatarColors.length)];
  }

  loadUser(){
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.user = currentUser;
      this.initial=currentUser.username[0]; 
    }
      this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.user = user || null;
    });

    this.roleService.getRoleById(currentUser?.roleId).subscribe((role)=>{
      this.user.role = role;
    })
    console.log(this.user);
  }

  updateProfile(){}

}
