package com.itech.lostfound.model;

/**
 * ============================================================================
 * iTECH Lost & Found Management System - Java OOP Backend
 * Class: Admin (Subclass of User)
 * Principles: Inheritance, Polymorphism, Role-Based Access Control
 * ============================================================================
 */
public class Admin extends User {
    private final String department;
    private final int accessLevel;

    public Admin(String userID, String name, String email, String passwordHash, String phone, String department, int accessLevel) {
        super(userID, name, email, passwordHash, phone, "ADMIN");
        this.department = department != null ? department : "Campus Security & Student Affairs";
        this.accessLevel = accessLevel;
    }

    public String getDepartment() {
        return department;
    }

    public int getAccessLevel() {
        return accessLevel;
    }

    // --- Polymorphic Implementations ---
    @Override
    public String getRoleDisplayName() {
        return "System Administrator";
    }

    @Override
    public boolean canManageAllPosts() {
        return true;
    }

    @Override
    public boolean canAccessAdminPortal() {
        return true;
    }

    @Override
    public boolean canModifyPost(String postOwnerID) {
        return true; // Admin can modify any post
    }

    @Override
    public void displayProfile() {
        System.out.printf("[ADMIN] %s | Dept: %s | Email: %s | Access Level: %d%n",
                getName(), department, getEmail(), accessLevel);
    }
}
