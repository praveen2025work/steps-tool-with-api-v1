export interface UserApplication {
  applicationId: string;
  accessLevel: string; // 'Viewer', 'Editor', 'Admin'
  assignedOn: Date;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  isActive: boolean;
  role: string;
  department: string;
  createdOn: Date;
  createdBy: string;
  lastModifiedOn: Date | null;
  lastModifiedBy: string | null;
  applications: UserApplication[];
}

export interface UserFormData {
  username: string;
  fullName: string;
  email: string;
  isActive: boolean;
  role: string;
  department: string;
  applications: UserApplication[];
}