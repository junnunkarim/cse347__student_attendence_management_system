CREATE TABLE `attendance` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text,
	`course_id` text,
	`faculty_id` text,
	`schedule_id` text,
	`date` integer NOT NULL,
	`status` text,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`faculty_id`) REFERENCES `faculty`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`schedule_id`) REFERENCES `course_schedules`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `attendance_student_idx` ON `attendance` (`student_id`);--> statement-breakpoint
CREATE INDEX `attendance_course_idx` ON `attendance` (`course_id`);--> statement-breakpoint
CREATE INDEX `attendance_date_idx` ON `attendance` (`date`);--> statement-breakpoint
CREATE TABLE `course_assignments` (
	`faculty_id` text,
	`course_id` text,
	PRIMARY KEY(`faculty_id`, `course_id`),
	FOREIGN KEY (`faculty_id`) REFERENCES `faculty`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `course_schedules` (
	`id` text PRIMARY KEY NOT NULL,
	`course_id` text,
	`day` text,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `schedule_course_idx` ON `course_schedules` (`course_id`);--> statement-breakpoint
CREATE TABLE `courses` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`credits` integer NOT NULL,
	`department_id` text,
	FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `courses_code_unique` ON `courses` (`code`);--> statement-breakpoint
CREATE TABLE `day_off_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text,
	`course_id` text,
	`faculty_id` text,
	`schedule_id` text,
	`date` integer NOT NULL,
	`reason` text NOT NULL,
	`status` text DEFAULT 'pending',
	`responded_at` integer,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`faculty_id`) REFERENCES `faculty`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`schedule_id`) REFERENCES `course_schedules`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `request_student_idx` ON `day_off_requests` (`student_id`);--> statement-breakpoint
CREATE INDEX `request_faculty_idx` ON `day_off_requests` (`faculty_id`);--> statement-breakpoint
CREATE TABLE `departments` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `departments_name_unique` ON `departments` (`name`);--> statement-breakpoint
CREATE TABLE `enrollments` (
	`student_id` text,
	`course_id` text,
	PRIMARY KEY(`student_id`, `course_id`),
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `faculty` (
	`id` text PRIMARY KEY NOT NULL,
	`full_name` text NOT NULL,
	`department_id` text,
	FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` text PRIMARY KEY NOT NULL,
	`full_name` text NOT NULL,
	`enrolled_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);