/**
 * ============================================================================
 * iTECH Lost & Found Management System - C++ Backend Engine
 * Class: LostFoundPost (Abstract Base Class for Items)
 * Principles: Encapsulation, Abstraction, Polymorphism
 * ============================================================================
 */

#ifndef LOSTFOUNDPOST_HPP
#define LOSTFOUNDPOST_HPP

#include <string>
#include <iostream>
#include <algorithm>

namespace itech {

enum class PostType {
    LOST,
    FOUND
};

enum class PostStatus {
    ACTIVE,
    RESOLVED
};

class LostFoundPost {
protected:
    std::string m_postID;
    std::string m_ownerID;
    std::string m_ownerName;
    std::string m_ownerEmail;
    PostType m_type;
    std::string m_itemName;
    std::string m_image;
    std::string m_location;
    std::string m_incidentDate;
    std::string m_approximateTime;
    std::string m_contactNumber;
    std::string m_details;
    std::string m_postedAt;
    PostStatus m_status;

public:
    LostFoundPost(const std::string& postID, const std::string& ownerID,
                  const std::string& ownerName, const std::string& ownerEmail,
                  PostType type, const std::string& itemName,
                  const std::string& image, const std::string& location,
                  const std::string& incidentDate, const std::string& approxTime,
                  const std::string& contact, const std::string& details,
                  const std::string& postedAt, PostStatus status = PostStatus::ACTIVE);

    virtual ~LostFoundPost() = default;

    // Getters
    std::string getPostID() const { return m_postID; }
    std::string getOwnerID() const { return m_ownerID; }
    std::string getOwnerName() const { return m_ownerName; }
    std::string getOwnerEmail() const { return m_ownerEmail; }
    PostType getType() const { return m_type; }
    std::string getItemName() const { return m_itemName; }
    std::string getImage() const { return m_image; }
    std::string getLocation() const { return m_location; }
    std::string getIncidentDate() const { return m_incidentDate; }
    std::string getApproximateTime() const { return m_approximateTime; }
    std::string getContactNumber() const { return m_contactNumber; }
    std::string getDetails() const { return m_details; }
    std::string getPostedAt() const { return m_postedAt; }
    PostStatus getStatus() const { return m_status; }
    bool isResolved() const { return m_status == PostStatus::RESOLVED; }

    // State transition
    void markResolved() { m_status = PostStatus::RESOLVED; }
    void reopen() { m_status = PostStatus::ACTIVE; }

    // Update fields (Encapsulated)
    void updateItemName(const std::string& name);
    void updateLocation(const std::string& loc);
    void updateDetails(const std::string& det) { m_details = det; }
    void updateContact(const std::string& contact) { m_contactNumber = contact; }
    void updateImage(const std::string& img) { m_image = img; }

    // Search helper
    bool matchesQuery(const std::string& query) const;

    // Pure virtual methods (Polymorphism)
    virtual std::string getTypeString() const = 0;
    virtual std::string getBadgeColorCode() const = 0;
    virtual void printSummary() const = 0;
};

// Derived Class: LostPost
class LostPost : public LostFoundPost {
public:
    LostPost(const std::string& postID, const std::string& ownerID,
             const std::string& ownerName, const std::string& ownerEmail,
             const std::string& itemName, const std::string& image,
             const std::string& location, const std::string& incidentDate,
             const std::string& approxTime, const std::string& contact,
             const std::string& details, const std::string& postedAt,
             PostStatus status = PostStatus::ACTIVE);

    std::string getTypeString() const override { return "LOST"; }
    std::string getBadgeColorCode() const override { return "#A82024"; /* iTECH Crimson */ }
    void printSummary() const override;
};

// Derived Class: FoundPost
class FoundPost : public LostFoundPost {
public:
    FoundPost(const std::string& postID, const std::string& ownerID,
              const std::string& ownerName, const std::string& ownerEmail,
              const std::string& itemName, const std::string& image,
              const std::string& location, const std::string& incidentDate,
              const std::string& approxTime, const std::string& contact,
              const std::string& details, const std::string& postedAt,
              PostStatus status = PostStatus::ACTIVE);

    std::string getTypeString() const override { return "FOUND"; }
    std::string getBadgeColorCode() const override { return "#16325C"; /* iTECH Navy */ }
    void printSummary() const override;
};

} // namespace itech

#endif // LOSTFOUNDPOST_HPP
