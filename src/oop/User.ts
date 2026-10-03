/**
 * OOP Demonstration: Abstract Base Class
 * Demonstrates: Encapsulation, Abstraction, Polymorphism
 */

import { UserRole, AccountStatus, UserDTO } from './types';

export abstract class User {
  // Encapsulated private fields
  #userID: string;
  #name: string;
  #email: string;
  #passwordHash: string;
  #phone: string;
  #role: UserRole;
  #accountStatus: AccountStatus;
  #createdAt: string;

  constructor(
    userID: string,
    name: string,
    email: string,
    passwordHash: string,
    phone: string,
    role: UserRole,
    accountStatus: AccountStatus = 'ACTIVE',
    createdAt?: string
  ) {
    this.#userID = userID;
    this.#name = name;
    this.#email = email;
    this.#passwordHash = passwordHash;
    this.#phone = phone;
    this.#role = role;
    this.#accountStatus = accountStatus;
    this.#createdAt = createdAt || new Date().toISOString();
  }

  // --- Getters (Encapsulation) ---
  public get userID(): string {
    return this.#userID;
  }

  public get name(): string {
    return this.#name;
  }

  public get email(): string {
    return this.#email;
  }

  public get phone(): string {
    return this.#phone;
  }

  public get role(): UserRole {
    return this.#role;
  }

  public get accountStatus(): AccountStatus {
    return this.#accountStatus;
  }

  public get createdAt(): string {
    return this.#createdAt;
  }

  public isActive(): boolean {
    return this.#accountStatus === 'ACTIVE';
  }

  // --- Setters with validation (Encapsulation) ---
  public updateProfile(name: string, phone: string): void {
    if (!name.trim()) throw new Error('Name cannot be empty.');
    if (!phone.trim()) throw new Error('Phone cannot be empty.');
    this.#name = name.trim();
    this.#phone = phone.trim();
  }

  public setAccountStatus(status: AccountStatus): void {
    this.#accountStatus = status;
  }

  public setPasswordHash(newHash: string): void {
    if (!newHash) throw new Error('Password hash cannot be empty.');
    this.#passwordHash = newHash;
  }

  public verifyPasswordHash(candidateHash: string): boolean {
    return this.#passwordHash === candidateHash;
  }

  // --- Abstract Methods (Polymorphism & Abstraction) ---
  public abstract getRoleDisplayName(): string;
  public abstract canManageAllPosts(): boolean;
  public abstract canAccessAdminPortal(): boolean;
  public abstract getIdentifier(): string;
  public abstract canModifyPost(postOwnerID: string): boolean;

  // Serialization to Plain Data Object (DTO)
  public toDTO(): UserDTO {
    return {
      userID: this.#userID,
      name: this.#name,
      email: this.#email,
      passwordHash: this.#passwordHash,
      phone: this.#phone,
      role: this.#role,
      accountStatus: this.#accountStatus,
      createdAt: this.#createdAt,
    };
  }
}
