// Common types
export type ISOTimestamp = string;

export interface BaseEntity {
  id: string;
  created_at: ISOTimestamp;
  updated_at: ISOTimestamp;
}

// API response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Form action state types
export interface FormActionState {
  error?: string;
  success?: boolean;
}

// Task types
export type TaskStatus = "todo" | "in_progress" | "done";

export type TaskPriority = "low" | "medium" | "high";

export interface Profile extends BaseEntity {
  email: string;
  name: string | null;
  avatar_url: string | null;
}

export interface Project extends BaseEntity {
  name: string;
  description: string | null;
  owner_id: string;
}

export interface Task extends BaseEntity {
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: ISOTimestamp | null;
  position: number;
  project_id: string;
  created_by: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  project_id: string;
}

export interface TaskTag {
  task_id: string;
  tag_id: string;
}

export interface TaskWithTags extends Task {
  tags: Tag[];
}

// Auth types (wraps Supabase User with app-specific metadata)
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  email_confirmed_at: ISOTimestamp | null;
  created_at: ISOTimestamp;
}
