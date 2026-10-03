package com.itech.lostfound.model;

/**
 * ============================================================================
 * iTECH Lost & Found Management System - Java OOP Backend
 * Class: Student (Subclass of User)
 * Principles: Inheritance, Polymorphism, Strict Post Ownership Rule
 * ============================================================================
 */
public class Student extends User {
    private String universityID; // e.g. "IT-2023-0492"

    public Student(String userID, String name, String email, String passwordHash, String phone, String universityID) {
        super(userID, name, email, passwordHash, phone, "STUDENT");
        this.universityID = universityID;
    }

    public String getUniversityID() {
        return universityID;
    }

    public void setUniversityID(String universityID) {
        if (universityID == null || universityID.trim().isEmpty()) {
            throw new IllegalArgumentException("University ID cannot be empty.");
        }
        this.universityID = universityID.trim();
    }

    // --- Polymorphic Implementations ---
    @Override
    public String getRoleDisplayName() {
        return "iTECH Student";
    }

    @Override
    public boolean canManageAllPosts() {
        return false;
    }

    @Override
    public boolean canAccessAdminPortal() {
        return false;
    }

    /**
     * Strict Student Ownership Rule:
     * A student can ONLY edit, delete, or resolve posts they personally created!
     */
    @Override
    public boolean canModifyPost(String postOwnerID) {
        return getUserID().equals(postOwnerID);
    }

    @Override
    public void displayProfile() {
        System.out.printf("[STUDENT] %s (ID: %s) | Email: %s | Phone: %s | Status: %s%n",
                getName(), universityID, getEmail(), getPhone(), isActive() ? "Active" : "Disabled");
    }
}
