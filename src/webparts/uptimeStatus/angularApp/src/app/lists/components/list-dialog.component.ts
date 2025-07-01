import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { List, ListType, Priority, CreateListRequest, ListStatus, ListItemStatus, IList, ICreateListDto } from '../interfaces/lists.interface';

export interface ListDialogData {
  mode: 'create' | 'edit';
  list?: List;
}

@Component({
  selector: 'app-list-dialog',
  templateUrl: './list-dialog.component.html',
  styleUrls: ['./list-dialog.component.scss']
})
export class ListDialogComponent implements OnInit {
  form: FormGroup;
  isEdit: boolean;

  // Enum references for template
  ListStatus = ListStatus;
  ListItemStatus = ListItemStatus;
  Priority = Priority;
  ListType = ListType;

  // Enum values for dropdowns
  listTypes = Object.values(ListType);
  listStatuses = Object.values(ListStatus);
  priorities = Object.values(Priority);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListDialogData
  ) {
    this.isEdit = data.mode === 'edit';
    this.form = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.list) {
      this.populateForm(this.data.list);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      type: [ListType.CUSTOM, Validators.required],
      status: [ListStatus.ACTIVE, Validators.required],
      priority: [Priority.MEDIUM, Validators.required],
      dueDate: [''],
      tags: [''],
      metadata: this.fb.group({
        color: ['#1976d2'],
        icon: ['list'],
        isTemplate: [false],
        templateCategory: [''],
        estimatedHours: [null, [Validators.min(0)]],
        sprintNumber: [null, [Validators.min(1)]],
        epicId: [''],
        projectId: [''],
        teamId: ['']
      })
    });
  }

  private populateForm(list: List): void {
    this.form.patchValue({
      title: list.title,
      description: list.description,
      type: list.type,
      status: list.status,
      priority: list.priority,
      dueDate: list.dueDate ? new Date(list.dueDate).toISOString().split('T')[0] : '',
      tags: list.tags.join(', '),
      metadata: {
        color: list.metadata.color || '#1976d2',
        icon: list.metadata.icon || 'list',
        isTemplate: list.metadata.isTemplate || false,
        templateCategory: list.metadata.templateCategory || '',
        estimatedHours: list.metadata.estimatedHours,
        sprintNumber: list.metadata.sprintNumber,
        epicId: list.metadata.epicId || '',
        projectId: list.metadata.projectId || '',
        teamId: list.metadata.teamId || ''
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      const listData: CreateListRequest = {
        title: formValue.title,
        description: formValue.description,
        type: formValue.type,
        color: formValue.metadata?.color || '#1976d2',
        icon: formValue.metadata?.icon || 'list',
        status: formValue.status,
        priority: formValue.priority,
        dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined,
        tags: formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [],
        metadata: {
          ...formValue.metadata,
          estimatedHours: formValue.metadata.estimatedHours || undefined,
          sprintNumber: formValue.metadata.sprintNumber || undefined,
          templateCategory: formValue.metadata.templateCategory || undefined,
          epicId: formValue.metadata.epicId || undefined,
          projectId: formValue.metadata.projectId || undefined,
          teamId: formValue.metadata.teamId || undefined
        }
      };

      this.dialogRef.close(listData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getTypeDescription(type: ListType): string {
    switch (type) {
      case ListType.SPRINT:
        return 'Short-term development cycle with specific goals';
      case ListType.EPIC:
        return 'Large feature or initiative spanning multiple sprints';
      case ListType.BACKLOG:
        return 'Collection of features and user stories to be prioritized';
      case ListType.BUG_TRACKING:
        return 'Track and manage software defects and issues';
      case ListType.FEATURE_REQUEST:
        return 'New feature ideas and enhancement requests';
      case ListType.TEAM_TASKS:
        return 'Day-to-day team activities and administrative tasks';
      case ListType.CUSTOM:
        return 'Custom list type for specific needs';
      default:
        return '';
    }
  }

  // Preset configurations for different list types
  applyTypePreset(type: ListType): void {
    const metadata = this.form.get('metadata');
    
    switch (type) {
      case ListType.SPRINT:
        metadata?.patchValue({
          color: '#4caf50',
          icon: 'sprint',
          estimatedHours: 80 // 2 weeks sprint
        });
        break;
      case ListType.EPIC:
        metadata?.patchValue({
          color: '#ff9800',
          icon: 'assignment',
          estimatedHours: 320 // 8 weeks epic
        });
        break;
      case ListType.BUG_TRACKING:
        metadata?.patchValue({
          color: '#f44336',
          icon: 'bug_report'
        });
        this.form.patchValue({
          priority: Priority.HIGH
        });
        break;
      case ListType.FEATURE_REQUEST:
        metadata?.patchValue({
          color: '#9c27b0',
          icon: 'lightbulb'
        });
        break;
      case ListType.TEAM_TASKS:
        metadata?.patchValue({
          color: '#2196f3',
          icon: 'group'
        });
        break;
      case ListType.BACKLOG:
        metadata?.patchValue({
          color: '#607d8b',
          icon: 'list'
        });
        break;
      default:
        metadata?.patchValue({
          color: '#1976d2',
          icon: 'folder'
        });
        break;
    }
  }

  onTypeChange(type: ListType): void {
    this.applyTypePreset(type);
  }
}
