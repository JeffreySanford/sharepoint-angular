import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListItem, ListItemStatus, Priority, CreateListItemRequest, ListStatus, ListType } from '../interfaces/lists.interface';

export interface ListItemDialogData {
  mode: 'create' | 'edit';
  listId: string;
  item?: ListItem;
}

@Component({
  selector: 'app-list-item-dialog',
  templateUrl: './list-item-dialog.component.html',
  styleUrls: ['./list-item-dialog.component.scss']
})
export class ListItemDialogComponent implements OnInit {
  form: FormGroup;
  isEdit: boolean;

  // Enum references for template
  ListStatus = ListStatus;
  ListItemStatus = ListItemStatus;
  Priority = Priority;
  ListType = ListType;

  // Enum values for dropdowns
  statuses = Object.values(ListItemStatus);
  priorities = Object.values(Priority);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ListItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListItemDialogData
  ) {
    this.isEdit = data.mode === 'edit';
    this.form = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.item) {
      this.populateForm(this.data.item);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      status: [ListItemStatus.TODO, Validators.required],
      priority: [Priority.MEDIUM, Validators.required],
      assignee: [''],
      dueDate: [''],
      estimatedHours: [null, [Validators.min(0)]],
      actualHours: [null, [Validators.min(0)]],
      tags: [''],
      storyPoints: [null, [Validators.min(0), Validators.max(100)]],
      acceptanceCriteria: [''],
      metadata: this.fb.group({
        epic: [''],
        sprint: [''],
        component: [''],
        labels: [''],
        businessValue: [null, [Validators.min(0), Validators.max(10)]],
        riskLevel: ['LOW'],
        dependsOn: [''],
        blockedBy: ['']
      })
    });
  }

  private populateForm(item: ListItem): void {
    this.form.patchValue({
      title: item.title,
      description: item.description,
      status: item.status,
      priority: item.priority,
      assignee: item.assignee || '',
      dueDate: item.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : '',
      estimatedHours: item.estimatedHours,
      actualHours: item.actualHours,
      tags: item.tags.join(', '),
      storyPoints: item.storyPoints,
      acceptanceCriteria: item.acceptanceCriteria || '',
      metadata: {
        epic: item.metadata?.epic || '',
        sprint: item.metadata?.sprint || '',
        component: item.metadata?.component || '',
        labels: item.metadata?.labels ? item.metadata.labels.join(', ') : '',
        businessValue: item.metadata?.businessValue,
        riskLevel: item.metadata?.riskLevel || 'LOW',
        dependsOn: item.metadata?.dependsOn ? item.metadata.dependsOn.join(', ') : '',
        blockedBy: item.metadata?.blockedBy ? item.metadata.blockedBy.join(', ') : ''
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      const itemData: CreateListItemRequest = {
        title: formValue.title,
        description: formValue.description || '',
        status: formValue.status,
        priority: formValue.priority,
        assignee: formValue.assignee || undefined,
        dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined,
        estimatedHours: formValue.estimatedHours || undefined,
        actualHours: formValue.actualHours || undefined,
        tags: formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [],
        storyPoints: formValue.storyPoints || undefined,
        acceptanceCriteria: formValue.acceptanceCriteria || undefined,
        metadata: {
          epic: formValue.metadata.epic || undefined,
          sprint: formValue.metadata.sprint || undefined,
          component: formValue.metadata.component || undefined,
          labels: formValue.metadata.labels ? 
            formValue.metadata.labels.split(',').map((label: string) => label.trim()).filter((label: string) => label) : undefined,
          businessValue: formValue.metadata.businessValue || undefined,
          riskLevel: formValue.metadata.riskLevel || 'LOW',
          dependsOn: formValue.metadata.dependsOn ? 
            formValue.metadata.dependsOn.split(',').map((dep: string) => dep.trim()).filter((dep: string) => dep) : undefined,
          blockedBy: formValue.metadata.blockedBy ? 
            formValue.metadata.blockedBy.split(',').map((block: string) => block.trim()).filter((block: string) => block) : undefined
        }
      };

      this.dialogRef.close(itemData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getStatusDescription(status: ListItemStatus): string {
    switch (status) {
      case ListItemStatus.TODO:
        return 'Ready to be worked on';
      case ListItemStatus.IN_PROGRESS:
        return 'Currently being worked on';
      case ListItemStatus.IN_REVIEW:
        return 'Completed and awaiting review';
      case ListItemStatus.DONE:
        return 'Completed and accepted';
      default:
        return '';
    }
  }

  getPriorityDescription(priority: Priority): string {
    switch (priority) {
      case Priority.CRITICAL:
        return 'Must be completed immediately';
      case Priority.HIGH:
        return 'Important and should be completed soon';
      case Priority.MEDIUM:
        return 'Normal priority';
      case Priority.LOW:
        return 'Can be completed when time allows';
      default:
        return '';
    }
  }

  // Preset configurations for different item types
  applyStoryPreset(): void {
    this.form.patchValue({
      storyPoints: 3,
      acceptanceCriteria: 'Given...\nWhen...\nThen...',
      metadata: {
        ...this.form.value.metadata,
        businessValue: 5
      }
    });
  }

  applyBugPreset(): void {
    this.form.patchValue({
      priority: Priority.HIGH,
      status: ListItemStatus.TODO,
      tags: 'bug',
      acceptanceCriteria: 'Steps to reproduce:\n1.\n2.\n3.\n\nExpected behavior:\n\nActual behavior:'
    });
  }

  applyTaskPreset(): void {
    this.form.patchValue({
      priority: Priority.MEDIUM,
      status: ListItemStatus.TODO,
      storyPoints: 1
    });
  }
}
