package com.itech.lostfound.model;

import java.time.LocalDateTime;

/**
 * ============================================================================
 * iTECH Lost & Found Management System - Java OOP Backend
 * Class: Report (Moderation Entity)
 * ============================================================================
 */
public class Report {
    private final String reportID;
    private final String postID;
    private final String postTitle;
    private final String reporterID;
    private final String reporterName;
    private final String reason;
    private final String details;
    private final LocalDateTime reportDate;
    private String status; // "PENDING", "RESOLVED", "DISMISSED"

    public Report(String reportID, String postID, String postTitle, String reporterID,
                  String reporterName, String reason, String details) {
        this.reportID = reportID;
        this.postID = postID;
        this.postTitle = postTitle;
        this.reporterID = reporterID;
        this.reporterName = reporterName;
        this.reason = reason;
        this.details = details != null ? details : "";
        this.reportDate = LocalDateTime.now();
        this.status = "PENDING";
    }

    public String getReportID() { return reportID; }
    public String getPostID() { return postID; }
    public String getPostTitle() { return postTitle; }
    public String getReporterID() { return reporterID; }
    public String getReporterName() { return reporterName; }
    public String getReason() { return reason; }
    public String getDetails() { return details; }
    public LocalDateTime getReportDate() { return reportDate; }
    public String getStatus() { return status; }

    public void resolve() { this.status = "RESOLVED"; }
    public void dismiss() { this.status = "DISMISSED"; }
}
