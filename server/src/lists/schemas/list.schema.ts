import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ListType, Priority, ActivityType } from '../interfaces/list.interface';

@Schema({ collection: 'subtasks' })
export class SubTask {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true, trim: true, maxlength: 200 })
  title!: string;

  @Prop({ default: false })
  isCompleted!: boolean;

  @Prop({ trim: true })
  assignee?: string;

  @Prop({ default: Date.now })
  createdAt!: Date;
}

@Schema({ collection: 'attachments' })
export class Attachment {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true, trim: true, maxlength: 255 })
  fileName!: string;

  @Prop({ required: true, min: 0, max: 100000000 }) // 100MB max
  fileSize!: number;

  @Prop({ required: true, trim: true })
  fileType!: string;

  @Prop({ required: true, trim: true })
  url!: string;

  @Prop({ required: true, trim: true })
  uploadedBy!: string;

  @Prop({ default: Date.now })
  uploadedAt!: Date;
}

@Schema({ collection: 'comments' })
export class Comment {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true, trim: true, maxlength: 1000 })
  text!: string;

  @Prop({ required: true, trim: true })
  author!: string;

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop({ default: false })
  isEdited!: boolean;

  @Prop()
  editedAt?: Date;
}

@Schema({ collection: 'list_items' })
export class ListItem {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true, trim: true, maxlength: 300 })
  title!: string;

  @Prop({ trim: true, maxlength: 2000 })
  description?: string;

  @Prop({ default: false })
  isCompleted!: boolean;

  @Prop({ 
    type: String, 
    enum: Object.values(Priority), 
    default: Priority.MEDIUM 
  })
  priority!: Priority;

  @Prop({ trim: true })
  assignee?: string;

  @Prop()
  dueDate?: Date;

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop({ default: Date.now })
  updatedAt!: Date;

  @Prop({ min: 0, max: 1000 })
  estimatedHours?: number;

  @Prop({ min: 0, max: 1000 })
  actualHours?: number;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ type: [String], default: [] })
  dependencies!: string[];

  @Prop({ type: [Attachment], default: [] })
  attachments!: Attachment[];

  @Prop({ type: [Comment], default: [] })
  comments!: Comment[];

  @Prop({ type: [SubTask], default: [] })
  subtasks!: SubTask[];
}

@Schema({ collection: 'lists' })
export class List extends Document {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true, trim: true, maxlength: 200 })
  title!: string;

  @Prop({ trim: true, maxlength: 1000 })
  description?: string;

  @Prop({ 
    required: true, 
    trim: true, 
    match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ 
  })
  color!: string;

  @Prop({ required: true, trim: true })
  icon!: string;

  @Prop({ type: [ListItem], default: [] })
  items!: ListItem[];

  @Prop({ required: true, trim: true })
  owner!: string;

  @Prop({ type: [String], default: [] })
  members!: string[];

  @Prop({ default: Date.now, index: true })
  createdAt!: Date;

  @Prop({ default: Date.now, index: true })
  updatedAt!: Date;

  @Prop({ default: true, index: true })
  isActive!: boolean;

  @Prop({ 
    type: String, 
    enum: Object.values(ListType), 
    required: true,
    index: true
  })
  type!: ListType;

  @Prop({ 
    type: String, 
    enum: Object.values(Priority), 
    default: Priority.MEDIUM,
    index: true
  })
  priority!: Priority;

  @Prop({ type: [String], default: [], index: true })
  tags!: string[];

  @Prop({
    type: {
      itemCount: { type: Number, default: 0 },
      completedCount: { type: Number, default: 0 },
      completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
      lastActivityAt: { type: Date },
      estimatedHours: { type: Number, min: 0 },
      actualHours: { type: Number, min: 0 }
    },
    default: {}
  })
  metadata!: any;
}

@Schema({ collection: 'recent_activities' })
export class RecentActivity extends Document {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ 
    type: String, 
    enum: Object.values(ActivityType), 
    required: true,
    index: true
  })
  type!: ActivityType;

  @Prop({ required: true, trim: true, maxlength: 500 })
  description!: string;

  @Prop({ required: true, trim: true, index: true })
  user!: string;

  @Prop({ default: Date.now, index: true })
  timestamp!: Date;

  @Prop({ required: true, index: true })
  listId!: string;

  @Prop({ index: true })
  itemId?: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata?: any;
}

export const ListSchema = SchemaFactory.createForClass(List);
export const RecentActivitySchema = SchemaFactory.createForClass(RecentActivity);

// Add pre-save middleware to update metadata
ListSchema.pre('save', function(this: any, next: any) {
  const list = this as any;
  
  // Update metadata
  list.metadata.itemCount = list.items.length;
  list.metadata.completedCount = list.items.filter((item: any) => item.isCompleted).length;
  list.metadata.completionPercentage = list.metadata.itemCount > 0 
    ? Math.round((list.metadata.completedCount / list.metadata.itemCount) * 100) 
    : 0;
  list.metadata.lastActivityAt = new Date();
  list.updatedAt = new Date();

  // Calculate estimated and actual hours
  list.metadata.estimatedHours = list.items.reduce((sum: number, item: any) => 
    sum + (item.estimatedHours || 0), 0);
  list.metadata.actualHours = list.items.reduce((sum: number, item: any) => 
    sum + (item.actualHours || 0), 0);

  next();
});

// Add indexes for performance
ListSchema.index({ owner: 1, type: 1 });
ListSchema.index({ members: 1, type: 1 });
ListSchema.index({ 'items.assignee': 1, 'items.isCompleted': 1 });
ListSchema.index({ 'items.dueDate': 1, 'items.isCompleted': 1 });
ListSchema.index({ tags: 1 });
ListSchema.index({ createdAt: -1 });
ListSchema.index({ updatedAt: -1 });

RecentActivitySchema.index({ timestamp: -1 });
RecentActivitySchema.index({ listId: 1, timestamp: -1 });
RecentActivitySchema.index({ user: 1, timestamp: -1 });
