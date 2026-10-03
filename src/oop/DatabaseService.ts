/**
 * iTECH Lost & Found Management System
 * OOP Database & Application Business Logic Service
 * Demonstrates: Encapsulation, State Management, Role-Based Access Control, CRUD, Security Validation
 */

import { User } from './User';
import { Student } from './Student';
import { Admin } from './Admin';
import { LostFoundPost } from './LostFoundPost';
import { LostPost } from './LostPost';
import { FoundPost } from './FoundPost';
import { Report } from './Report';
import {
  UserDTO,
  PostDTO,
  ReportDTO,
  BackupPayload,
  SystemStats,
  PostType,
  ReportReason,
} from './types';
import { supabase, isSupabaseConfigured, IMAGE_BUCKET } from '../lib/supabase';
import {
  userToRow, rowToUser,
  postToRow, rowToPost,
  reportToRow, rowToReport,
} from './remoteMappers';

type TableName = 'users' | 'posts' | 'reports';
type SyncMap = Map<string, string>;
const mapsEqual = (a: SyncMap, b: SyncMap): boolean => {
  if (a.size !== b.size) return false;
  for (const [k, v] of a) if (b.get(k) !== v) return false;
  return true;
};

// SHA-256 Password Hasher
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

const STORAGE_KEYS = {
  USERS: 'itech_lostfound_users_v4',
  POSTS: 'itech_lostfound_posts_v4',
  REPORTS: 'itech_lostfound_reports_v4',
  CURRENT_USER: 'itech_lostfound_session_v4',
};

// Seed Realistic Demo Data
const INITIAL_USERS: UserDTO[] = [
  {
    userID: 'usr_admin_01',
    name: 'Dr. Tariq Mahmood',
    email: 'admin@itech.edu.pk',
    // SHA-256 of 'admin2026'
    passwordHash: '6051fc84a7a0d74c225fb18a496b09952da5642e60723ecae543298edd7d82d6',
    phone: '+92 300 8472910',
    role: 'ADMIN',
    accountStatus: 'ACTIVE',
    department: 'Campus Security & Student Affairs',
    createdAt: '2026-09-01T08:00:00.000Z',
  },
  {
    userID: 'usr_student_01',
    name: 'Sarah Ahmed',
    email: 'sarah.ahmed@itech.edu.pk',
    // SHA-256 of 'itech2026'
    passwordHash: 'b1dc452bbd31b824d780768218e3bd8aae21c153515ad7ef810bb3785682fdf6',
    phone: '+92 321 4455667',
    role: 'STUDENT',
    accountStatus: 'ACTIVE',
    universityID: 'IT-2023-0492',
    createdAt: '2026-09-10T10:15:00.000Z',
  },
  {
    userID: 'usr_student_02',
    name: 'Hamza Ali',
    email: 'hamza.ali@itech.edu.pk',
    // SHA-256 of 'itech2026'
    passwordHash: 'b1dc452bbd31b824d780768218e3bd8aae21c153515ad7ef810bb3785682fdf6',
    phone: '+92 333 9988771',
    role: 'STUDENT',
    accountStatus: 'ACTIVE',
    universityID: 'IT-2024-1108',
    createdAt: '2026-09-12T14:30:00.000Z',
  },
];

const INITIAL_POSTS: PostDTO[] = [
  {
    postID: 'post_lost_01',
    ownerID: 'usr_student_01',
    ownerName: 'Sarah Ahmed',
    ownerEmail: 'sarah.ahmed@itech.edu.pk',
    type: 'LOST',
    itemName: 'Black Leather Wallet',
    image: '/images/item_black_wallet_1791045765571.jpg',
    location: 'Main Library, 2nd Floor Reading Hall',
    incidentDate: '2026-10-02',
    approximateTime: '04:15 PM',
    contactNumber: '+92 321 4455667',
    details: 'Black leather bifold wallet with my student ID card, a metro card, and some cash. If found, please return or call immediately.',
    postedAt: '02 October 2026, 05:20 PM',
    status: 'ACTIVE',
  },
  {
    postID: 'post_lost_02',
    ownerID: 'usr_student_02',
    ownerName: 'Hamza Ali',
    ownerEmail: 'hamza.ali@itech.edu.pk',
    type: 'LOST',
    itemName: 'Blue Hardcover Notebook',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    location: 'Lecture Hall 3 (Computer Science Wing)',
    incidentDate: '2026-10-03',
    approximateTime: '11:00 AM',
    contactNumber: '+92 333 9988771',
    details: 'Navy blue notebook containing semester lecture notes for Data Structures and Algorithms. Has sticker of iTECH Tech Club on the cover.',
    postedAt: '03 October 2026, 12:15 PM',
    status: 'ACTIVE',
  },
  {
    postID: 'post_lost_03',
    ownerID: 'usr_student_01',
    ownerName: 'Sarah Ahmed',
    ownerEmail: 'sarah.ahmed@itech.edu.pk',
    type: 'LOST',
    itemName: 'Silver Casio Vintage Watch',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    location: 'Sports Complex Gymnasium Locker Room',
    incidentDate: '2026-09-29',
    approximateTime: '06:30 PM',
    contactNumber: '+92 321 4455667',
    details: 'Silver metal strap vintage digital watch. Left on the bench beside locker 42.',
    postedAt: '29 September 2026, 08:00 PM',
    status: 'RESOLVED',
  },
  {
    postID: 'post_found_01',
    ownerID: 'usr_student_02',
    ownerName: 'Hamza Ali',
    ownerEmail: 'hamza.ali@itech.edu.pk',
    type: 'FOUND',
    itemName: 'Black Wireless Earphones Case',
    image: '/images/item_earphones_case_1791045776703.jpg',
    location: 'Central Cafeteria, Table 14',
    incidentDate: '2026-10-03',
    approximateTime: '01:30 PM',
    contactNumber: '+92 333 9988771',
    details: 'Black matte charging case for wireless earbuds. Handed temporarily to the cafeteria supervisor counter, or contact me.',
    postedAt: '03 October 2026, 02:00 PM',
    status: 'ACTIVE',
  },
  {
    postID: 'post_found_02',
    ownerID: 'usr_student_01',
    ownerName: 'Sarah Ahmed',
    ownerEmail: 'sarah.ahmed@itech.edu.pk',
    type: 'FOUND',
    itemName: 'TI-84 Plus Graphic Calculator',
    image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=800&auto=format&fit=crop&q=80',
    location: 'Mathematics Department Computer Lab B',
    incidentDate: '2026-10-01',
    approximateTime: '03:45 PM',
    contactNumber: '+92 321 4455667',
    details: 'Found on workstation 07 after calculus practical class. Inscribed with initials "A.K." on back slide cover.',
    postedAt: '01 October 2026, 04:30 PM',
    status: 'ACTIVE',
  },
  {
    postID: 'post_found_03',
    ownerID: 'usr_admin_01',
    ownerName: 'Dr. Tariq Mahmood (Security Office)',
    ownerEmail: 'admin@itech.edu.pk',
    type: 'FOUND',
    itemName: 'Set of Dorm Keys with Red Lanyard',
    image: '/images/item_keys_lanyard_1791045788072.jpg',
    location: 'Hostel Block 4 Walkway',
    incidentDate: '2026-10-02',
    approximateTime: '09:00 PM',
    contactNumber: '+92 300 8472910',
    details: 'Set of brass keys on a red lanyard with a name tag. Deposited at the Campus Main Gate Security Desk for claim.',
    postedAt: '02 October 2026, 09:30 PM',
    status: 'ACTIVE',
  },
];

const INITIAL_REPORTS: ReportDTO[] = [
  {
    reportID: 'rep_001',
    postID: 'post_lost_02',
    postTitle: 'Blue Hardcover Notebook',
    reporterID: 'usr_student_01',
    reporterName: 'Sarah Ahmed',
    reporterEmail: 'sarah.ahmed@itech.edu.pk',
    reason: 'Duplicate post',
    details: 'Another student posted about a blue notebook earlier today.',
    reportDate: '2026-10-03T13:00:00.000Z',
    status: 'PENDING',
  },
];

export class DatabaseService {
  private static instance: DatabaseService;

  private users: Map<string, User> = new Map();
  private posts: Map<string, LostFoundPost> = new Map();
  private reports: Map<string, Report> = new Map();
  private currentUser: User | null = null;

  // --- Remote (Supabase) sync state ---
  // Data lives in memory for instant reads; every change is written through to Supabase.
  // `synced` remembers what the server last had, so only changed rows are sent.
  private readonly remote: boolean = isSupabaseConfigured;
  private synced: Record<TableName, SyncMap> = {
    users: new Map(),
    posts: new Map(),
    reports: new Map(),
  };
  private writeQueue: Promise<void> = Promise.resolve();
  private pendingWrites = 0;
  private errorHandler: ((message: string) => void) | null = null;

  private constructor() {
    if (!this.remote) {
      this.initializeLocal();
    }
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public isRemote(): boolean {
    return this.remote;
  }

  public setErrorHandler(handler: ((message: string) => void) | null): void {
    this.errorHandler = handler;
  }

  /** Loads data from Supabase (seeding demo data into an empty database). No-op in local mode. */
  public async init(): Promise<void> {
    if (!this.remote) return;
    const data = await this.fetchRemote();
    if (data.users.length === 0) {
      // Brand-new database: seed demo data
      this.hydrate(INITIAL_USERS, INITIAL_POSTS, INITIAL_REPORTS);
      await Promise.all([
        this.saveUsersToStorage(),
        this.savePostsToStorage(),
        this.saveReportsToStorage(),
      ]);
    } else {
      this.applyRemote(data);
    }
    this.restoreSession();
  }

  /** Pulls the latest shared data. Returns true if anything changed. */
  public async refreshFromRemote(): Promise<boolean> {
    if (!this.remote || this.pendingWrites > 0) return false;
    const data = await this.fetchRemote();
    if (this.pendingWrites > 0) return false;
    const next = this.snapshotAll(data);
    if (
      mapsEqual(next.users, this.synced.users) &&
      mapsEqual(next.posts, this.synced.posts) &&
      mapsEqual(next.reports, this.synced.reports)
    ) {
      return false;
    }
    this.applyRemote(data);
    this.restoreSession();
    return true;
  }

  // --- Remote helpers ---
  private async fetchRemote(): Promise<{ users: UserDTO[]; posts: PostDTO[]; reports: ReportDTO[] }> {
    const sb = supabase!;
    const [u, p, r] = await Promise.all([
      sb.from('users').select('*'),
      sb.from('posts').select('*'),
      sb.from('reports').select('*'),
    ]);
    if (u.error) throw u.error;
    if (p.error) throw p.error;
    if (r.error) throw r.error;
    return {
      users: (u.data ?? []).map(rowToUser),
      posts: (p.data ?? []).map(rowToPost),
      reports: (r.data ?? []).map(rowToReport),
    };
  }

  private snapshotAll(d: { users: UserDTO[]; posts: PostDTO[]; reports: ReportDTO[] }): Record<TableName, SyncMap> {
    const snap = <T,>(list: T[], idOf: (x: T) => string, toRow: (x: T) => Record<string, unknown>): SyncMap =>
      new Map(list.map((x) => [idOf(x), JSON.stringify(toRow(x))] as [string, string]));
    return {
      users: snap(d.users, (x) => x.userID, userToRow),
      posts: snap(d.posts, (x) => x.postID, postToRow),
      reports: snap(d.reports, (x) => x.reportID, reportToRow),
    };
  }

  private applyRemote(d: { users: UserDTO[]; posts: PostDTO[]; reports: ReportDTO[] }): void {
    this.hydrate(d.users, d.posts, d.reports);
    this.synced = this.snapshotAll(d);
  }

  /** Runs writes one at a time, in order. Rejects for the caller; also reports failures. */
  private enqueue(task: () => Promise<void>): Promise<void> {
    this.pendingWrites++;
    const run = this.writeQueue.then(task);
    this.writeQueue = run.catch(() => undefined);
    const result = run.finally(() => {
      this.pendingWrites--;
    });
    result.catch((err) => {
      console.error('Supabase sync failed:', err);
      this.errorHandler?.('Could not save your changes to the server. Please check your connection and try again.');
    });
    return result;
  }

  private async pushTable<T>(
    table: TableName,
    idCol: string,
    list: T[],
    idOf: (d: T) => string,
    toRow: (d: T) => Record<string, unknown>
  ): Promise<void> {
    const sb = supabase!;
    const prev = this.synced[table];
    const rows = new Map<string, Record<string, unknown>>();
    for (const d of list) rows.set(idOf(d), toRow(d));

    const changed: Record<string, unknown>[] = [];
    rows.forEach((row, id) => {
      if (prev.get(id) !== JSON.stringify(row)) changed.push(row);
    });
    const removed = Array.from(prev.keys()).filter((id) => !rows.has(id));

    if (changed.length > 0) {
      const { error } = await sb.from(table).upsert(changed);
      if (error) throw error;
    }
    if (removed.length > 0) {
      const { error } = await sb.from(table).delete().in(idCol, removed);
      if (error) throw error;
    }

    const next: SyncMap = new Map();
    rows.forEach((row, id) => next.set(id, JSON.stringify(row)));
    this.synced[table] = next;
  }

  /** Uploads a data: URL to Supabase Storage and returns its public URL. */
  private async uploadImage(postID: string, dataUrl: string): Promise<string> {
    const sb = supabase!;
    const [meta, b64] = dataUrl.split(',');
    const mime = /data:(.*?);base64/.exec(meta)?.[1] ?? 'image/jpeg';
    const ext = mime.split('/')[1].replace('jpeg', 'jpg');
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const path = `${postID}-${Date.now()}.${ext}`;
    const { error } = await sb.storage.from(IMAGE_BUCKET).upload(path, bytes, {
      contentType: mime,
      upsert: true,
    });
    if (error) throw error;
    return sb.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
  }

  private async pushPosts(list: PostDTO[]): Promise<void> {
    // Keep the database light: move uploaded photos (base64) into Storage first.
    for (const dto of list) {
      if (dto.image.startsWith('data:')) {
        const url = await this.uploadImage(dto.postID, dto.image);
        dto.image = url;
        this.posts.get(dto.postID)?.update({ image: url });
      }
    }
    await this.pushTable('posts', 'post_id', list, (d) => d.postID, postToRow);
  }

  // --- State loading ---
  private hydrate(userDTOs: UserDTO[], postDTOs: PostDTO[], reportDTOs: ReportDTO[]): void {
    this.users.clear();
    for (const dto of userDTOs) {
      if (dto.role === 'ADMIN') {
        this.users.set(dto.userID, Admin.fromDTO(dto));
      } else {
        this.users.set(dto.userID, Student.fromDTO(dto));
      }
    }
    this.posts.clear();
    for (const dto of postDTOs) {
      if (dto.type === 'LOST') {
        this.posts.set(dto.postID, LostPost.fromDTO(dto));
      } else {
        this.posts.set(dto.postID, FoundPost.fromDTO(dto));
      }
    }
    this.reports.clear();
    for (const dto of reportDTOs) {
      this.reports.set(dto.reportID, Report.fromDTO(dto));
    }
  }

  private restoreSession(): void {
    const sessionUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    this.currentUser = null;
    if (sessionUserId && this.users.has(sessionUserId)) {
      const u = this.users.get(sessionUserId)!;
      if (u.isActive()) {
        this.currentUser = u;
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    }
  }

  /** Local-only mode (no Supabase env vars): browser localStorage, as before. */
  private initializeLocal(): void {
    const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    const storedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
    const storedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);
    this.hydrate(
      storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS,
      storedPosts ? JSON.parse(storedPosts) : INITIAL_POSTS,
      storedReports ? JSON.parse(storedReports) : INITIAL_REPORTS
    );
    if (!storedUsers) this.saveUsersToStorage();
    if (!storedPosts) this.savePostsToStorage();
    if (!storedReports) this.saveReportsToStorage();
    this.restoreSession();
  }

  // --- Persistence Helpers (localStorage locally, Supabase when configured) ---
  private saveUsersToStorage(): Promise<void> {
    const list = Array.from(this.users.values()).map((u) => u.toDTO());
    if (!this.remote) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(list));
      return Promise.resolve();
    }
    return this.enqueue(() => this.pushTable('users', 'user_id', list, (d) => d.userID, userToRow));
  }

  private savePostsToStorage(): Promise<void> {
    const list = Array.from(this.posts.values()).map((p) => p.toDTO());
    if (!this.remote) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(list));
      return Promise.resolve();
    }
    return this.enqueue(() => this.pushPosts(list));
  }

  private saveReportsToStorage(): Promise<void> {
    const list = Array.from(this.reports.values()).map((r) => r.toDTO());
    if (!this.remote) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(list));
      return Promise.resolve();
    }
    return this.enqueue(() => this.pushTable('reports', 'report_id', list, (d) => d.reportID, reportToRow));
  }

  // --- Authentication & Session Management ---
  public async login(email: string, rawPassword: string): Promise<User> {
    const cleanEmail = email.trim().toLowerCase();
    const candidateHash = await hashPassword(rawPassword);

    const user = Array.from(this.users.values()).find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (!user) {
      throw new Error('Invalid login credentials.');
    }

    if (!user.verifyPasswordHash(candidateHash)) {
      throw new Error('Invalid login credentials.');
    }

    if (!user.isActive()) {
      throw new Error('Your account has been deactivated. Please contact campus security.');
    }

    this.currentUser = user;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, user.userID);
    return user;
  }

  public logout(): void {
    this.currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public async registerStudent(data: {
    name: string;
    email: string;
    rawPassword: string;
    phone: string;
    universityID: string;
  }): Promise<Student> {
    if (!data.name.trim()) throw new Error('Please enter your full name.');
    if (!/^[^\s@]+@itech\.edu\.pk$/i.test(data.email.trim())) {
      throw new Error('Please use your official @itech.edu.pk university email address.');
    }
    if (!data.universityID.trim()) {
      throw new Error('Please enter your official University ID.');
    }
    if (!data.phone.trim()) {
      throw new Error('Please enter your contact phone number.');
    }
    if (data.rawPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    // Make sure we see accounts created by other people before checking duplicates
    if (this.remote) {
      try {
        await this.refreshFromRemote();
      } catch {
        // The database's unique email index is the final safeguard
      }
    }

    // Check duplicate email
    const exists = Array.from(this.users.values()).some(
      (u) => u.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (exists) {
      throw new Error('An account with this email address already exists.');
    }

    const passwordHash = await hashPassword(data.rawPassword);
    const newId = `usr_student_${Date.now()}`;
    const newStudent = new Student(
      newId,
      data.name.trim(),
      data.email.trim(),
      passwordHash,
      data.phone.trim(),
      data.universityID.trim(),
      'ACTIVE'
    );

    this.users.set(newId, newStudent);
    try {
      await this.saveUsersToStorage();
    } catch {
      this.users.delete(newId);
      throw new Error(
        'Could not create your account. The email may already be registered, or the server is unreachable.'
      );
    }

    this.currentUser = newStudent;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, newId);
    return newStudent;
  }

  // --- Strict Authorization Rule (Rule 5) ---
  public validateOwnership(actor: User | null, post: LostFoundPost, actionDesc: 'edit' | 'delete'): void {
    if (!actor) {
      throw new Error(`You must be logged in to ${actionDesc} this post.`);
    }

    // Polymorphic rule: Student -> own posts only; Admin -> any post
    if (!actor.canModifyPost(post.ownerID)) {
      throw new Error(`You are not authorized to ${actionDesc} this post.`);
    }
  }

  // --- CRUD: CREATE Post ---
  public createPost(
    actor: User,
    data: {
      type: PostType;
      itemName: string;
      image: string;
      location: string;
      incidentDate: string;
      approximateTime: string;
      contactNumber: string;
      details: string;
    }
  ): LostFoundPost {
    if (!data.type) throw new Error('Please select Lost or Found.');
    if (!data.itemName?.trim()) throw new Error('Please enter an item name.');
    if (!data.location?.trim()) throw new Error('Please provide the location.');

    const newPostID = `post_${data.type.toLowerCase()}_${Date.now()}`;
    const timestamp = LostFoundPost.generateTimestamp();

    let post: LostFoundPost;
    if (data.type === 'LOST') {
      post = new LostPost(
        newPostID,
        actor.userID,
        actor.name,
        actor.email,
        data.itemName,
        data.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
        data.location,
        data.incidentDate,
        data.approximateTime,
        data.contactNumber || actor.phone,
        data.details,
        timestamp,
        'ACTIVE'
      );
    } else {
      post = new FoundPost(
        newPostID,
        actor.userID,
        actor.name,
        actor.email,
        data.itemName,
        data.image || 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
        data.location,
        data.incidentDate,
        data.approximateTime,
        data.contactNumber || actor.phone,
        data.details,
        timestamp,
        'ACTIVE'
      );
    }

    this.posts.set(newPostID, post);
    this.savePostsToStorage();
    return post;
  }

  // --- CRUD: READ Posts ---
  public getAllPosts(): LostFoundPost[] {
    return Array.from(this.posts.values()).sort(
      (a, b) => b.getPostedAtMillis() - a.getPostedAtMillis()
    );
  }

  public getPostByID(postID: string): LostFoundPost | undefined {
    return this.posts.get(postID);
  }

  public getLostPosts(): LostFoundPost[] {
    return this.getAllPosts().filter((p) => p.type === 'LOST');
  }

  public getFoundPosts(): LostFoundPost[] {
    return this.getAllPosts().filter((p) => p.type === 'FOUND');
  }

  public getPostsByOwner(ownerID: string): LostFoundPost[] {
    return this.getAllPosts().filter((p) => p.ownerID === ownerID);
  }

  /**
   * Search and Filter Engine
   * Filter: ALL | LOST | FOUND | RESOLVED
   * Strict adherence to Rule 8: No categories!
   */
  public searchAndFilter(
    query: string,
    filter: 'ALL' | 'LOST' | 'FOUND' | 'RESOLVED'
  ): LostFoundPost[] {
    return this.getAllPosts().filter((post) => {
      // 1. Status/Type classification
      if (filter === 'LOST' && post.type !== 'LOST') return false;
      if (filter === 'FOUND' && post.type !== 'FOUND') return false;
      if (filter === 'RESOLVED' && post.status !== 'RESOLVED') return false;

      // 2. Query search
      return post.matchesQuery(query);
    });
  }

  // --- CRUD: UPDATE Post ---
  public updatePost(
    actor: User,
    postID: string,
    updates: {
      itemName?: string;
      image?: string;
      location?: string;
      incidentDate?: string;
      approximateTime?: string;
      contactNumber?: string;
      details?: string;
    }
  ): LostFoundPost {
    const post = this.posts.get(postID);
    if (!post) {
      throw new Error('This page does not exist.');
    }

    // Ownership check
    this.validateOwnership(actor, post, 'edit');

    post.update(updates);
    this.savePostsToStorage();
    return post;
  }

  // --- CRUD: DELETE Post ---
  public deletePost(actor: User, postID: string): void {
    const post = this.posts.get(postID);
    if (!post) {
      throw new Error('This page does not exist.');
    }

    // Ownership check
    this.validateOwnership(actor, post, 'delete');

    this.posts.delete(postID);
    this.savePostsToStorage();
  }

  // --- Post Status: Mark Resolved ---
  public markPostResolved(actor: User, postID: string): LostFoundPost {
    const post = this.posts.get(postID);
    if (!post) {
      throw new Error('This page does not exist.');
    }

    // Only owner or admin can mark resolved
    this.validateOwnership(actor, post, 'edit');

    post.markResolved();
    this.savePostsToStorage();
    return post;
  }

  // --- Moderation & Reports (Rule 19 & 24) ---
  public createReport(
    reporter: User,
    postID: string,
    reason: ReportReason,
    details: string = ''
  ): Report {
    const post = this.posts.get(postID);
    if (!post) {
      throw new Error('Post not found.');
    }

    const reportID = `rep_${Date.now()}`;
    const report = new Report(
      reportID,
      postID,
      post.itemName,
      reporter.userID,
      reporter.name,
      reporter.email,
      reason,
      details,
      new Date().toISOString(),
      'PENDING'
    );

    this.reports.set(reportID, report);
    this.saveReportsToStorage();
    return report;
  }

  public getAllReports(): Report[] {
    return Array.from(this.reports.values()).sort((a, b) =>
      b.reportDate.localeCompare(a.reportDate)
    );
  }

  public dismissReport(admin: Admin, reportID: string): void {
    if (!admin.canAccessAdminPortal()) {
      throw new Error('Access Denied');
    }
    const rep = this.reports.get(reportID);
    if (rep) {
      rep.dismiss();
      this.saveReportsToStorage();
    }
  }

  public removeReportedPost(admin: Admin, reportID: string): void {
    if (!admin.canAccessAdminPortal()) {
      throw new Error('Access Denied');
    }
    const rep = this.reports.get(reportID);
    if (rep) {
      if (this.posts.has(rep.postID)) {
        this.posts.delete(rep.postID);
        this.savePostsToStorage();
      }
      rep.resolve();
      this.saveReportsToStorage();
    }
  }

  // --- Admin User Management (Rule 23) ---
  public getAllStudents(): Student[] {
    return Array.from(this.users.values())
      .filter((u): u is Student => u instanceof Student);
  }

  public toggleUserStatus(admin: Admin, userID: string): void {
    if (!admin.canAccessAdminPortal()) {
      throw new Error('Access Denied');
    }
    const user = this.users.get(userID);
    if (!user) throw new Error('User not found.');
    if (user.role === 'ADMIN') {
      throw new Error('Cannot disable administrator account.');
    }

    const nextStatus = user.accountStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    user.setAccountStatus(nextStatus);
    this.saveUsersToStorage();

    // A disabled account must not keep an active session
    if (nextStatus === 'DISABLED' && this.currentUser?.userID === userID) {
      this.logout();
    }
  }

  // --- Admin Statistics (Rule 21) ---
  public getStatistics(): SystemStats {
    const all = Array.from(this.posts.values());
    const students = Array.from(this.users.values()).filter((u) => u.role === 'STUDENT');

    return {
      totalPosts: all.length,
      lostPosts: all.filter((p) => p.type === 'LOST').length,
      foundPosts: all.filter((p) => p.type === 'FOUND').length,
      resolvedPosts: all.filter((p) => p.status === 'RESOLVED').length,
      reportedPosts: Array.from(this.reports.values()).filter((r) => r.status === 'PENDING').length,
      registeredStudents: students.length,
    };
  }

  // --- Backup & Restore (Rule 25) ---
  public createBackup(admin: Admin): BackupPayload {
    if (!admin.canAccessAdminPortal()) {
      throw new Error('Access Denied');
    }

    const payload: BackupPayload = {
      version: '1.0.0',
      university: 'iTECH - International Institute of Technology, Culture & Health Sciences',
      exportedAt: new Date().toISOString(),
      users: Array.from(this.users.values()).map((u) => u.toDTO()),
      posts: Array.from(this.posts.values()).map((p) => p.toDTO()),
      reports: Array.from(this.reports.values()).map((r) => r.toDTO()),
    };

    return payload;
  }

  public restoreBackup(admin: Admin, payload: BackupPayload): void {
    if (!admin.canAccessAdminPortal()) {
      throw new Error('Access Denied');
    }

    if (!payload.users || !payload.posts || !Array.isArray(payload.users) || !Array.isArray(payload.posts)) {
      throw new Error('Invalid backup file format.');
    }

    // Clear and restore
    this.users.clear();
    for (const dto of payload.users) {
      if (dto.role === 'ADMIN') {
        this.users.set(dto.userID, Admin.fromDTO(dto));
      } else {
        this.users.set(dto.userID, Student.fromDTO(dto));
      }
    }
    this.saveUsersToStorage();

    // Re-resolve the session against the restored users
    if (this.currentUser) {
      const refreshed = this.users.get(this.currentUser.userID);
      if (refreshed && refreshed.isActive()) {
        this.currentUser = refreshed;
      } else {
        this.logout();
      }
    }

    this.posts.clear();
    for (const dto of payload.posts) {
      if (dto.type === 'LOST') {
        this.posts.set(dto.postID, LostPost.fromDTO(dto));
      } else {
        this.posts.set(dto.postID, FoundPost.fromDTO(dto));
      }
    }
    this.savePostsToStorage();

    this.reports.clear();
    if (payload.reports && Array.isArray(payload.reports)) {
      for (const dto of payload.reports) {
        this.reports.set(dto.reportID, Report.fromDTO(dto));
      }
    }
    this.saveReportsToStorage();
  }

  /**
   * Resets database to default seed state
   */
  public resetToDefaultSeed(): void {
    if (this.remote) {
      // Replaces the shared data for everyone with the demo seed
      this.hydrate(INITIAL_USERS, INITIAL_POSTS, INITIAL_REPORTS);
      this.saveUsersToStorage();
      this.savePostsToStorage();
      this.saveReportsToStorage();
      this.restoreSession();
      return;
    }
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.POSTS);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    this.initializeLocal();
  }
}
