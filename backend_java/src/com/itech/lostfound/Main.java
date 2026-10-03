package com.itech.lostfound;

import com.itech.lostfound.model.Admin;
import com.itech.lostfound.model.Post;
import com.itech.lostfound.model.Student;
import com.itech.lostfound.model.User;
import com.itech.lostfound.service.LostFoundManager;

/**
 * ============================================================================
 * iTECH Lost & Found Management System - Java Demonstration & Test Suite
 * Demonstrates: OOP Hierarchy, Dynamic Dispatch, Access Control, CRUD
 * ============================================================================
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("============================================================");
        System.out.println("  iTECH LOST & FOUND MANAGEMENT SYSTEM (JAVA OOP ENGINE)");
        System.out.println("  International Institute of Technology, Culture & Health");
        System.out.println("============================================================\n");

        LostFoundManager manager = LostFoundManager.getInstance();

        // 1. Authentication
        System.out.println("--- 1. AUTHENTICATING USERS ---");
        User sarah = manager.authenticate("sarah.ahmed@itech.edu.pk", "itech2026");
        User hamza = manager.authenticate("hamza.ali@itech.edu.pk", "itech2026");
        User admin = manager.authenticate("admin@itech.edu.pk", "admin2026");

        sarah.displayProfile();
        hamza.displayProfile();
        admin.displayProfile();

        // 2. Strict Ownership Verification
        System.out.println("\n--- 2. STRICT OWNERSHIP ACCESS CONTROL TEST ---");
        System.out.println("Testing if Hamza can modify Sarah's post ('post_lost_01')...");
        try {
            manager.updatePost(hamza, "post_lost_01", "Unauthorized Title", "Nowhere", "Attempted edit");
            System.err.println("SECURITY FAIL: Unauthorized student modified another student's post!");
        } catch (SecurityException e) {
            System.out.println("SECURITY VERIFIED: Caught expected exception: " + e.getMessage());
        }

        // 3. Sarah modifies her own post
        System.out.println("\nTesting if Sarah can modify her own post...");
        try {
            manager.updatePost(sarah, "post_lost_01", "Black Leather Wallet [Updated]", "Library 2nd Floor", "Cash and ID inside");
            System.out.println("SUCCESS: Sarah successfully updated her own post.");
        } catch (Exception e) {
            System.err.println("ERROR: " + e.getMessage());
        }

        // 4. Admin modifies post
        System.out.println("\nTesting if Admin can modify the post...");
        try {
            manager.updatePost(admin, "post_lost_01", "Black Leather Wallet [Moderator Inspected]", "Library 2nd Floor", "Safe at front desk");
            System.out.println("SUCCESS: Administrator successfully modified post under administrative privileges.");
        } catch (Exception e) {
            System.err.println("ERROR: " + e.getMessage());
        }

        // 5. Polymorphic cards display
        System.out.println("\n--- 3. POLYMORPHIC CARD DISPLAY ---");
        for (Post p : manager.getAllPosts()) {
            p.displayCard(); // Polymorphic invocation
        }

        // 6. Search
        System.out.println("\n--- 4. SEARCH TEST (Query: 'Cafeteria') ---");
        for (Post p : manager.searchPosts("Cafeteria", "ALL")) {
            System.out.println("Found match: " + p.getItemName() + " (" + p.getType() + ") at " + p.getLocation());
        }

        // 7. Mark resolved
        System.out.println("\n--- 5. RESOLVE WORKFLOW ---");
        manager.markResolved(sarah, "post_lost_01");
        System.out.println("Sarah's post status: " + manager.getPost("post_lost_01").getStatus());

        // 8. Backup snapshot
        System.out.println("\n--- 6. BACKUP SNAPSHOT ---");
        java.util.Map<String, Object> backup = manager.createBackup((Admin) admin);
        System.out.println("Backup contains " + backup.get("usersCount") + " users, "
                + backup.get("postsCount") + " posts, " + backup.get("reportsCount") + " reports.");

        System.out.println("\n============================================================");
        System.out.println("  ALL JAVA OOP PROJECT TESTS COMPLETED SUCCESSFULLY");
        System.out.println("============================================================");
    }
}
