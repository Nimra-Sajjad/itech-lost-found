package com.itech.lostfound.model;

/**
 * ============================================================================
 * iTECH Lost & Found Management System - Java OOP Backend
 * Class: Post (Abstract Base Class for Items)
 * Principles: Encapsulation, Abstraction, Polymorphism
 * ============================================================================
 */
public abstract class Post {
    private final String postID;
    private final String ownerID;
    private final String ownerName;
    private final String ownerEmail;
    private final String type; // "LOST" or "FOUND"
    private String itemName;
    private String image;
    private String location;
    private String incidentDate;
    private String approximateTime;
    private String contactNumber;
    private String details;
    private final String postedAt;
    private String status; // "ACTIVE" or "RESOLVED"

    public Post(String postID, String ownerID, String ownerName, String ownerEmail,
                String type, String itemName, String image, String location,
                String incidentDate, String approximateTime, String contactNumber,
                String details, String postedAt, String status) {
        if (itemName == null || itemName.trim().isEmpty()) {
            throw new IllegalArgumentException("Please enter an item name.");
        }
        if (location == null || location.trim().isEmpty()) {
            throw new IllegalArgumentException("Please provide the location.");
        }

        this.postID = postID;
        this.ownerID = ownerID;
        this.ownerName = ownerName;
        this.ownerEmail = ownerEmail;
        this.type = type;
        this.itemName = itemName.trim();
        this.image = image;
        this.location = location.trim();
        this.incidentDate = incidentDate;
        this.approximateTime = approximateTime;
        this.contactNumber = contactNumber;
        this.details = details != null ? details : "";
        this.postedAt = postedAt;
        this.status = status != null ? status : "ACTIVE";
    }

    // Getters
    public String getPostID() { return postID; }
    public String getOwnerID() { return ownerID; }
    public String getOwnerName() { return ownerName; }
    public String getOwnerEmail() { return ownerEmail; }
    public String getType() { return type; }
    public String getItemName() { return itemName; }
    public String getImage() { return image; }
    public String getLocation() { return location; }
    public String getIncidentDate() { return incidentDate; }
    public String getApproximateTime() { return approximateTime; }
    public String getContactNumber() { return contactNumber; }
    public String getDetails() { return details; }
    public String getPostedAt() { return postedAt; }
    public String getStatus() { return status; }
    public boolean isResolved() { return "RESOLVED".equals(status); }

    // Encapsulated state mutations
    public void markResolved() { this.status = "RESOLVED"; }
    public void reopen() { this.status = "ACTIVE"; }

    public void update(String itemName, String location, String details, String contactNumber) {
        if (itemName != null && !itemName.trim().isEmpty()) this.itemName = itemName.trim();
        if (location != null && !location.trim().isEmpty()) this.location = location.trim();
        if (details != null) this.details = details;
        if (contactNumber != null) this.contactNumber = contactNumber;
    }

    public boolean matchesQuery(String query) {
        if (query == null || query.trim().isEmpty()) return true;
        String q = query.toLowerCase().trim();
        return (itemName.toLowerCase().contains(q) ||
                location.toLowerCase().contains(q) ||
                details.toLowerCase().contains(q));
    }

    // Abstract polymorphic methods
    public abstract String getCategoryBadgeColor();
    public abstract String getActionPrompt();
    public abstract void displayCard();
}
