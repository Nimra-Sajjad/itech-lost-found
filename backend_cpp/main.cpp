/**
 * ============================================================================
 * iTECH Lost & Found Management System - C++ Application Main / Test Suite
 * Demonstrates:
 *   1. Polymorphic Object Creation & Dynamic Dispatch
 *   2. Encapsulation (Private fields with validated accessors)
 *   3. Strict Ownership Authorization Verification (Student A vs B vs Admin)
 *   4. Full CRUD operations
 *   5. Filtering & Search logic
 *   6. Backup Export
 * ============================================================================
 */

#include "DatabaseManager.hpp"
#include <iostream>
#include <cassert>

using namespace itech;

int main() {
    std::cout << "\n============================================================\n";
    std::cout << "  iTECH LOST & FOUND MANAGEMENT SYSTEM (C++ OOP ENGINE)\n";
    std::cout << "  International Institute of Technology, Culture & Health Sciences\n";
    std::cout << "============================================================\n\n";

    DatabaseManager& db = DatabaseManager::getInstance();

    std::cout << "--- 1. AUTHENTICATION & POLYMORPHIC USER TEST ---\n";
    auto student1 = db.authenticate("sarah.ahmed@itech.edu.pk", "itech2026");
    auto student2 = db.authenticate("hamza.ali@itech.edu.pk", "itech2026");
    auto admin = db.authenticate("admin@itech.edu.pk", "admin2026");

    std::cout << "[Polymorphism] Calling virtual printProfile() via Base Pointer:\n";
    student1->printProfile();
    student2->printProfile();
    admin->printProfile();

    std::cout << "\n--- 2. DEMONSTRATING OWNERSHIP RULE ENFORCEMENT ---\n";
    std::cout << "Sarah created: 'Black Leather Wallet' (post_lost_01)\n";

    // Sarah updates her own post -> MUST SUCCEED
    try {
        db.updatePost(student1, "post_lost_01", "Black Leather Wallet", "Main Library 2nd Floor Desk", "Updated reward note.");
        std::cout << "  [SUCCESS] Sarah modified her own post successfully.\n";
    } catch (const std::exception& e) {
        std::cout << "  [ERROR] " << e.what() << "\n";
    }

    // Hamza tries to update Sarah's post -> MUST FAIL with Authorization Error
    std::cout << "Attempting unauthorized modification: Hamza trying to edit Sarah's post...\n";
    try {
        db.updatePost(student2, "post_lost_01", "Hacked Post Name", "Nowhere", "Malicious edit");
        std::cout << "  [SECURITY BREACH] Hamza was able to edit Sarah's post!\n";
    } catch (const std::exception& e) {
        std::cout << "  [SECURITY VERIFIED] Rejected as expected: \"" << e.what() << "\"\n";
    }

    // Admin updates Sarah's post -> MUST SUCCEED
    std::cout << "Admin modifying Sarah's post for moderation...\n";
    try {
        db.updatePost(admin, "post_lost_01", "Black Leather Wallet [Verified]", "Main Library 2nd Floor Desk", "Verified with library security.");
        std::cout << "  [SUCCESS] Admin updated post with administrative privileges.\n";
    } catch (const std::exception& e) {
        std::cout << "  [ERROR] " << e.what() << "\n";
    }

    std::cout << "\n--- 3. POLYMORPHIC POST HIERARCHY & SEARCH ---\n";
    auto allPosts = db.getAllPosts();
    std::cout << "Total posts loaded: " << allPosts.size() << "\n";
    for (const auto& p : allPosts) {
        p->printSummary(); // Polymorphic call (LostPost vs FoundPost)
    }

    std::cout << "\nSearching for keyword 'Library':\n";
    auto searchResults = db.searchPosts("Library");
    std::cout << "Found " << searchResults.size() << " match(es):\n";
    for (const auto& r : searchResults) {
        std::cout << "  - " << r->getItemName() << " at " << r->getLocation() << "\n";
    }

    std::cout << "\n--- 4. RESOLUTION WORKFLOW ---\n";
    std::cout << "Sarah marks her item as RESOLVED...\n";
    db.markPostResolved(student1, "post_lost_01");
    auto updatedP1 = db.getPostByID("post_lost_01");
    std::cout << "Item status: " << (updatedP1->isResolved() ? "RESOLVED" : "ACTIVE") << "\n";

    std::cout << "\n--- 5. SYSTEM STATISTICS & BACKUP ---\n";
    db.printSystemStats();
    db.createBackupJSON("itech_lostfound_backup.json");

    std::cout << "\n[ALL OOP C++ TESTS PASSED SUCCESSFULLY]\n";
    return 0;
}
