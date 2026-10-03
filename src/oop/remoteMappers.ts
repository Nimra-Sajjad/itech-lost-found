/**
 * Maps the app's camelCase DTOs to/from the snake_case Supabase table rows.
 * Key order is fixed so JSON.stringify(row) can be used to detect changes.
 */
import { UserDTO, PostDTO, ReportDTO } from './types';

type Row = Record<string, unknown>;

export const userToRow = (d: UserDTO): Row => ({
  user_id: d.userID,
  name: d.name,
  email: d.email,
  password_hash: d.passwordHash,
  phone: d.phone,
  role: d.role,
  account_status: d.accountStatus,
  university_id: d.universityID ?? null,
  department: d.department ?? null,
  access_level: d.accessLevel ?? null,
  created_at: d.createdAt,
});

export const rowToUser = (r: Row): UserDTO => ({
  userID: r.user_id as string,
  name: r.name as string,
  email: r.email as string,
  passwordHash: r.password_hash as string,
  phone: r.phone as string,
  role: r.role as UserDTO['role'],
  accountStatus: r.account_status as UserDTO['accountStatus'],
  universityID: (r.university_id as string | null) ?? undefined,
  department: (r.department as string | null) ?? undefined,
  accessLevel: (r.access_level as number | null) ?? undefined,
  createdAt: r.created_at as string,
});

export const postToRow = (d: PostDTO): Row => ({
  post_id: d.postID,
  owner_id: d.ownerID,
  owner_name: d.ownerName,
  owner_email: d.ownerEmail,
  type: d.type,
  item_name: d.itemName,
  image: d.image,
  location: d.location,
  incident_date: d.incidentDate,
  approximate_time: d.approximateTime,
  contact_number: d.contactNumber,
  details: d.details,
  posted_at: d.postedAt,
  status: d.status,
});

export const rowToPost = (r: Row): PostDTO => ({
  postID: r.post_id as string,
  ownerID: r.owner_id as string,
  ownerName: r.owner_name as string,
  ownerEmail: r.owner_email as string,
  type: r.type as PostDTO['type'],
  itemName: r.item_name as string,
  image: r.image as string,
  location: r.location as string,
  incidentDate: r.incident_date as string,
  approximateTime: r.approximate_time as string,
  contactNumber: r.contact_number as string,
  details: r.details as string,
  postedAt: r.posted_at as string,
  status: r.status as PostDTO['status'],
});

export const reportToRow = (d: ReportDTO): Row => ({
  report_id: d.reportID,
  post_id: d.postID,
  post_title: d.postTitle,
  reporter_id: d.reporterID,
  reporter_name: d.reporterName,
  reporter_email: d.reporterEmail,
  reason: d.reason,
  details: d.details ?? null,
  report_date: d.reportDate,
  status: d.status,
});

export const rowToReport = (r: Row): ReportDTO => ({
  reportID: r.report_id as string,
  postID: r.post_id as string,
  postTitle: r.post_title as string,
  reporterID: r.reporter_id as string,
  reporterName: r.reporter_name as string,
  reporterEmail: r.reporter_email as string,
  reason: r.reason as ReportDTO['reason'],
  details: (r.details as string | null) ?? undefined,
  reportDate: r.report_date as string,
  status: r.status as ReportDTO['status'],
});
