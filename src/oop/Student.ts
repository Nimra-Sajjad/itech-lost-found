/**
 * OOP Demonstration: Derived Subclass (Inheritance & Polymorphism)
 * Student extends User
 */

import { User } from './User';
import { AccountStatus, UserDTO } from './types';

export class Student extends User {
  #universityID: string;

  constructor(
    userID: string,
    name: string,
    email: string,
    passwordHash: string,
    phone: string,
    universityID: string,
    accountStatus: AccountStatus = 'ACTIVE',
    createdAt?: string
  ) {
    super(userID, name, email, passwordHash, phone, 'STUDENT', accountStatus, createdAt);
    this.#universityID = universityID;
  }

  public get universityID(): string {
    return this.#universityID;
  }

  public setUniversityID(newId: string): void {
    if (!newId.trim()) throw new Error('University ID cannot be empty.');
    this.#universityID = newId.trim();
  }

  // --- Polymorphic Method Implementations ---
  public override getRoleDisplayName(): string {
    return 'iTECH Student';
  }

  public override canManageAllPosts(): boolean {
    return false; // Students can only manage their own posts
  }

  public override canAccessAdminPortal(): boolean {
    return false;
  }

  public override getIdentifier(): string {
    return this.#universityID;
  }

  /**
   * Crucial Ownership Rule:
   * A Student can ONLY edit, delete, or resolve a post if they own it!
   */
  public override canModifyPost(postOwnerID: string): boolean {
    return this.userID === postOwnerID;
  }

  public override toDTO(): UserDTO {
    const base = super.toDTO();
    return {
      ...base,
      universityID: this.#universityID,
    };
  }

  public static fromDTO(dto: UserDTO): Student {
    return new Student(
      dto.userID,
      dto.name,
      dto.email,
      dto.passwordHash,
      dto.phone,
      dto.universityID || 'IT-STUDENT',
      dto.accountStatus,
      dto.createdAt
    );
  }
}
