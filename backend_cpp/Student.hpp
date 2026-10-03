/**
 * ============================================================================
 * iTECH Lost & Found Management System - C++ Backend Engine
 * Class: Student (Inherits from User)
 * Principles: Inheritance, Polymorphism, Access Control
 * ============================================================================
 */

#ifndef STUDENT_HPP
#define STUDENT_HPP

#include "User.hpp"

namespace itech {

class Student : public User {
private:
    std::string m_universityID; // e.g. "IT-2023-0492"

public:
    Student(const std::string& id, const std::string& name, const std::string& email,
            const std::string& pwdHash, const std::string& phone,
            const std::string& universityID, AccountStatus status = AccountStatus::ACTIVE,
            const std::string& createdAt = "");

    std::string getUniversityID() const { return m_universityID; }
    void setUniversityID(const std::string& uniID);

    // Overridden Polymorphic Methods
    std::string getRoleDisplayName() const override { return "iTECH Student"; }
    bool canManageAllPosts() const override { return false; }
    bool canAccessAdminPortal() const override { return false; }

    /**
     * Strict Student Ownership Rule:
     * Student can ONLY modify a post if their ID matches the owner ID.
     */
    bool canModifyPost(const std::string& postOwnerID) const override {
        return m_userID == postOwnerID;
    }

    void printProfile() const override;
};

} // namespace itech

#endif // STUDENT_HPP
