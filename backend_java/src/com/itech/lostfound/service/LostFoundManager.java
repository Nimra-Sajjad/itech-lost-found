package com.itech.lostfound.service;

import com.itech.lostfound.model.*;
import com.itech.lostfound.util.PasswordHasher;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * ============================================================================
 * iTECH Lost & Found Management System - Java OOP Service Layer
 * Principles: Facade, Encapsulation of CRUD, Ownership Enforcement, RBAC
 * ============================================================================
 */
public class LostFoundManager {
    private static LostFoundManager instance;

    private final Map<String, User> userStore = new LinkedHashMap<>();
    private final Map<String, Post> postStore = new LinkedHashMap<>();
    private final List<Report> reportStore = new ArrayList<>();

    private LostFoundManager() {
        seedDemoData();
    }

    public static synchronized LostFoundManager getInstance() {
        if (instance == null) {
            instance = new LostFoundManager();
        }
        return instance;
    }

    private void seedDemoData() {
        // Admin
        Admin admin = new Admin("usr_admin_01", "Dr. Tariq Mahmood", "admin@itech.edu.pk",
                PasswordHasher.sha256("admin2026"), "+92 300 8472910", "Campus Security & Student Affairs", 2);
        userStore.put(admin.getUserID(), admin);

        // Students
        Student s1 = new Student("usr_student_01", "Sarah Ahmed", "sarah.ahmed@itech.edu.pk",
                PasswordHasher.sha256("itech2026"), "+92 321 4455667", "IT-2023-0492");
        Student s2 = new Student("usr_student_02", "Hamza Ali", "hamza.ali@itech.edu.pk",
                PasswordHasher.sha256("itech2026"), "+92 333 9988771", "IT-2024-1108");
        userStore.put(s1.getUserID(), s1);
        userStore.put(s2.getUserID(), s2);

        // Initial Posts
        LostPost p1 = new LostPost("post_lost_01", s1.getUserID(), s1.getName(), s1.getEmail(),
                "Black Leather Wallet", "wallet.jpg", "Main Library, 2nd Floor",
                "2026-10-02", "04:15 PM", s1.getPhone(),
                "Black leather bifold wallet with student ID card.", "02 October 2026, 05:20 PM", "ACTIVE");
        postStore.put(p1.getPostID(), p1);

        FoundPost p2 = new FoundPost("post_found_01", s2.getUserID(), s2.getName(), s2.getEmail(),
                "Black Wireless Earphones Case", "earphones.jpg", "Central Cafeteria",
                "2026-10-03", "01:30 PM", s2.getPhone(),
                "Black charging case found on table 14.", "03 October 2026, 02:00 PM", "ACTIVE");
        postStore.put(p2.getPostID(), p2);
    }

    public User authenticate(String email, String rawPassword) {
        String candidateHash = PasswordHasher.sha256(rawPassword);
        for (User u : userStore.values()) {
            if (u.getEmail().equalsIgnoreCase(email.trim()) && u.verifyPassword(candidateHash)) {
                if (!u.isActive()) throw new IllegalStateException("Account deactivated.");
                return u;
            }
        }
        throw new IllegalArgumentException("Invalid login credentials.");
    }

    // CRUD: CREATE
    public void createPost(User actor, Post post) {
        if (actor == null) throw new SecurityException("User must be logged in.");
        if (post == null) throw new IllegalArgumentException("Post cannot be null.");
        postStore.put(post.getPostID(), post);
    }

    // CRUD: READ
    public Post getPost(String postID) {
        return postStore.get(postID);
    }

    public List<Post> getAllPosts() {
        return new ArrayList<>(postStore.values());
    }

    public List<Post> getLostPosts() {
        return postStore.values().stream()
                .filter(p -> "LOST".equals(p.getType()))
                .collect(Collectors.toList());
    }

    public List<Post> getFoundPosts() {
        return postStore.values().stream()
                .filter(p -> "FOUND".equals(p.getType()))
                .collect(Collectors.toList());
    }

    public List<Post> searchPosts(String query, String filter) {
        return postStore.values().stream()
                .filter(p -> {
                    if ("LOST".equals(filter) && !"LOST".equals(p.getType())) return false;
                    if ("FOUND".equals(filter) && !"FOUND".equals(p.getType())) return false;
                    if ("RESOLVED".equals(filter) && !p.isResolved()) return false;
                    return p.matchesQuery(query);
                })
                .collect(Collectors.toList());
    }

    // CRUD: UPDATE with Strict Ownership Rule
    public void updatePost(User actor, String postID, String newName, String newLoc, String newDetails) {
        Post post = postStore.get(postID);
        if (post == null) throw new NoSuchElementException("This post does not exist.");

        if (!actor.canModifyPost(post.getOwnerID())) {
            throw new SecurityException("You are not authorized to edit this post.");
        }

        post.update(newName, newLoc, newDetails, null);
    }

    // CRUD: DELETE with Strict Ownership Rule
    public void deletePost(User actor, String postID) {
        Post post = postStore.get(postID);
        if (post == null) throw new NoSuchElementException("This post does not exist.");

        if (!actor.canModifyPost(post.getOwnerID())) {
            throw new SecurityException("You are not authorized to delete this post.");
        }

        postStore.remove(postID);
    }

    // Mark as Resolved with Ownership Check
    public void markResolved(User actor, String postID) {
        Post post = postStore.get(postID);
        if (post == null) throw new NoSuchElementException("This post does not exist.");

        if (!actor.canModifyPost(post.getOwnerID())) {
            throw new SecurityException("You are not authorized to edit this post.");
        }

        post.markResolved();
    }

    // Moderation
    public void reportPost(User reporter, String postID, String reason, String details) {
        Post post = postStore.get(postID);
        if (post == null) throw new NoSuchElementException("Post not found.");
        Report report = new Report("rep_" + System.currentTimeMillis(), postID, post.getItemName(),
                reporter.getUserID(), reporter.getName(), reason, details);
        reportStore.add(report);
    }

    public List<Report> getAllReports() {
        return Collections.unmodifiableList(reportStore);
    }

    // Admin backup: a full snapshot of users, posts and reports
    public Map<String, Object> createBackup(Admin admin) {
        if (admin == null || !admin.canAccessAdminPortal()) throw new SecurityException("Access Denied");

        List<Map<String, Object>> users = new ArrayList<>();
        for (User u : userStore.values()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("userID", u.getUserID());
            m.put("name", u.getName());
            m.put("email", u.getEmail());
            m.put("phone", u.getPhone());
            m.put("role", u.getRole());
            m.put("active", u.isActive());
            m.put("createdAt", u.getCreatedAt().toString());
            users.add(m); // password hashes are intentionally not exported in the summary snapshot
        }

        List<Map<String, Object>> posts = new ArrayList<>();
        for (Post p : postStore.values()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("postID", p.getPostID());
            m.put("ownerID", p.getOwnerID());
            m.put("type", p.getType());
            m.put("itemName", p.getItemName());
            m.put("location", p.getLocation());
            m.put("incidentDate", p.getIncidentDate());
            m.put("details", p.getDetails());
            m.put("postedAt", p.getPostedAt());
            m.put("status", p.getStatus());
            posts.add(m);
        }

        List<Map<String, Object>> reports = new ArrayList<>();
        for (Report r : reportStore) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("reportID", r.getReportID());
            m.put("postID", r.getPostID());
            m.put("reporterID", r.getReporterID());
            m.put("reason", r.getReason());
            m.put("details", r.getDetails());
            m.put("reportDate", r.getReportDate().toString());
            m.put("status", r.getStatus());
            reports.add(m);
        }

        Map<String, Object> backup = new LinkedHashMap<>();
        backup.put("timestamp", LocalDateTime.now().toString());
        backup.put("university", "iTECH");
        backup.put("postsCount", posts.size());
        backup.put("usersCount", users.size());
        backup.put("reportsCount", reports.size());
        backup.put("users", users);
        backup.put("posts", posts);
        backup.put("reports", reports);
        return backup;
    }
}
