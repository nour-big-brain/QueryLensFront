import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-build-query',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './build-query.component.html',
  styleUrl: './build-query.component.css'
})
export class BuildQueryComponent {
  buildQueryForm: FormGroup;
  isCreated = false;

  constructor(private fb: FormBuilder) {
    this.buildQueryForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dataSourceId: ['', Validators.required],
      type: ['', Validators.required],
      queryDefinition: ['', Validators.required],
      userId: ['', Validators.required]
    });
  }

  onReset() {
    this.buildQueryForm.reset();
    this.isCreated = false;
    alert("reseted")
  }

  createQuery() {
    if (this.buildQueryForm.valid) {
      console.log(this.buildQueryForm.value);
      this.isCreated = true;
      alert("hello")
    } else {
      this.buildQueryForm.markAllAsTouched();
    }
  }
} 
