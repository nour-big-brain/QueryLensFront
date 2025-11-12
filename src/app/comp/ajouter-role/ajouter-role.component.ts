import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajouter-role',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './ajouter-role.component.html',
  styleUrl: './ajouter-role.component.css'
})
export class AjouterRoleComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private readonly roleService: RoleService = inject(RoleService);
  AddForm!: FormGroup;
  private readonly router: Router = inject(Router);

  ngOnInit(): void {
    this.AddForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      permissions: this.fb.array([this.fb.control('', Validators.required)])
    });
  }

  // Accessor
  get permissions(): FormArray {
    return this.AddForm.get('permissions') as FormArray;
  }

  addPermission() {
    this.permissions.push(this.fb.control('', Validators.required));
  }

  removePermission(index: number) {
    this.permissions.removeAt(index);
  }

  onSubmit() {
    const permissionsArray = this.permissions.value.filter((p: string) => p.trim() !== '');

    const addData = {
      name: this.AddForm.get('name')?.value,
      description: this.AddForm.get('description')?.value,
      permissions: permissionsArray
    };

    this.roleService.createRole(addData).subscribe(
      () => {
        alert('Rôle ajouté avec succès !');
        this.router.navigate(['../roles']);
      },
      (err) => {
        if (err.error && err.error.code == 11000) {
          alert('Le nom du rôle doit être unique.');
        } else {
          console.error(err);
          alert("Une erreur est survenue lors de l'ajout du rôle.");
        }
      }
    );
  }

  Retour() {
    if (confirm("Annuler l'ajout du rôle ?")) {
      this.router.navigate(['../roles']);
    }
  }
}
