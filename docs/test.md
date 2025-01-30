```sql
-- Insert Users (admins, faculty, students, dean)
INSERT INTO users (id, email, password, role) VALUES
-- Admins
('admin1', 'admin@ewu.edu', 'admin', 'admin'),
-- Dean
('dean_cs', 'dean.cs@ewu.edu', '1234', 'dean'),
-- Faculty
('faculty1', 'faculty1@ewu.edu', '1234', 'faculty'),
('faculty2', 'faculty2@ewu.edu', '1234', 'faculty'),
-- Students
('student1', 'student1@ewu.edu', '1234', 'student'),
('student2', 'student2@ewu.edu', '1234', 'student'),
('student3', 'student3@ewu.edu', '1234', 'student');

-- Insert Departments
INSERT INTO departments (id, name) VALUES
('dept_cs', 'Computer Science'),
('dept_math', 'Mathematics'),
('dept_phy', 'Physics');

-- Insert Faculty Details
INSERT INTO faculty (id, full_name, department_id) VALUES
('faculty1', 'Dr. Alice Smith', 'dept_cs'),
('faculty2', 'Prof. Bob Jones', 'dept_math'),
('dean_cs', 'Dean Emily Brown', 'dept_cs');

-- Insert Students
INSERT INTO students (id, full_name) VALUES
('student1', 'John Doe'),
('student2', 'Jane Smith'),
('student3', 'Mike Johnson');

-- Insert Courses
INSERT INTO courses (id, name, code, credits, department_id) VALUES
('course1', 'Introduction to Programming', 'CS101', 4, 'dept_cs'),
('course2', 'Data Structures', 'CS201', 3, 'dept_cs'),
('course3', 'Calculus I', 'MATH101', 4, 'dept_math');

-- Insert Course Schedules
INSERT INTO course_schedules (id, course_id, day, start_time, end_time) VALUES
('sched1', 'course1', 'monday', '09:00', '11:00'),
('sched2', 'course1', 'wednesday', '09:00', '11:00'),
('sched3', 'course3', 'tuesday', '13:00', '15:00');

-- Course Assignments
INSERT INTO course_assignments (faculty_id, course_id) VALUES
('faculty1', 'course1'),
('faculty1', 'course2'),
('faculty2', 'course3');

-- Enrollments
INSERT INTO enrollments (student_id, course_id) VALUES
('student1', 'course1'),
('student1', 'course3'),
('student2', 'course1'),
('student3', 'course3');

-- Day-Off Requests
INSERT INTO day_off_requests (id, student_id, course_id, faculty_id, schedule_id, date, reason, status) VALUES
('req1', 'student1', 'course1', 'faculty1', 'sched1', 1672578000, 'Medical appointment', 'approved'),
('req2', 'student2', 'course1', 'faculty1', 'sched2', 1672840800, 'Family emergency', 'pending');

-- Attendance Records
INSERT INTO attendance (id, student_id, course_id, faculty_id, schedule_id, date, status) VALUES
('att1', 'student1', 'course1', 'faculty1', 'sched1', 1672578000, 'excused'),
('att2', 'student2', 'course1', 'faculty1', 'sched1', 1672578000, 'present'),
('att3', 'student1', 'course3', 'faculty2', 'sched3', 1672664400, 'absent');
```
