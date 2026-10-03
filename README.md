# iTECH Lost & Found Management System - Java OOP Engine

## Academic Project Architecture

This Java module provides the complete object-oriented business logic, role-based access control, and data model for the **iTECH Lost & Found Management System** (International Institute of Technology, Culture & Health Sciences).

### Object-Oriented Hierarchy

- `com.itech.lostfound.model.User` (Abstract Base Class)
  - `com.itech.lostfound.model.Student` (Subclass: Student role & University ID)
  - `com.itech.lostfound.model.Admin` (Subclass: Security & Admin role)
- `com.itech.lostfound.model.Post` (Abstract Base Class for Items)
  - `com.itech.lostfound.model.LostPost` (Subclass: Lost items with Crimson theme `#A82024`)
  - `com.itech.lostfound.model.FoundPost` (Subclass: Found items with Navy theme `#16325C`)
- `com.itech.lostfound.model.Report` (Entity: Moderation reports)
- `com.itech.lostfound.service.LostFoundManager` (Singleton / Facade for CRUD & RBAC)
- `com.itech.lostfound.Main` (Executable test harness)

### How to Compile & Run

```bash
cd backend_java/src
javac com/itech/lostfound/model/*.java com/itech/lostfound/service/*.java com/itech/lostfound/*.java
java com.itech.lostfound.Main
```
