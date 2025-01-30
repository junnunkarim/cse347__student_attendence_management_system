# **Student Attendance Management System**

### _Web-Based System for Open-Credit Universities_

**Built with SvelteKit, SQLite, and Drizzle ORM**

---

## **1. User Roles & Permissions**

| **Role**    | **Permissions**                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------- |
| **Admin**   | Manage departments, courses, users, enrollments, and faculty-course assignments.                |
| **Faculty** | Mark attendance for assigned courses, approve/reject day-off requests, generate course reports. |
| **Student** | View attendance, request day-offs, check credit eligibility.                                    |
| **Dean**    | Analyze department/course attendance trends, export compliance reports.                         |

---

## **2. Features for Each User**

### **Students**

- **Attendance Dashboard**:
  - View attendance status per course (**Present/Absent/Excused**) with dates
    and session times.
  - Check attendance percentage (e.g., "75% in CSE302: Database Systems").
- **Day-Off Requests**:
  - Submit requests for future course sessions (linked to assigned faculty).
- **Notifications**:
  - Receive in-app alerts or emails for low attendance (e.g., "Warning:
    Attendance below 60% in AI").

### **Faculty**

- **Attendance Marking**:
  - Mark attendance **only for assigned courses** (filtered via
    `course_assignments`).
  - Auto-flag excused absences from approved requests.
- **Day-Off Requests**:
  - Approve/reject student requests for **assigned courses**.
- **Reports**:
  - Generate attendance summaries for assigned courses.

### **Admin**

- **User Management**:
  - Register students, faculty, and deans (no self-registration).
  - Deactivate accounts (e.g., graduated students).
- **Course/Department Management**:
  - Create departments (e.g., "Computer Science") and courses (e.g., "CS101: 3
    credits").
  - Define course schedules (days/times).
  - Assign faculty to courses via `course_assignments` table.
- **Enrollments**:
  - Enroll students in courses across departments (open-credit system).

### **Dean**

- **Analytics Dashboard**:
  - View trends like "CS Department: 80% attendance" or "CSE302 vs. MATH101".
- **Compliance Reports**:
  - Export PDF/Excel reports for audits.

---

## **3. Workflow**

1. **Admin Setup**:
   - Admin creates departments, courses, and registers users.
   - Admin assigns faculty to courses and enrolls students (e.g., "Dr. Smith →
     CSE302").
2. **Day-Off Request (Student)**:
   - Student submits request → Faculty approves/rejects → Status reflected in
     attendance.
3. **Attendance Marking (Faculty)**:
   - Faculty marks daily attendance → System auto-sets "excused" for approved
     requests.
4. **Analytics (Dean)**:
   - Dean views real-time dashboards and exports compliance reports.

---

## **4. Complete Database Schema**

### **Tables (SQLite + Drizzle ORM)**

```sql
-- Users (All roles)  
CREATE TABLE users (  
  id TEXT PRIMARY KEY,  
  email TEXT UNIQUE NOT NULL,  
  password_hash TEXT NOT NULL,  
  role TEXT NOT NULL CHECK (role IN ('admin', 'faculty', 'student', 'dean')),  
  created_at INTEGER DEFAULT (unixepoch())  
);  

-- Students  
CREATE TABLE students (  
  id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,  
  full_name TEXT NOT NULL,  
  enrolled_at INTEGER DEFAULT (unixepoch())  
);  

-- Faculty  
CREATE TABLE faculty (  
  id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,  
  full_name TEXT NOT NULL,  
  department_id TEXT REFERENCES departments(id) ON DELETE SET NULL  
);  

-- Departments  
CREATE TABLE departments (  
  id TEXT PRIMARY KEY,  
  name TEXT NOT NULL UNIQUE  
);  

-- Courses  
CREATE TABLE courses (  
  id TEXT PRIMARY KEY,  
  name TEXT NOT NULL,  
  code TEXT UNIQUE NOT NULL,  
  credits INTEGER NOT NULL,  
  department_id TEXT REFERENCES departments(id) ON DELETE CASCADE  
);  

-- Course Schedules (Days + Times)  
CREATE TABLE course_schedules (  
  id TEXT PRIMARY KEY,  
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,  
  day TEXT CHECK (day IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday')),  
  start_time TEXT NOT NULL, -- "09:00"  
  end_time TEXT NOT NULL  
);  

-- Course Assignments (Faculty ↔ Courses)  
CREATE TABLE course_assignments (  
  faculty_id TEXT REFERENCES faculty(id) ON DELETE CASCADE,  
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,  
  PRIMARY KEY (faculty_id, course_id)  
);  

-- Enrollments (Students ↔ Courses)  
CREATE TABLE enrollments (  
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,  
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,  
  PRIMARY KEY (student_id, course_id)  
);  

-- Day-Off Requests  
CREATE TABLE day_off_requests (  
  id TEXT PRIMARY KEY,  
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,  
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,  
  faculty_id TEXT REFERENCES faculty(id) ON DELETE CASCADE, -- Assigned faculty  
  schedule_id TEXT REFERENCES course_schedules(id) ON DELETE CASCADE,  
  date INTEGER NOT NULL,  
  reason TEXT NOT NULL,  
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',  
  responded_at INTEGER  
);  

-- Attendance Records  
CREATE TABLE attendance (  
  id TEXT PRIMARY KEY,  
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,  
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,  
  faculty_id TEXT REFERENCES faculty(id) ON DELETE CASCADE, -- Faculty who marked it  
  schedule_id TEXT REFERENCES course_schedules(id) ON DELETE CASCADE,  
  date INTEGER NOT NULL,  
  status TEXT CHECK (status IN ('present', 'absent', 'excused'))  
);
```

---

### **Key Relationships**

- `users` → Base table for all roles (admins have `role='admin'` with no extra
  table).
- `course_assignments` → Links faculty to courses (many-to-many).
- `day_off_requests` → Connects students to courses (requests are
  course-specific).
- `attendance` → Auto-sets "excused" if a request is approved for the same
  `student_id`, `course_id`, and `date`.

---

## **5. Edge-Case Handling**

| **Scenario**        | **Resolution**                                                                 |
| ------------------- | ------------------------------------------------------------------------------ |
| **Faculty Deleted** | All `course_assignments`, `attendance`, and `day_off_requests` cascade-delete. |
| **Course Deleted**  | All `course_assignments`, `enrollments`, and `attendance` cascade-delete.      |
| **Student Deleted** | All `enrollments`, `attendance`, and `day_off_requests` cascade-delete.        |

---

## **6. Implementation Steps**

1. **Project Setup**
   - Initialize SvelteKit app with SQLite and Drizzle ORM.
   - Define schema using Drizzle’s TypeScript API.
2. **Authentication**
   - Role-based login (cookie sessions, basic password hashing with bcrypt).
3. **Admin Panel**
   - Course/department management UI.
   - User registration forms (students, faculty, deans).
4. **Faculty Features**
   - Attendance marking form with student lists (filter by course).
   - Day-off request approval dashboard.
5. **Student Dashboard**
   - Attendance status cards and day-off request form.
6. **Dean Analytics**
   - Interactive charts (Chart.js) for attendance trends.
7. **Testing**
   - Validate day-off request → attendance integration.
   - Unit tests for Drizzle queries.

---

## **7. Technology Stack**

- **Frontend**: SvelteKit (Svelte 5), Pico CSS, Chart.js.
- **Backend**: SvelteKit API routes.
- **Database**: SQLite + Drizzle ORM (type-safe queries).
- **Auth**: Cookie-based sessions with bcrypt.

---

## **8. Challenges & Solutions**

- **Day-Off Request Integration**:
  - Use Drizzle **hooks** to auto-update attendance when a request is approved.
- **Real-Time Dashboards**:
  - SvelteKit’s reactivity for live updates.
- **Role-Based Access**:
  - Conditional UI rendering based on `user.role`.

---

## **9. Deliverables**

1. **SRS Document**: Use cases, functional/non-functional requirements.
2. **ER Diagram**: Visual schema with `dbdiagram`.
3. **Source Code**: Modular SvelteKit app with Drizzle integration.

---

## **Appendix**

### DBML code

```
Table users {
  id TEXT [pk]
  email TEXT [unique, not null]
  password_hash TEXT [not null]
  role TEXT [not null, note: 'CHECK (role IN (\'admin\', \'faculty\', \'student\', \'dean\'))']
  created_at INTEGER [default: 'unixepoch()']
}

Table students {
  id TEXT [pk, ref: > users.id, note: 'ON DELETE CASCADE']
  full_name TEXT [not null]
  enrolled_at INTEGER [default: 'unixepoch()']
}

Table faculty {
  id TEXT [pk, ref: > users.id, note: 'ON DELETE CASCADE']
  full_name TEXT [not null]
  department_id TEXT [ref: > departments.id, note: 'ON DELETE SET NULL']
}

Table departments {
  id TEXT [pk]
  name TEXT [unique, not null]
}

Table courses {
  id TEXT [pk]
  name TEXT [not null]
  code TEXT [unique, not null]
  credits INTEGER [not null]
  department_id TEXT [ref: > departments.id, note: 'ON DELETE CASCADE']
}

Table course_schedules {
  id TEXT [pk]
  course_id TEXT [ref: > courses.id, note: 'ON DELETE CASCADE']
  day TEXT [note: 'CHECK (day IN (\'monday\', \'tuesday\', \'wednesday\', \'thursday\', \'friday\'))']
  start_time TEXT [not null]
  end_time TEXT [not null]
}

Table course_assignments {
  faculty_id TEXT [ref: > faculty.id, note: 'ON DELETE CASCADE']
  course_id TEXT [ref: > courses.id, note: 'ON DELETE CASCADE']
  indexes {
    (faculty_id, course_id) [pk]
  }
}

Table enrollments {
  student_id TEXT [ref: > students.id, note: 'ON DELETE CASCADE']
  course_id TEXT [ref: > courses.id, note: 'ON DELETE CASCADE']
  indexes {
    (student_id, course_id) [pk]
  }
}

Table day_off_requests {
  id TEXT [pk]
  student_id TEXT [ref: > students.id, note: 'ON DELETE CASCADE']
  course_id TEXT [ref: > courses.id, note: 'ON DELETE CASCADE']
  faculty_id TEXT [ref: > faculty.id, note: 'ON DELETE CASCADE']
  schedule_id TEXT [ref: > course_schedules.id, note: 'ON DELETE CASCADE']
  date INTEGER [not null]
  reason TEXT [not null]
  status TEXT [default: 'pending', note: 'CHECK (status IN (\'pending\', \'approved\', \'rejected\'))']
  responded_at INTEGER
}

Table attendance {
  id TEXT [pk]
  student_id TEXT [ref: > students.id, note: 'ON DELETE CASCADE']
  course_id TEXT [ref: > courses.id, note: 'ON DELETE CASCADE']
  faculty_id TEXT [ref: > faculty.id, note: 'ON DELETE CASCADE']
  schedule_id TEXT [ref: > course_schedules.id, note: 'ON DELETE CASCADE']
  date INTEGER [not null]
  status TEXT [note: 'CHECK (status IN (\'present\', \'absent\', \'excused\'))']
}
```

### Mermaid Diagram code

```
erDiagram
    users {
        string id PK
        string email
        string password_hash
        string role
        int created_at
    }

    students {
        string id PK,FK
        string full_name
        int enrolled_at
    }

    faculty {
        string id PK,FK
        string full_name
        string department_id FK
    }

    departments {
        string id PK
        string name
    }

    courses {
        string id PK
        string name
        string code
        int credits
        string department_id FK
    }

    course_schedules {
        string id PK
        string course_id FK
        string day
        string start_time
        string end_time
    }

    course_assignments {
        string faculty_id PK,FK
        string course_id PK,FK
    }

    enrollments {
        string student_id PK,FK
        string course_id PK,FK
    }

    day_off_requests {
        string id PK
        string student_id FK
        string course_id FK
        string faculty_id FK
        string schedule_id FK
        int date
        string reason
        string status
        int responded_at
    }

    attendance {
        string id PK
        string student_id FK
        string course_id FK
        string faculty_id FK
        string schedule_id FK
        int date
        string status
    }

    users ||--o{ students : "has"
    users ||--o{ faculty : "has"
    departments ||--o{ faculty : "employs"
    departments ||--o{ courses : "offers"
    courses ||--o{ course_schedules : "has"
    faculty ||--o{ course_assignments : "teaches"
    courses ||--o{ course_assignments : "taught_by"
    students ||--o{ enrollments : "takes"
    courses ||--o{ enrollments : "taken_by"
    students ||--o{ day_off_requests : "submits"
    courses ||--o{ day_off_requests : "receives"
    faculty ||--o{ day_off_requests : "reviews"
    course_schedules ||--o{ day_off_requests : "applies_to"
    students ||--o{ attendance : "has"
    courses ||--o{ attendance : "tracks"
    faculty ||--o{ attendance : "records"
    course_schedules ||--o{ attendance : "for"
```
