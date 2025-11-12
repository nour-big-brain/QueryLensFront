import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { User } from '../../models/user';
import { NgClass, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Role {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgClass, CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  roles: Role[] = [];
  loading = false;
  error = '';
  successMessage = '';
  actionInProgress: string | null = null;
  searchTerm = '';
  
  // Role assignment modal
  showRoleModal = false;
  selectedUserForRole: User | null = null;
  selectedRoleId = '';
  assigningRole = false;

  constructor(
    private userService: UserService,
    private roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.filteredUsers = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load users';
        this.loading = false;
      }
    });
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (data: Role[]) => {
        this.roles = data;
      },
      error: (err) => {
        console.error('Failed to load roles:', err);
      }
    });
  }

  filterUsers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = this.users;
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.filteredUsers = this.users;
  }

  deactivateUser(userId: string, username: string): void {
    if (confirm(`Are you sure you want to deactivate ${username}?`)) {
      this.actionInProgress = userId;
      this.userService.deactivateUser(userId).subscribe({
        next: (response) => {
          const user = this.users.find(u => u._id === userId);
          if (user) {
            user.isActive = false;
          }
          this.successMessage = `${username} has been deactivated`;
          this.actionInProgress = null;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.error = err.message || 'Failed to deactivate user';
          this.actionInProgress = null;
        }
      });
    }
  }

  activateUser(userId: string, username: string): void {
    if (confirm(`Are you sure you want to activate ${username}?`)) {
      this.actionInProgress = userId;
      this.userService.activateUser(userId).subscribe({
        next: (response) => {
          const user = this.users.find(u => u._id === userId);
          if (user) {
            user.isActive = true;
          }
          this.successMessage = `${username} has been activated`;
          this.actionInProgress = null;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.error = err.message || 'Failed to activate user';
          this.actionInProgress = null;
        }
      });
    }
  }

  deleteUser(userId: string, username: string): void {
    if (confirm(`Are you sure you want to delete ${username}? This action cannot be undone.`)) {
      this.actionInProgress = userId;
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          const user = this.users.find(u => u._id === userId);
          if (user) {
            user.deletedAt = new Date();
            user.isActive = false;
          }
          this.successMessage = `${username} has been deleted`;
          this.actionInProgress = null;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.error = err.message || 'Failed to delete user';
          this.actionInProgress = null;
        }
      });
    }
  }

  // Role Assignment Methods
  openRoleModal(user: User): void {
    this.selectedUserForRole = user;
    this.selectedRoleId = '';
    this.showRoleModal = true;
  }

  closeRoleModal(): void {
    this.showRoleModal = false;
    this.selectedUserForRole = null;
    this.selectedRoleId = '';
    this.assigningRole = false;
  }

  assignRole(): void {
    if (!this.selectedUserForRole || !this.selectedRoleId.trim()) {
      this.error = 'Please select a role';
      return;
    }

    this.assigningRole = true;
    this.userService.assignRoleToUser(this.selectedUserForRole._id, this.selectedRoleId).subscribe({
      next: (response: any) => {
        const user = this.users.find(u => u._id === this.selectedUserForRole?._id);
        if (user) {
          // Update user with role from response if available
          if (response.user) {
            Object.assign(user, response.user);
          }
        }
        this.successMessage = `Role assigned to ${this.selectedUserForRole?.username}`;
        this.closeRoleModal();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.error = err.message || 'Failed to assign role';
        this.assigningRole = false;
      }
    });
  }

  getStatusClass(user: User): string {
    if (user.deletedAt) return 'deleted';
    if (user.isActive) return 'active';
    return 'inactive';
  }

  getStatusText(user: User): string {
    if (user.deletedAt) {
      return 'Deleted';
    }
    if (user.isActive) {
      return 'Active';
    }
    return 'Inactive';
  }

  getRoleName(roleId: string | null | undefined): string {
    if (!roleId) return 'No Role';
    const role = this.roles.find(r => r._id === roleId);
    return role ? role.name : 'No Role';
  }
}