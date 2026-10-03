package com.itech.lostfound.model;

/**
 * ============================================================================
 * iTECH Lost & Found Management System - Java OOP Backend
 * Class: FoundPost (Derived from Post)
 * ============================================================================
 */
public class FoundPost extends Post {
    public FoundPost(String postID, String ownerID, String ownerName, String ownerEmail,
                     String itemName, String image, String location,
                     String incidentDate, String approximateTime, String contactNumber,
                     String details, String postedAt, String status) {
        super(postID, ownerID, ownerName, ownerEmail, "FOUND", itemName, image, location,
              incidentDate, approximateTime, contactNumber, details, postedAt, status);
    }

    @Override
    public String getCategoryBadgeColor() {
        return "#16325C"; // iTECH Navy
    }

    @Override
    public String getActionPrompt() {
        return "Is this your item? Contact Finder";
    }

    @Override
    public void displayCard() {
        System.out.printf("[FOUND CARD] %s | Location: %s | Incident: %s %s | Posted: %s | Status: %s%n",
                getItemName(), getLocation(), getIncidentDate(), getApproximateTime(), getPostedAt(), getStatus());
    }
}
