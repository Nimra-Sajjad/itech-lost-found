/**
 * ============================================================================
 * iTECH Lost & Found Management System - C++ Backend Engine
 * Class: User (Abstract Base Class)
 * Principles: Abstraction, Encapsulation, Polymorphism
 * ============================================================================
 */

#ifndef USER_HPP
#define USER_HPP

#include <string>
#include <iostream>
#include <memory>

namespace itech {

enum class UserRole {
    STUDENT,
    ADMIN
};

enum class AccountStatus {
    ACTIVE,
    DISABLED
};

class User {
protected:
    // Encapsulated data members
    std::string m_userID;
    std::string m_name;
    std::string m_email;
    std::string m_passwordHash;
    std::string m_phone;
    UserRole m_role;
    AccountStatus m_status;
    std::string m_createdAt;

public:
    User(const std::string& id, const std::string& name, const std::string& email,
         const std::string& pwdHash, const std::string& phone, UserRole role,
         AccountStatus status = AccountStatus::ACTIVE, const std::string& createdAt = "");

    virtual ~User() = default;

    // Getters (Encapsulation)
    std::string getUserID() const { return m_userID; }
    std::string getName() const { return m_name; }
    std::string getEmail() const { return m_email; }
    std::string getPhone() const { return m_phone; }
    UserRole getRole() const { return m_role; }
    AccountStatus getStatus() const { return m_status; }
    std::string getCreatedAt() const { return m_createdAt; }
    bool isActive() const { return m_status == AccountStatus::ACTIVE; }

    // Setters with Encapsulation & Validation
    void setName(const std::string& name);
    void setPhone(const std::string& phone);
    void setStatus(AccountStatus status) { m_status = status; }
    void setPasswordHash(const std::string& hash) { m_passwordHash = hash; }
    bool verifyPassword(const std::string& candidateHash) const {
        return m_passwordHash == candidateHash;
    }

    // Pure virtual methods (Polymorphism & Abstraction)
    virtual std::string getRoleDisplayName() const = 0;
    virtual bool canManageAllPosts() const = 0;
    virtual bool canAccessAdminPortal() const = 0;
    virtual bool canModifyPost(const std::string& postOwnerID) const = 0;
    virtual void printProfile() const = 0;
};

} // namespace itech

#endif // USER_HPP
