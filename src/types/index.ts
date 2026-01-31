export type TaskStatus = "todo" | "in_progress" | "done";

export type TaskPriority = "low" | "medium" | "high";

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  position: number;
  project_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
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
  email_confirmed_at: string | null;
  created_at: string;
}
