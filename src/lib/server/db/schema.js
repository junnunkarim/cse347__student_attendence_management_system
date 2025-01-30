import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

// Base User Table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "faculty", "student", "dean"] })
    .notNull(),
  created_at: integer("created_at").default(sql`(unixepoch())`),
});

// Student Profiles
export const students = sqliteTable("students", {
  id: text("id").primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  full_name: text("full_name").notNull(),
  enrolled_at: integer("enrolled_at").default(sql`(unixepoch())`),
});

// Faculty Profiles
export const faculty = sqliteTable("faculty", {
  id: text("id").primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  full_name: text("full_name").notNull(),
  department_id: text("department_id")
    .references(() => departments.id, { onDelete: "set null" }),
});

// Academic Departments
export const departments = sqliteTable("departments", {
  id: text("id").primaryKey(),
  name: text("name").unique().notNull(),
});

// Course Definitions
export const courses = sqliteTable("courses", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").unique().notNull(),
  credits: integer("credits").notNull(),
  department_id: text("department_id")
    .references(() => departments.id, { onDelete: "cascade" }),
});

// Course Schedule Times
export const courseSchedules = sqliteTable("course_schedules", {
  id: text("id").primaryKey(),
  course_id: text("course_id")
    .references(() => courses.id, { onDelete: "cascade" }),
  day: text("day", {
    enum: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  }),
  start_time: text("start_time").notNull(),
  end_time: text("end_time").notNull(),
}, (table) => ({
  courseIdx: index("schedule_course_idx").on(table.course_id),
}));

// Faculty Course Assignments
export const courseAssignments = sqliteTable("course_assignments", {
  faculty_id: text("faculty_id")
    .references(() => faculty.id, { onDelete: "cascade" }),
  course_id: text("course_id")
    .references(() => courses.id, { onDelete: "cascade" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.faculty_id, table.course_id] }),
}));

// Student Enrollments
export const enrollments = sqliteTable("enrollments", {
  student_id: text("student_id")
    .references(() => students.id, { onDelete: "cascade" }),
  course_id: text("course_id")
    .references(() => courses.id, { onDelete: "cascade" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.student_id, table.course_id] }),
}));

// Day Off Requests
export const dayOffRequests = sqliteTable("day_off_requests", {
  id: text("id").primaryKey(),
  student_id: text("student_id")
    .references(() => students.id, { onDelete: "cascade" }),
  course_id: text("course_id")
    .references(() => courses.id, { onDelete: "cascade" }),
  faculty_id: text("faculty_id")
    .references(() => faculty.id, { onDelete: "cascade" }),
  schedule_id: text("schedule_id")
    .references(() => courseSchedules.id, { onDelete: "cascade" }),
  date: integer("date").notNull(),
  reason: text("reason").notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).default(
    "pending",
  ),
  responded_at: integer("responded_at"),
}, (table) => ({
  studentIdx: index("request_student_idx").on(table.student_id),
  facultyIdx: index("request_faculty_idx").on(table.faculty_id),
}));

// Attendance Records
export const attendance = sqliteTable("attendance", {
  id: text("id").primaryKey(),
  student_id: text("student_id")
    .references(() => students.id, { onDelete: "cascade" }),
  course_id: text("course_id")
    .references(() => courses.id, { onDelete: "cascade" }),
  faculty_id: text("faculty_id")
    .references(() => faculty.id, { onDelete: "cascade" }),
  schedule_id: text("schedule_id")
    .references(() => courseSchedules.id, { onDelete: "cascade" }),
  date: integer("date").notNull(),
  status: text("status", { enum: ["present", "absent", "excused"] }),
}, (table) => ({
  studentIdx: index("attendance_student_idx").on(table.student_id),
  courseIdx: index("attendance_course_idx").on(table.course_id),
  dateIdx: index("attendance_date_idx").on(table.date),
}));

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  student: one(students, { fields: [users.id], references: [students.id] }),
  faculty: one(faculty, { fields: [users.id], references: [faculty.id] }),
}));

export const studentsRelations = relations(students, ({ many }) => ({
  enrollments: many(enrollments),
  dayOffRequests: many(dayOffRequests),
  attendance: many(attendance),
}));

export const facultyRelations = relations(faculty, ({ many }) => ({
  assignments: many(courseAssignments),
  dayOffRequests: many(dayOffRequests),
  attendance: many(attendance),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  schedules: many(courseSchedules),
  assignments: many(courseAssignments),
  enrollments: many(enrollments),
}));
