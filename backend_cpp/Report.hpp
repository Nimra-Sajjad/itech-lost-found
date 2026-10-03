/**
 * ============================================================================
 * iTECH Lost & Found Management System - C++ Backend Engine
 * Class: Report
 * Purpose: Moderation entity for suspicious/inappropriate posts
 * ============================================================================
 */

#ifndef REPORT_HPP
#define REPORT_HPP

#include <string>
#include <iostream>

namespace itech {

enum class ReportStatus {
    PENDING,
    RESOLVED,
    DISMISSED
};

class Report {
private:
    std::string m_reportID;
    std::string m_postID;
    std::string m_postTitle;
    std::string m_reporterID;
    std::string m_reporterName;
    std::string m_reason;
    std::string m_details;
    std::string m_reportDate;
    ReportStatus m_status;

public:
    Report(const std::string& repID, const std::string& postID, const std::string& title,
           const std::string& repUserID, const std::string& repName, const std::string& reason,
           const std::string& details = "", const std::string& date = "",
           ReportStatus status = ReportStatus::PENDING)
        : m_reportID(repID), m_postID(postID), m_postTitle(title),
          m_reporterID(repUserID), m_reporterName(repName), m_reason(reason),
          m_details(details), m_reportDate(date), m_status(status) {}

    std::string getReportID() const { return m_reportID; }
    std::string getPostID() const { return m_postID; }
    std::string getPostTitle() const { return m_postTitle; }
    std::string getReporterName() const { return m_reporterName; }
    std::string getReason() const { return m_reason; }
    std::string getDetails() const { return m_details; }
    std::string getReportDate() const { return m_reportDate; }
    ReportStatus getStatus() const { return m_status; }

    void resolve() { m_status = ReportStatus::RESOLVED; }
    void dismiss() { m_status = ReportStatus::DISMISSED; }
};

} // namespace itech

#endif // REPORT_HPP
