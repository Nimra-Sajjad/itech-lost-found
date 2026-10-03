package com.itech.lostfound.model;

import java.time.LocalDateTime;

/**
 * ============================================================================
 * iTECH Lost & Found Management System - Java OOP Backend
 * Class: User (Abstract Base Class)
 * Principles: Abstraction, Encapsulation, Polymorphism
 * ============================================================================
 */
public abstract class User {
    // Encapsulated private fields
    private final String userID;
    private String name;
    private final String email;
    private String passwordHash;
    private String phone;
    private final String role; // "STUDENT" or "ADMIN"
    private boolean active;
    private final LocalDateTime createdAt;

    public User(String userID, String name, String email, String passwordHash, String phone, String role) {
        if (userID == null || userID.trim().isEmpty()) throw new IllegalArgumentException("User ID is required.");
        if (email == null || email.trim().isEmpty()) throw new IllegalArgumentException("Email is required.");
        this.userID = userID.trim();
        this.name = name != null ? name.trim() : "";
        this.email = email.trim().toLowerCase();
        this.passwordHash = passwordHash;
        this.phone = phone != null ? phone.trim() : "";
        this.role = role;
        this.active = true;
        this.createdAt = LocalDateTime.now();
    }

    // --- Getters (Encapsulation) ---
    public String getUserID() { return userID; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getRole() { return role; }
    public boolean isActive() { return active; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // --- Setters with Encapsulation & Validation ---
    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) throw new IllegalArgumentException("Name cannot be empty.");
        this.name = name.trim();
    }

    public void setPhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) throw new IllegalArgumentException("Phone cannot be empty.");
        this.phone = phone.trim();
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public boolean verifyPassword(String candidateHash) {
        return this.passwordHash != null && this.passwordHash.equals(candidateHash);
    }

    // --- Abstract Methods (Polymorphism & Abstraction) ---
    public abstract String getRoleDisplayName();
    public abstract boolean canManageAllPosts();
    public abstract boolean canAccessAdminPortal();
    public abstract boolean canModifyPost(String postOwnerID);
    public abstract void displayProfile();
}
