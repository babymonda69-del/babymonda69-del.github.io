
export type Role = 'admin' | 'worker';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: string[]; // Array of UIDs
  createdBy: string;
  createdAt: number;
  priority: 'low' | 'medium' | 'high';
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}
