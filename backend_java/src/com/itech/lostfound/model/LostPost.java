package com.itech.lostfound.model;

/**
 * ============================================================================
 * iTECH Lost & Found Management System - Java OOP Backend
 * Class: LostPost (Derived from Post)
 * ============================================================================
 */
public class LostPost extends Post {
    public LostPost(String postID, String ownerID, String ownerName, String ownerEmail,
                    String itemName, String image, String location,
                    String incidentDate, String approximateTime, String contactNumber,
                    String details, String postedAt, String status) {
        super(postID, ownerID, ownerName, ownerEmail, "LOST", itemName, image, location,
              incidentDate, approximateTime, contactNumber, details, postedAt, status);
    }

    @Override
    public String getCategoryBadgeColor() {
        return "#A82024"; // iTECH Crimson
    }

    @Override
    public String getActionPrompt() {
        return "Found this item? Contact Owner";
    }

    @Override
    public void displayCard() {
        System.out.printf("[LOST CARD] %s | Location: %s | Incident: %s %s | Posted: %s | Status: %s%n",
                getItemName(), getLocation(), getIncidentDate(), getApproximateTime(), getPostedAt(), getStatus());
    }
}
