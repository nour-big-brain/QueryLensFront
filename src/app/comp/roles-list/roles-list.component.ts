import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { compileNgModule } from '@angular/compiler';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.css']
})
export class RolesListComponent implements OnInit {
  roles: any[] = [];

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  private loadRoles(): void {
    this.roleService.getRoles().subscribe(
      (data) => {
        this.roles = data;
        console.log('data:', data);
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }
  suppressRole(roleId: string): void {
    const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer ce rôle ?");
    if (confirmDelete) {
      this.roleService.deleteRole(roleId).subscribe(
        () => {
          alert('Rôle supprimé avec succès !');
          this.loadRoles();
        },
        (error) => {
          console.error('Error deleting role:', error);
          alert("Une erreur est survenue lors de la suppression du rôle.");
        }
      );
    }
  }
}
