/**
 * OOP Demonstration: Derived Subclass (Inheritance & Polymorphism)
 * Admin extends User
 */

import { User } from './User';
import { AccountStatus, UserDTO } from './types';

export class Admin extends User {
  #department: string;
  #accessLevel: number; // 1 = standard admin, 2 = super admin

  constructor(
    userID: string,
    name: string,
    email: string,
    passwordHash: string,
    phone: string,
    department: string = 'Campus Security & Student Affairs',
    accessLevel: number = 2,
    accountStatus: AccountStatus = 'ACTIVE',
    createdAt?: string
  ) {
    super(userID, name, email, passwordHash, phone, 'ADMIN', accountStatus, createdAt);
    this.#department = department;
    this.#accessLevel = accessLevel;
  }

  public get department(): string {
    return this.#department;
  }

  public get accessLevel(): number {
    return this.#accessLevel;
  }

  // --- Polymorphic Method Implementations ---
  public override getRoleDisplayName(): string {
    return 'System Administrator';
  }

  public override canManageAllPosts(): boolean {
    return true; // Admin has systemic authorization to edit/delete any post
  }

  public override canAccessAdminPortal(): boolean {
    return true;
  }

  public override getIdentifier(): string {
    return `ADMIN-${this.#department}`;
  }

  /**
   * Systemic Access: Admins can modify any post
   */
  public override canModifyPost(_postOwnerID: string): boolean {
    return true;
  }

  public override toDTO(): UserDTO {
    const base = super.toDTO();
    return {
      ...base,
      department: this.#department,
      accessLevel: this.#accessLevel,
    };
  }

  public static fromDTO(dto: UserDTO): Admin {
    return new Admin(
      dto.userID,
      dto.name,
      dto.email,
      dto.passwordHash,
      dto.phone,
      dto.department || 'Campus Security & Student Affairs',
      dto.accessLevel ?? 2,
      dto.accountStatus,
      dto.createdAt
    );
  }
}
