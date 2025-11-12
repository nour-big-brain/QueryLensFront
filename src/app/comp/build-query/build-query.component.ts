import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BuildQueryRequest, QueryService } from '../../services/query.service';

@Component({
  selector: 'app-build-query',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './build-query.component.html',
  styleUrl: './build-query.component.css'
})
export class BuildQueryComponent implements OnInit {
  buildQueryForm: FormGroup;
  isCreated = false;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  createdQuery: any = null;

  constructor(
    private fb: FormBuilder,
    private queryService: QueryService
  ) {
    this.buildQueryForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      dataSource: ['', Validators.required],
      type: ['builder', Validators.required],
      queryDefinition: ['', Validators.required],
      userId: ['', Validators.required]  // ✅ Changed from createdBy to userId
    });
  }

  ngOnInit(): void {}

  createQuery(): void {
    if (this.buildQueryForm.invalid) {
      this.buildQueryForm.markAllAsTouched();
      this.error = 'Please fill in all required fields correctly';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const formValue = this.buildQueryForm.value;
    
    // Parse queryDefinition if it's a string (JSON)
    let queryDefinition = formValue.queryDefinition;
    if (typeof queryDefinition === 'string') {
      try {
        queryDefinition = JSON.parse(queryDefinition);
      } catch (e) {
        this.error = 'Invalid JSON in Query Definition';
        this.loading = false;
        return;
      }
    }

    const buildQueryRequest: BuildQueryRequest = {
      title: formValue.title,
      description: formValue.description,
      dataSource: formValue.dataSource,
      type: formValue.type,
      queryDefinition: queryDefinition,
      userId: formValue.userId  // ✅ Changed from createdBy to userId
    };

    this.queryService.buildQuery(buildQueryRequest).subscribe({
      next: (response) => {
        this.createdQuery = response;
        this.isCreated = true;
        this.success = `Query "${response.title}" created successfully!`;
        this.loading = false;
        
        // Reset form after successful creation
        setTimeout(() => {
          this.buildQueryForm.reset({ type: 'builder' });
          this.isCreated = false;
        }, 3000);
      },
      error: (error) => {
        this.error = error.error?.error || error.error?.details || 'Failed to create query';
        this.loading = false;
        console.error('Error creating query:', error);
      }
    });
  }

  onReset(): void {
    this.buildQueryForm.reset({ type: 'builder' });
    this.isCreated = false;
    this.error = null;
    this.success = null;
    this.createdQuery = null;
  }

  getQueryDefinitionDisplay(): string {
    const queryDef = this.buildQueryForm.get('queryDefinition')?.value;
    if (!queryDef) return '';
    
    try {
      if (typeof queryDef === 'string') {
        return JSON.stringify(JSON.parse(queryDef), null, 2);
      }
      return JSON.stringify(queryDef, null, 2);
    } catch (e) {
      return queryDef;
    }
  }
}