/**
 * iTECH Lost & Found Management System
 * Core OOP Type Definitions & Interfaces
 */

export type UserRole = 'STUDENT' | 'ADMIN';
export type AccountStatus = 'ACTIVE' | 'DISABLED';
export type PostType = 'LOST' | 'FOUND';
export type PostStatus = 'ACTIVE' | 'RESOLVED';
export type ReportStatus = 'PENDING' | 'RESOLVED' | 'DISMISSED';

export type ReportReason =
  | 'Spam'
  | 'Fake information'
  | 'Inappropriate content'
  | 'Wrong information'
  | 'Duplicate post'
  | 'Other';

export interface UserDTO {
  userID: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  role: UserRole;
  accountStatus: AccountStatus;
  universityID?: string;
  department?: string;
  accessLevel?: number;
  createdAt: string;
}

export interface PostDTO {
  postID: string;
  ownerID: string;
  ownerName: string;
  ownerEmail: string;
  type: PostType;
  itemName: string;
  image: string;
  location: string;
  incidentDate: string;
  approximateTime: string;
  contactNumber: string;
  details: string;
  postedAt: string;
  status: PostStatus;
}

export interface ReportDTO {
  reportID: string;
  postID: string;
  postTitle: string;
  reporterID: string;
  reporterName: string;
  reporterEmail: string;
  reason: ReportReason;
  details?: string;
  reportDate: string;
  status: ReportStatus;
}

export interface BackupPayload {
  version: string;
  university: string;
  exportedAt: string;
  users: UserDTO[];
  posts: PostDTO[];
  reports: ReportDTO[];
}

export interface SystemStats {
  totalPosts: number;
  lostPosts: number;
  foundPosts: number;
  resolvedPosts: number;
  reportedPosts: number;
  registeredStudents: number;
}
