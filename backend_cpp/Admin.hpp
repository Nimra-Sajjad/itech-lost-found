/**
 * ============================================================================
 * iTECH Lost & Found Management System - C++ Backend Engine
 * Class: Admin (Inherits from User)
 * Principles: Inheritance, Polymorphism, System Administration Privileges
 * ============================================================================
 */

#ifndef ADMIN_HPP
#define ADMIN_HPP

#include "User.hpp"

namespace itech {

class Admin : public User {
private:
    std::string m_department;
    int m_accessLevel;

public:
    Admin(const std::string& id, const std::string& name, const std::string& email,
          const std::string& pwdHash, const std::string& phone,
          const std::string& department = "Campus Security & Student Affairs",
          int accessLevel = 2, AccountStatus status = AccountStatus::ACTIVE,
          const std::string& createdAt = "");

    std::string getDepartment() const { return m_department; }
    int getAccessLevel() const { return m_accessLevel; }

    // Overridden Polymorphic Methods
    std::string getRoleDisplayName() const override { return "System Administrator"; }
    bool canManageAllPosts() const override { return true; }
    bool canAccessAdminPortal() const override { return true; }

    /**
     * Admin has systemic authorization to modify any post
     */
    bool canModifyPost(const std::string& /*postOwnerID*/) const override {
        return true;
    }

    void printProfile() const override;
};

} // namespace itech

#endif // ADMIN_HPP
