#include "User.hpp"
#include "Student.hpp"
#include "Admin.hpp"
#include "LostFoundPost.hpp"
#include "DatabaseManager.hpp"
#include "Sha256.hpp"

#include <algorithm>
#include <cctype>
#include <stdexcept>
#include <cstdio>
#include <iostream>
#include <fstream>
#include <iomanip>

namespace itech {

// Escapes quotes, backslashes and control characters for safe JSON output
static std::string jsonEscape(const std::string& in) {
    std::string out;
    for (unsigned char c : in) {
        switch (c) {
            case '"':  out += "\\\""; break;
            case '\\': out += "\\\\"; break;
            case '\n': out += "\\n"; break;
            case '\r': out += "\\r"; break;
            case '\t': out += "\\t"; break;
            default:
                if (c < 0x20) { char b[8]; std::snprintf(b, sizeof(b), "\\u%04x", c); out += b; }
                else out += static_cast<char>(c);
        }
    }
    return out;
}

// ==========================================
// User Implementation
// ==========================================
User::User(const std::string& id, const std::string& name, const std::string& email,
           const std::string& pwdHash, const std::string& phone, UserRole role,
           AccountStatus status, const std::string& createdAt)
    : m_userID(id), m_name(name), m_email(email), m_passwordHash(pwdHash),
      m_phone(phone), m_role(role), m_status(status), m_createdAt(createdAt) {
    if (m_createdAt.empty()) {
        m_createdAt = "2026-10-03 09:00:00";
    }
}

void User::setName(const std::string& name) {
    if (name.empty()) throw std::invalid_argument("Name cannot be empty.");
    m_name = name;
}

void User::setPhone(const std::string& phone) {
    if (phone.empty()) throw std::invalid_argument("Phone cannot be empty.");
    m_phone = phone;
}

// ==========================================
// Student Implementation
// ==========================================
Student::Student(const std::string& id, const std::string& name, const std::string& email,
                 const std::string& pwdHash, const std::string& phone,
                 const std::string& universityID, AccountStatus status,
                 const std::string& createdAt)
    : User(id, name, email, pwdHash, phone, UserRole::STUDENT, status, createdAt),
      m_universityID(universityID) {}

void Student::setUniversityID(const std::string& uniID) {
    if (uniID.empty()) throw std::invalid_argument("University ID cannot be empty.");
    m_universityID = uniID;
}

void Student::printProfile() const {
    std::cout << "[STUDENT PROFILE] " << m_name << " (" << m_universityID << ")\n"
              << "  Email: " << m_email << " | Phone: " << m_phone << "\n"
              << "  Status: " << (isActive() ? "ACTIVE" : "DISABLED") << "\n";
}

// ==========================================
// Admin Implementation
// ==========================================
Admin::Admin(const std::string& id, const std::string& name, const std::string& email,
             const std::string& pwdHash, const std::string& phone,
             const std::string& department, int accessLevel,
             AccountStatus status, const std::string& createdAt)
    : User(id, name, email, pwdHash, phone, UserRole::ADMIN, status, createdAt),
      m_department(department), m_accessLevel(accessLevel) {}

void Admin::printProfile() const {
    std::cout << "[ADMIN PROFILE] " << m_name << " - " << m_department << "\n"
              << "  Email: " << m_email << " | Access Level: " << m_accessLevel << "\n"
              << "  Status: " << (isActive() ? "ACTIVE" : "DISABLED") << "\n";
}

// ==========================================
// LostFoundPost Implementation
// ==========================================
LostFoundPost::LostFoundPost(const std::string& postID, const std::string& ownerID,
                             const std::string& ownerName, const std::string& ownerEmail,
                             PostType type, const std::string& itemName,
                             const std::string& image, const std::string& location,
                             const std::string& incidentDate, const std::string& approxTime,
                             const std::string& contact, const std::string& details,
                             const std::string& postedAt, PostStatus status)
    : m_postID(postID), m_ownerID(ownerID), m_ownerName(ownerName), m_ownerEmail(ownerEmail),
      m_type(type), m_itemName(itemName), m_image(image), m_location(location),
      m_incidentDate(incidentDate), m_approximateTime(approxTime),
      m_contactNumber(contact), m_details(details), m_postedAt(postedAt), m_status(status) {
    if (m_itemName.empty()) throw std::invalid_argument("Please enter an item name.");
    if (m_location.empty()) throw std::invalid_argument("Please provide the location.");
}

void LostFoundPost::updateItemName(const std::string& name) {
    if (name.empty()) throw std::invalid_argument("Item name cannot be empty.");
    m_itemName = name;
}

void LostFoundPost::updateLocation(const std::string& loc) {
    if (loc.empty()) throw std::invalid_argument("Location cannot be empty.");
    m_location = loc;
}

bool LostFoundPost::matchesQuery(const std::string& query) const {
    if (query.empty()) return true;
    std::string q = query;
    std::transform(q.begin(), q.end(), q.begin(), ::tolower);

    std::string name = m_itemName;
    std::transform(name.begin(), name.end(), name.begin(), ::tolower);

    std::string loc = m_location;
    std::transform(loc.begin(), loc.end(), loc.begin(), ::tolower);

    std::string det = m_details;
    std::transform(det.begin(), det.end(), det.begin(), ::tolower);

    return (name.find(q) != std::string::npos ||
            loc.find(q) != std::string::npos ||
            det.find(q) != std::string::npos);
}

// LostPost
LostPost::LostPost(const std::string& postID, const std::string& ownerID,
                   const std::string& ownerName, const std::string& ownerEmail,
                   const std::string& itemName, const std::string& image,
                   const std::string& location, const std::string& incidentDate,
                   const std::string& approxTime, const std::string& contact,
                   const std::string& details, const std::string& postedAt,
                   PostStatus status)
    : LostFoundPost(postID, ownerID, ownerName, ownerEmail, PostType::LOST,
                    itemName, image, location, incidentDate, approxTime,
                    contact, details, postedAt, status) {}

void LostPost::printSummary() const {
    std::cout << "[LOST] " << m_itemName << " | Loc: " << m_location
              << " | Incident: " << m_incidentDate << " " << m_approximateTime
              << " | Posted: " << m_postedAt
              << " | Status: " << (m_status == PostStatus::ACTIVE ? "ACTIVE" : "RESOLVED") << "\n";
}

// FoundPost
FoundPost::FoundPost(const std::string& postID, const std::string& ownerID,
                     const std::string& ownerName, const std::string& ownerEmail,
                     const std::string& itemName, const std::string& image,
                     const std::string& location, const std::string& incidentDate,
                     const std::string& approxTime, const std::string& contact,
                     const std::string& details, const std::string& postedAt,
                     PostStatus status)
    : LostFoundPost(postID, ownerID, ownerName, ownerEmail, PostType::FOUND,
                    itemName, image, location, incidentDate, approxTime,
                    contact, details, postedAt, status) {}

void FoundPost::printSummary() const {
    std::cout << "[FOUND] " << m_itemName << " | Loc: " << m_location
              << " | Incident: " << m_incidentDate << " " << m_approximateTime
              << " | Posted: " << m_postedAt
              << " | Status: " << (m_status == PostStatus::ACTIVE ? "ACTIVE" : "RESOLVED") << "\n";
}

// ==========================================
// DatabaseManager Implementation
// ==========================================
DatabaseManager::DatabaseManager() {
    seedInitialData();
}

DatabaseManager& DatabaseManager::getInstance() {
    static DatabaseManager instance;
    return instance;
}

void DatabaseManager::seedInitialData() {
    // Seed Admin
    auto admin = std::make_shared<Admin>(
        "usr_admin_01", "Dr. Tariq Mahmood", "admin@itech.edu.pk",
        sha256Hex("admin2026"), "+92 300 8472910", "Campus Security & Student Affairs"
    );
    addUser(admin);

    // Seed Students
    auto s1 = std::make_shared<Student>(
        "usr_student_01", "Sarah Ahmed", "sarah.ahmed@itech.edu.pk",
        sha256Hex("itech2026"), "+92 321 4455667", "IT-2023-0492"
    );
    auto s2 = std::make_shared<Student>(
        "usr_student_02", "Hamza Ali", "hamza.ali@itech.edu.pk",
        sha256Hex("itech2026"), "+92 333 9988771", "IT-2024-1108"
    );
    addUser(s1);
    addUser(s2);

    // Seed Posts
    auto p1 = std::make_shared<LostPost>(
        "post_lost_01", s1->getUserID(), s1->getName(), s1->getEmail(),
        "Black Leather Wallet", "wallet.jpg", "Main Library, 2nd Floor",
        "2026-10-02", "04:15 PM", s1->getPhone(),
        "Black leather bifold wallet with student ID card.",
        "02 October 2026, 05:20 PM", PostStatus::ACTIVE
    );

    auto p2 = std::make_shared<FoundPost>(
        "post_found_01", s2->getUserID(), s2->getName(), s2->getEmail(),
        "Black Wireless Earphones Case", "earphones.jpg", "Central Cafeteria",
        "2026-10-03", "01:30 PM", s2->getPhone(),
        "Black matte charging case found on table 14.",
        "03 October 2026, 02:00 PM", PostStatus::ACTIVE
    );

    createPost(s1, p1);
    createPost(s2, p2);
}

void DatabaseManager::addUser(std::shared_ptr<User> user) {
    if (user) {
        m_users[user->getUserID()] = user;
    }
}

std::shared_ptr<User> DatabaseManager::authenticate(const std::string& email, const std::string& rawPassword) {
    const std::string candidateHash = sha256Hex(rawPassword);
    for (const auto& pair : m_users) {
        if (pair.second->getEmail() == email && pair.second->verifyPassword(candidateHash)) {
            if (!pair.second->isActive()) {
                throw std::runtime_error("Account is deactivated.");
            }
            return pair.second;
        }
    }
    throw std::runtime_error("Invalid login credentials.");
}

std::shared_ptr<User> DatabaseManager::getUserByID(const std::string& userID) {
    auto it = m_users.find(userID);
    if (it != m_users.end()) return it->second;
    return nullptr;
}

std::vector<std::shared_ptr<Student>> DatabaseManager::getAllStudents() const {
    std::vector<std::shared_ptr<Student>> result;
    for (const auto& pair : m_users) {
        if (pair.second->getRole() == UserRole::STUDENT) {
            result.push_back(std::dynamic_pointer_cast<Student>(pair.second));
        }
    }
    return result;
}

void DatabaseManager::createPost(std::shared_ptr<User> actor, std::shared_ptr<LostFoundPost> post) {
    if (!actor) throw std::runtime_error("Authentication required.");
    if (!post) throw std::runtime_error("Post object is null.");
    m_posts[post->getPostID()] = post;
}

std::shared_ptr<LostFoundPost> DatabaseManager::getPostByID(const std::string& postID) {
    auto it = m_posts.find(postID);
    if (it != m_posts.end()) return it->second;
    return nullptr;
}

// Strict Ownership Enforcement in C++
void DatabaseManager::updatePost(std::shared_ptr<User> actor, const std::string& postID,
                                const std::string& newName, const std::string& newLoc,
                                const std::string& newDetails) {
    auto post = getPostByID(postID);
    if (!post) throw std::runtime_error("Post does not exist.");

    if (!actor->canModifyPost(post->getOwnerID())) {
        throw std::runtime_error("You are not authorized to edit this post.");
    }

    post->updateItemName(newName);
    post->updateLocation(newLoc);
    post->updateDetails(newDetails);
}

void DatabaseManager::deletePost(std::shared_ptr<User> actor, const std::string& postID) {
    auto post = getPostByID(postID);
    if (!post) throw std::runtime_error("Post does not exist.");

    if (!actor->canModifyPost(post->getOwnerID())) {
        throw std::runtime_error("You are not authorized to delete this post.");
    }

    m_posts.erase(postID);
}

void DatabaseManager::markPostResolved(std::shared_ptr<User> actor, const std::string& postID) {
    auto post = getPostByID(postID);
    if (!post) throw std::runtime_error("Post does not exist.");

    if (!actor->canModifyPost(post->getOwnerID())) {
        throw std::runtime_error("You are not authorized to edit this post.");
    }

    post->markResolved();
}

std::vector<std::shared_ptr<LostFoundPost>> DatabaseManager::getAllPosts() const {
    std::vector<std::shared_ptr<LostFoundPost>> result;
    for (const auto& pair : m_posts) {
        result.push_back(pair.second);
    }
    return result;
}

std::vector<std::shared_ptr<LostFoundPost>> DatabaseManager::getLostPosts() const {
    std::vector<std::shared_ptr<LostFoundPost>> result;
    for (const auto& pair : m_posts) {
        if (pair.second->getType() == PostType::LOST) {
            result.push_back(pair.second);
        }
    }
    return result;
}

std::vector<std::shared_ptr<LostFoundPost>> DatabaseManager::getFoundPosts() const {
    std::vector<std::shared_ptr<LostFoundPost>> result;
    for (const auto& pair : m_posts) {
        if (pair.second->getType() == PostType::FOUND) {
            result.push_back(pair.second);
        }
    }
    return result;
}

std::vector<std::shared_ptr<LostFoundPost>> DatabaseManager::searchPosts(
    const std::string& query, const std::string& filterType) const {
    std::vector<std::shared_ptr<LostFoundPost>> result;
    for (const auto& pair : m_posts) {
        if (filterType == "LOST" && pair.second->getType() != PostType::LOST) continue;
        if (filterType == "FOUND" && pair.second->getType() != PostType::FOUND) continue;
        if (filterType == "RESOLVED" && pair.second->getStatus() != PostStatus::RESOLVED) continue;

        if (pair.second->matchesQuery(query)) {
            result.push_back(pair.second);
        }
    }
    return result;
}

std::vector<std::shared_ptr<LostFoundPost>> DatabaseManager::getPostsByOwner(const std::string& ownerID) const {
    std::vector<std::shared_ptr<LostFoundPost>> result;
    for (const auto& pair : m_posts) {
        if (pair.second->getOwnerID() == ownerID) {
            result.push_back(pair.second);
        }
    }
    return result;
}

void DatabaseManager::fileReport(std::shared_ptr<Report> report) {
    if (report) m_reports.push_back(report);
}

void DatabaseManager::createBackupJSON(const std::string& filePath) const {
    std::ofstream file(filePath);
    if (!file.is_open()) throw std::runtime_error("Unable to open backup file for writing.");

    file << "{\n";
    file << "  \"university\": \"iTECH - International Institute of Technology, Culture & Health Sciences\",\n";
    file << "  \"total_posts\": " << m_posts.size() << ",\n";
    file << "  \"total_users\": " << m_users.size() << ",\n";
    file << "  \"posts\": [\n";

    size_t count = 0;
    for (const auto& pair : m_posts) {
        auto p = pair.second;
        file << "    {\n";
        file << "      \"id\": \"" << jsonEscape(p->getPostID()) << "\",\n";
        file << "      \"type\": \"" << jsonEscape(p->getTypeString()) << "\",\n";
        file << "      \"item\": \"" << jsonEscape(p->getItemName()) << "\",\n";
        file << "      \"location\": \"" << jsonEscape(p->getLocation()) << "\",\n";
        file << "      \"owner\": \"" << jsonEscape(p->getOwnerName()) << "\",\n";
        file << "      \"status\": \"" << (p->isResolved() ? "RESOLVED" : "ACTIVE") << "\"\n";
        file << "    }" << (++count < m_posts.size() ? "," : "") << "\n";
    }

    file << "  ]\n";
    file << "}\n";
    file.close();
    std::cout << "[BACKUP] Successfully created JSON backup at: " << filePath << "\n";
}

void DatabaseManager::printSystemStats() const {
    size_t lost = getLostPosts().size();
    size_t found = getFoundPosts().size();
    size_t pendingReports = 0;
    for (const auto& r : m_reports) {
        if (r->getStatus() == ReportStatus::PENDING) pendingReports++;
    }
    size_t resolved = 0;
    for (const auto& pair : m_posts) {
        if (pair.second->isResolved()) resolved++;
    }

    std::cout << "========================================================\n"
              << "  iTECH LOST & FOUND SYSTEM - CAMPUS STATISTICS\n"
              << "========================================================\n"
              << "  Total Items:         " << m_posts.size() << "\n"
              << "  Lost Items:          " << lost << "\n"
              << "  Found Items:         " << found << "\n"
              << "  Resolved Items:      " << resolved << "\n"
              << "  Pending Reports:     " << pendingReports << "\n"
              << "  Registered Students: " << getAllStudents().size() << "\n"
              << "========================================================\n";
}

} // namespace itech
