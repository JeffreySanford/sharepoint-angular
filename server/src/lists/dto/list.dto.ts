import { IsString, IsOptional, IsBoolean, IsEnum, IsArray, IsNumber, Min, Max, IsDateString, ValidateNested, ArrayMaxSize, MaxLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ListType, Priority } from '../interfaces/list.interface';

export class CreateSubTaskDto {
  @ApiProperty({ description: 'Subtask title', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  @Transform(({ value }: { value: any }) => value?.toString().trim())
  title!: string;

  @ApiPropertyOptional({ description: 'Assigned user' })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: any }) => value?.toString().trim())
  assignee?: string;
}

export class CreateCommentDto {
  @ApiProperty({ description: 'Comment text', maxLength: 1000 })
  @IsString()
  @MaxLength(1000)
  @Transform(({ value }: { value: any }) => value?.toString().trim())
  text!: string;

  @ApiProperty({ description: 'Comment author' })
  @IsString()
  @Transform(({ value }: { value: any }) => value?.toString().trim())
  author!: string;
}

export class CreateListItemDto {
  @ApiProperty({ description: 'Item title', maxLength: 300 })
  @IsString()
  @MaxLength(300)
  @Transform(({ value }) => value?.toString().trim())
  title!: string;

  @ApiPropertyOptional({ description: 'Item description', maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Transform(({ value }: { value: any }) => value?.toString().trim())
  description?: string;

  @ApiPropertyOptional({ description: 'Priority level', enum: Priority })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({ description: 'Assigned user' })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: any }) => value?.toString().trim())
  assignee?: string;

  @ApiPropertyOptional({ description: 'Due date' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Estimated hours', minimum: 0, maximum: 1000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000)
  @Transform(({ value }) => parseFloat(value))
  estimatedHours?: number;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  @Transform(({ value }) => Array.isArray(value) ? value.map((v: any) => v.toString().trim()) : [])
  tags?: string[];

  @ApiPropertyOptional({ description: 'Item dependencies', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(50)
  dependencies?: string[];

  @ApiPropertyOptional({ description: 'Subtasks', type: [CreateSubTaskDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubTaskDto)
  @ArrayMaxSize(10)
  subtasks?: CreateSubTaskDto[];
}

export class UpdateListItemDto {
  @ApiPropertyOptional({ description: 'Item title', maxLength: 300 })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  @Transform(({ value }: { value: any }) => value?.toString().trim())
  title?: string;

  @ApiPropertyOptional({ description: 'Item description', maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Transform(({ value }: { value: any }) => value?.toString().trim())
  description?: string;

  @ApiPropertyOptional({ description: 'Completion status' })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiPropertyOptional({ description: 'Priority level', enum: Priority })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({ description: 'Assigned user' })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: any }) => value?.toString().trim())
  assignee?: string;

  @ApiPropertyOptional({ description: 'Due date' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Actual hours spent', minimum: 0, maximum: 1000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000)
  @Transform(({ value }) => parseFloat(value))
  actualHours?: number;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  @Transform(({ value }) => Array.isArray(value) ? value.map((v: any) => v.toString().trim()) : [])
  tags?: string[];
}

export class CreateListDto {
  @ApiProperty({ description: 'List title', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  @Transform(({ value }: { value: any }) => value?.toString().trim())
  title!: string;

  @ApiPropertyOptional({ description: 'List description', maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Transform(({ value }: { value: any }) => value?.toString().trim())
  description?: string;

  @ApiProperty({ description: 'List color (hex)', pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$' })
  @IsString()
  @Transform(({ value }: { value: any }) => value?.toString().trim())
  color!: string;

  @ApiProperty({ description: 'List icon name' })
  @IsString()
  @Transform(({ value }) => value?.toString().trim())
  icon!: string;

  @ApiProperty({ description: 'List owner' })
  @IsString()
  @Transform(({ value }) => value?.toString().trim())
  owner!: string;

  @ApiPropertyOptional({ description: 'List members', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(100)
  @Transform(({ value }) => Array.isArray(value) ? value.map((v: any) => v.toString().trim()) : [])
  members?: string[];

  @ApiProperty({ description: 'List type', enum: ListType })
  @IsEnum(ListType)
  type!: ListType;

  @ApiPropertyOptional({ description: 'List priority', enum: Priority })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({ description: 'List tags', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  @Transform(({ value }: { value: any }) => Array.isArray(value) ? value.map((v: any) => v.toString().trim()) : [])
  tags?: string[];

  @ApiPropertyOptional({ description: 'Initial list items', type: [CreateListItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateListItemDto)
  @ArrayMaxSize(100)
  items?: CreateListItemDto[];
}

export class UpdateListDto {
  @ApiPropertyOptional({ description: 'List title', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Transform(({ value }: { value: any }) => value?.toString().trim())
  title?: string;

  @ApiPropertyOptional({ description: 'List description', maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Transform(({ value }: { value: any }) => value?.toString().trim())
  description?: string;

  @ApiPropertyOptional({ description: 'List color (hex)', pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$' })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: any }) => value?.toString().trim())
  color?: string;

  @ApiPropertyOptional({ description: 'List icon name' })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: any }) => value?.toString().trim())
  icon?: string;

  @ApiPropertyOptional({ description: 'List members', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(100)
  @Transform(({ value }: { value: any }) => Array.isArray(value) ? value.map((v: any) => v.toString().trim()) : [])
  members?: string[];

  @ApiPropertyOptional({ description: 'List priority', enum: Priority })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({ description: 'List tags', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  @Transform(({ value }) => Array.isArray(value) ? value.map((v: any) => v.toString().trim()) : [])
  tags?: string[];

  @ApiPropertyOptional({ description: 'Active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
