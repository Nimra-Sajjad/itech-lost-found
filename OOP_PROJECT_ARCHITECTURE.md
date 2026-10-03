# iTECH LOST & FOUND MANAGEMENT SYSTEM
## Object-Oriented Programming (OOP) Academic Architecture Specification

**Institution:** iTECH (International Institute of Technology, Culture & Health Sciences)  
**Project Title:** University Lost & Found Management System  
**Academic Domain:** Object-Oriented Analysis, Design & Implementation  
**Target Languages:** TypeScript (Frontend SPA / Application Layer), C++17 (`backend_cpp/`), Java 17+ (`backend_java/`)  
**Design Patterns Utilized:** Singleton, Facade, Factory Method, Template Method, Data Transfer Object (DTO)

---

## 1. Executive Summary & Problem Domain

The **iTECH Lost & Found Management System** is a secure, role-based institutional portal engineered to assist university students, faculty, and administrative staff in reporting, identifying, and recovering lost or found property across campus facilities (such as the Main Library, Central Cafeteria, Computer Labs, Sports Complex, and Lecture Halls).

This project is architected as an exemplar of **Object-Oriented Programming (OOP)** principles. Business logic, authorization constraints, state transitions, and data integrity rules are enforced directly within strongly typed classes rather than ad-hoc procedural scripts.

---

## 2. Core OOP Principles Demonstrated

### 2.1 Encapsulation
* **Private State Fields**: In all language implementations (TypeScript private `#` fields, C++ `protected`/`private` members, Java `private` attributes), internal data is shielded from arbitrary external mutation.
* **Controlled Accessors (Getters & Setters)**: Data attributes like `#name`, `#location`, and `#phone` can only be updated through validated methods that reject empty strings or corrupted data.
* **State Lifecycle Encapsulation**: A post's status (`ACTIVE` vs `RESOLVED`) is altered only via designated member functions (`markResolved()`, `reopen()`), guaranteeing consistent state transitions.
* **Sensitive Data Protection**: Passwords are never stored as plain text. Only cryptographic SHA-256 hashes (`passwordHash`) are retained, and methods like `verifyPassword()` compare candidate hashes without revealing secrets.

### 2.2 Inheritance
* **User Hierarchy**:
  * Abstract Base Class: `User`
    * Subclass: `Student` (inherits user credentials, adds `universityID` e.g., `IT-2023-0492`)
    * Subclass: `Admin` (inherits user credentials, adds `department` and `accessLevel`)
* **Post Hierarchy**:
  * Abstract Base Class: `LostFoundPost`
    * Subclass: `LostPost` (inherits all item metadata; defines `type = "LOST"`, crimson badge branding `#A82024`, and owner-contact prompts)
    * Subclass: `FoundPost` (inherits all item metadata; defines `type = "FOUND"`, navy badge branding `#16325C`, and finder-contact prompts)

### 2.3 Polymorphism & Dynamic Dispatch
* **Virtual Function Overriding**:
  * `canModifyPost(ownerID)`:
    * In `Student`: Returns `true` **only** if `this.userID === ownerID`.
    * In `Admin`: Returns `true` unconditionally (systemic moderation authorization).
  * `getRoleDisplayName()`:
    * `Student` returns `"iTECH Student"`.
    * `Admin` returns `"System Administrator"`.
  * `getBadgeColor()`:
    * `LostPost` returns Crimson (`#A82024`).
    * `FoundPost` returns Navy (`#16325C`).
* **Runtime Dispatch**: Collections stored as base class references (`std::vector<std::shared_ptr<User>>` in C++, `List<User>` in Java, or `User[]` in TypeScript) dynamically invoke the correct subclass implementation at runtime without type switching.

### 2.4 Abstraction
* High-level consumers (such as React view components or command-line clients) interact with abstract interfaces and facade services (`DatabaseService` / `DatabaseManager`) without needing to know internal data structure layouts, storage mechanisms (localStorage, memory maps, file streams), or hash algorithms.

---

## 3. Strict Ownership & Role-Based Access Control (RBAC)

### The Fundamental Ownership Rule
> **A student must ONLY be able to edit, delete, or mark resolved posts created by that specific student.**

```
[Student A (ID: usr_student_01)] ---> Creates "Black Wallet" (ownerID: usr_student_01)
                                            |
[Student B (ID: usr_student_02)] ---> Attempts Edit / Delete
                                            |
                                            v
                             [Security Enforcement Check]
                             actor.canModifyPost(post.ownerID)
                             Is "usr_student_02" == "usr_student_01"? => FALSE
                                            |
                                            v
                                 [AUTHORIZATION ERROR RAISED]
                       "You are not authorized to edit this post."
```

* **Administrator Privileges**:
  * An `Admin` user possesses systemic authority (`canModifyPost() => true`). Admins can edit incorrect details, delete offensive items, review student reports, and enable/disable student accounts.

---

## 4. System Class Hierarchy & UML Diagram

```
                             +----------------------------------------+
                             |           <<abstract>> User            |
                             +----------------------------------------+
                             | - userID: String                       |
                             | - name: String                         |
                             | - email: String                        |
                             | - passwordHash: String                 |
                             | - phone: String                        |
                             | - role: UserRole                       |
                             | - accountStatus: AccountStatus         |
                             +----------------------------------------+
                             | + getRoleDisplayName(): String [pure]  |
                             | + canManageAllPosts(): Boolean [pure]  |
                             | + canModifyPost(ownerID): Bool [pure]  |
                             | + verifyPassword(hash): Boolean        |
                             | + updateProfile(name, phone): void     |
                             +-------------------+--------------------+
                                                 |
                       +-------------------------+------------------------+
                       |                                                  |
        +--------------+---------------+                   +--------------+---------------+
        |           Student            |                   |            Admin             |
        +------------------------------+                   +------------------------------+
        | - universityID: String       |                   | - department: String         |
        +------------------------------+                   | - accessLevel: Integer       |
        | + canModifyPost(ownerID)     |                   +------------------------------+
        |   { return userID == ownerID}|                   | + canModifyPost(ownerID)     |
        | + getRoleDisplayName()       |                   |   { return true; }           |
        +------------------------------+                   | + canManageAllPosts()        |
                                                           +------------------------------+

                             +----------------------------------------+
                             |      <<abstract>> LostFoundPost        |
                             +----------------------------------------+
                             | - postID: String                       |
                             | - ownerID: String                      |
                             | - ownerName: String                    |
                             | - ownerEmail: String                   |
                             | - type: PostType                       |
                             | - itemName: String                     |
                             | - image: String                        |
                             | - location: String                     |
                             | - incidentDate: String                 |
                             | - approximateTime: String              |
                             | - contactNumber: String                |
                             | - details: String                      |
                             | - postedAt: String                     |
                             | - status: PostStatus                   |
                             +----------------------------------------+
                             | + markResolved(): void                 |
                             | + update(fields): void                 |
                             | + matchesQuery(q): Boolean             |
                             | + getBadgeColor(): String [pure]       |
                             | + getActionLabel(): String [pure]      |
                             +-------------------+--------------------+
                                                 |
                       +-------------------------+------------------------+
                       |                                                  |
        +--------------+---------------+                   +--------------+---------------+
        |           LostPost           |                   |          FoundPost           |
        +------------------------------+                   +------------------------------+
        | type = 'LOST'                |                   | type = 'FOUND'               |
        +------------------------------+                   +------------------------------+
        | + getBadgeColor() => Crimson |                   | + getBadgeColor() => Navy    |
        | + getActionLabel()           |                   | + getActionLabel()           |
        +------------------------------+                   +------------------------------+
```

---

## 5. Detailed Class Specifications

### 5.1 `User` (Abstract Base Class)
* **Purpose**: Serves as the generalized template for all human actors in the university portal.
* **Fields**:
  * `userID`: Unique immutable identifier.
  * `name`: User's full institutional name.
  * `email`: Official university email (`@itech.edu.pk`).
  * `passwordHash`: Cryptographic SHA-256 digest of credentials.
  * `phone`: Contact telephone number for campus handovers.
  * `role`: Enum (`STUDENT` | `ADMIN`).
  * `accountStatus`: Enum (`ACTIVE` | `DISABLED`).
* **Abstract Methods**:
  * `getRoleDisplayName(): string`
  * `canManageAllPosts(): boolean`
  * `canAccessAdminPortal(): boolean`
  * `canModifyPost(postOwnerID: string): boolean`

### 5.2 `Student` (Subclass of User)
* **Specific Fields**: `universityID` (e.g., `IT-2023-0492`).
* **Polymorphic Overrides**:
  * `canModifyPost(postOwnerID)`: Returns `true` if and only if `this.userID === postOwnerID`.
  * `canAccessAdminPortal()`: Returns `false`.

### 5.3 `Admin` (Subclass of User)
* **Specific Fields**: `department` (Campus Security & Student Affairs), `accessLevel` (Super Admin).
* **Polymorphic Overrides**:
  * `canModifyPost(postOwnerID)`: Returns `true` (system-wide moderation rights).
  * `canAccessAdminPortal()`: Returns `true`.

### 5.4 `LostFoundPost` (Abstract Base Class)
* **Purpose**: Encapsulates common attributes and operations for any reported campus property.
* **Fields**:
  * `postID`: Unique identifier.
  * `ownerID`, `ownerName`, `ownerEmail`: Authorship credentials.
  * `type`: Enum (`LOST` | `FOUND`).
  * `itemName`: Name of item (e.g. "Black Leather Wallet").
  * `image`: URL/Base64 data of image.
  * `location`: Specific campus zone (e.g. "Main Library, 2nd Floor").
  * `incidentDate`, `approximateTime`: When the incident took place.
  * `contactNumber`: Phone number.
  * `details`: Identifying remarks.
  * `postedAt`: Automatically generated submission timestamp (e.g. `03 October 2026, 08:35 PM`).
  * `status`: Enum (`ACTIVE` | `RESOLVED`).
* **Key Methods**:
  * `markResolved()`: Changes status to `RESOLVED`.
  * `update(data)`: Validates and updates permitted fields.
  * `matchesQuery(query)`: Case-insensitive search on name, location, and details.

### 5.5 `Report` (Moderation Entity)
* **Purpose**: Encapsulates student reports regarding spam, fake submissions, or inappropriate items.
* **Fields**: `reportID`, `postID`, `postTitle`, `reporterID`, `reporterName`, `reporterEmail`, `reason`, `details`, `reportDate`, `status` (`PENDING` | `RESOLVED` | `DISMISSED`).

### 5.6 `DatabaseService` / `DatabaseManager` (Facade & Singleton)
* **Pattern**: Singleton (`getInstance()`) guarantees a single unified state repository.
* **Responsibilities**:
  * Centralized CRUD operations.
  * Enforcing authorization on updates and deletions.
  * SHA-256 password hashing.
  * Full JSON database snapshot backup creation and restoration.

---

## 6. CRUD Operation Specifications

| Operation | Entity | Authorized Actor | Method | Business Logic & Rules |
| :--- | :--- | :--- | :--- | :--- |
| **CREATE** | Post | Logged-in Student or Admin | `createPost(actor, data)` | Auto-stamps current date/time; assigns ownership to `actor.userID`. |
| **READ** | Post | Anyone (Public / Filtered) | `getAllPosts()`, `searchAndFilter(q, filter)` | Filters by `ALL`, `LOST`, `FOUND`, `RESOLVED`. |
| **UPDATE** | Post | Post Owner OR Admin | `updatePost(actor, postID, updates)` | Strictly validates `actor.canModifyPost(post.ownerID)`. Preserves post ID and ownership. |
| **DELETE** | Post | Post Owner OR Admin | `deletePost(actor, postID)` | Strictly validates `actor.canModifyPost(post.ownerID)`. Permanently removes record. |
| **RESOLVE**| Post | Post Owner OR Admin | `markPostResolved(actor, postID)` | Transitions post status from `ACTIVE` to `RESOLVED`. |
| **REPORT** | Report | Logged-in Student | `createReport(reporter, postID, reason, details)` | Enqueues report into Admin review queue. |
| **MODERATE**| User / Report | Admin Only | `toggleUserStatus()`, `dismissReport()` | Manages access and dismisses false reports. |

---

## 7. C++ Backend Implementation (`backend_cpp/`)

The directory `/backend_cpp/` contains a fully functional C++17 implementation demonstrating memory management, header-source separation, and dynamic polymorphism.

### File Manifest:
1. `User.hpp` & `Implementations.cpp`: Base class with pure virtual methods.
2. `Student.hpp`: Derived student class with student ID.
3. `Admin.hpp`: Derived admin class with administrative access levels.
4. `LostFoundPost.hpp`: Abstract post base class with `LostPost` and `FoundPost` subclasses.
5. `Report.hpp`: Moderation report entity.
6. `DatabaseManager.hpp` & `DatabaseManager.cpp`: In-memory storage with `std::map<std::string, std::shared_ptr<User>>` and `std::map<std::string, std::shared_ptr<LostFoundPost>>`.
7. `main.cpp`: Executable test harness verifying polymorphic dynamic dispatch, ownership access enforcement, searching, and JSON backup export.
8. `Makefile`: Compilation automation script.

### C++ Code Demonstration: Strict Ownership Check
```cpp
void DatabaseManager::updatePost(std::shared_ptr<User> actor, const std::string& postID,
                                const std::string& newName, const std::string& newLoc,
                                const std::string& newDetails) {
    auto post = getPostByID(postID);
    if (!post) throw std::runtime_error("Post does not exist.");

    // Strict Polymorphic Ownership Validation
    if (!actor->canModifyPost(post->getOwnerID())) {
        throw std::runtime_error("You are not authorized to edit this post.");
    }

    post->updateItemName(newName);
    post->updateLocation(newLoc);
    post->updateDetails(newDetails);
}
```

### Compiling & Running the C++ Engine:
```bash
cd backend_cpp
make
./itech_lostfound_engine
```
Or directly:
```bash
g++ -std=c++17 -Wall -Wextra Implementations.cpp main.cpp -o itech_lostfound_engine
./itech_lostfound_engine
```

---

## 8. Java Backend Implementation (`backend_java/`)

The directory `/backend_java/` provides an idiomatic Java 17+ package structure demonstrating standard OOP enterprise design patterns.

### Package Structure:
```
backend_java/
└── src/
    └── com/
        └── itech/
            └── lostfound/
                ├── model/
                │   ├── User.java          (Abstract Base Class)
                │   ├── Student.java       (Concrete Subclass)
                │   ├── Admin.java         (Concrete Subclass)
                │   ├── Post.java          (Abstract Post Base Class)
                │   ├── LostPost.java      (Concrete Subclass)
                │   ├── FoundPost.java     (Concrete Subclass)
                │   └── Report.java        (Moderation Entity)
                ├── service/
                │   └── LostFoundManager.java (Singleton / Facade)
                └── Main.java              (Executable Test Suite)
```

### Java Code Demonstration: Polymorphic Card Display
```java
// Base class reference executing dynamic method dispatch
for (Post p : manager.getAllPosts()) {
    p.displayCard(); // LostPost or FoundPost polymorphic call
}
```

### Compiling & Running the Java Engine:
```bash
cd backend_java/src
javac com/itech/lostfound/model/*.java com/itech/lostfound/service/*.java com/itech/lostfound/*.java
java com.itech.lostfound.Main
```

---

## 9. Pre-Seeded Academic Evaluation Test Accounts

| Role | Name | Email | Password | Identifier / Department | Pre-Seeded Listings |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Student** | Sarah Ahmed | `sarah.ahmed@itech.edu.pk` | `itech2026` | `IT-2023-0492` | • Black Leather Wallet (Lost)<br>• Silver Casio Watch (Resolved) |
| **Student** | Hamza Ali | `hamza.ali@itech.edu.pk` | `itech2026` | `IT-2024-1108` | • Blue Hardcover Notebook (Lost)<br>• Wireless Earphones Case (Found) |
| **Admin** | Dr. Tariq Mahmood | `admin@itech.edu.pk` | `admin2026` | Campus Security & Student Affairs | • Dorm Keys with Red Lanyard (Found) |

---

## 10. Conclusion

The **iTECH Lost & Found Management System** illustrates how foundational OOP tenets directly solve practical enterprise challenges:
1. **Security & Data Integrity** through private encapsulation.
2. **Reusability & Extensibility** through clean class inheritance.
3. **Decoupled Business Logic** through polymorphic authorization rules.
4. **Resilient Architecture** through clear separation between presentation and object models across TypeScript, C++, and Java.
