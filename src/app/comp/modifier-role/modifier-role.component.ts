import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modifier-role',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modifier-role.component.html',
  styleUrl: './modifier-role.component.css'
})
export class ModifierRoleComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private readonly roleService: RoleService = inject(RoleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  AddForm!: FormGroup;

  ngOnInit(): void {
    this.AddForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      permissions: this.fb.array([])
    });

    this.roleService.getRoleById(this.route.snapshot.params['id']).subscribe(role => {
      this.AddForm.patchValue({
        name: role.name,
        description: role.description
      });
      const perms = this.AddForm.get('permissions') as FormArray;
      role.permissions.forEach((perm: string) => perms.push(this.fb.control(perm, Validators.required)));
      if (perms.length === 0) perms.push(this.fb.control('', Validators.required));
    });
  }

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
    const updatedData = {
      name: this.AddForm.get('name')?.value,
      description: this.AddForm.get('description')?.value,
      permissions: this.permissions.value.filter((p: string) => p.trim() !== '')
    };

    this.roleService.updateRole(this.route.snapshot.params['id'], updatedData).subscribe(
      () => {
        alert('Rôle modifié avec succès !');
        this.router.navigate(['../roles']);
      },
      err => {
        console.error(err);
        alert("Une erreur est survenue lors de la modification du rôle.");
      }
    );
  }

  Retour() {
    if (confirm("Annuler la modification du rôle ?")) {
      this.router.navigate(['../roles']);
    }
  }
}
