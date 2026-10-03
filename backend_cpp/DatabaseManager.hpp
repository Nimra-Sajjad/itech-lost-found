/**
 * ============================================================================
 * iTECH Lost & Found Management System - C++ Backend Engine
 * Class: DatabaseManager (Singleton & Facade Pattern)
 * Principle: Encapsulation of CRUD, Polymorphic Storage, Ownership Validation
 * ============================================================================
 */

#ifndef DATABASEMANAGER_HPP
#define DATABASEMANAGER_HPP

#include "User.hpp"
#include "Student.hpp"
#include "Admin.hpp"
#include "LostFoundPost.hpp"
#include "Report.hpp"

#include <vector>
#include <memory>
#include <map>
#include <stdexcept>

namespace itech {

class DatabaseManager {
private:
    std::map<std::string, std::shared_ptr<User>> m_users;
    std::map<std::string, std::shared_ptr<LostFoundPost>> m_posts;
    std::vector<std::shared_ptr<Report>> m_reports;

    DatabaseManager(); // Private constructor for Singleton

public:
    static DatabaseManager& getInstance();

    // Prevent copying
    DatabaseManager(const DatabaseManager&) = delete;
    DatabaseManager& operator=(const DatabaseManager&) = delete;

    void seedInitialData();

    // User Operations
    void addUser(std::shared_ptr<User> user);
    std::shared_ptr<User> authenticate(const std::string& email, const std::string& rawPassword);
    std::shared_ptr<User> getUserByID(const std::string& userID);
    std::vector<std::shared_ptr<Student>> getAllStudents() const;

    // Post CRUD Operations with Strict Ownership Enforcement
    void createPost(std::shared_ptr<User> actor, std::shared_ptr<LostFoundPost> post);
    std::shared_ptr<LostFoundPost> getPostByID(const std::string& postID);
    void updatePost(std::shared_ptr<User> actor, const std::string& postID,
                    const std::string& newName, const std::string& newLoc, const std::string& newDetails);
    void deletePost(std::shared_ptr<User> actor, const std::string& postID);
    void markPostResolved(std::shared_ptr<User> actor, const std::string& postID);

    // Query & Filtering
    std::vector<std::shared_ptr<LostFoundPost>> getAllPosts() const;
    std::vector<std::shared_ptr<LostFoundPost>> getLostPosts() const;
    std::vector<std::shared_ptr<LostFoundPost>> getFoundPosts() const;
    std::vector<std::shared_ptr<LostFoundPost>> searchPosts(const std::string& query, const std::string& filterType = "ALL") const;
    std::vector<std::shared_ptr<LostFoundPost>> getPostsByOwner(const std::string& ownerID) const;

    // Moderation & Backup
    void fileReport(std::shared_ptr<Report> report);
    std::vector<std::shared_ptr<Report>> getAllReports() const { return m_reports; }
    void createBackupJSON(const std::string& filePath) const;
    void printSystemStats() const;
};

} // namespace itech

#endif // DATABASEMANAGER_HPP
