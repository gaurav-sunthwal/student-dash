import { relations } from "drizzle-orm"
import { boolean, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core"

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("student").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  credits: integer("credits").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Student-Course enrollments
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  semester: varchar("semester", { length: 50 }).notNull(),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Marks/Grades table
export const marks = pgTable("marks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  examType: varchar("exam_type", { length: 50 }).notNull(), // midterm, final, assignment, etc.
  score: integer("score").notNull(),
  maxScore: integer("max_score").notNull(),
  semester: varchar("semester", { length: 50 }).notNull(),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Timetable/Schedule table
export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  dayOfWeek: varchar("day_of_week", { length: 10 }).notNull(), // Monday, Tuesday, etc.
  startTime: varchar("start_time", { length: 10 }).notNull(), // HH:MM format
  endTime: varchar("end_time", { length: 10 }).notNull(), // HH:MM format
  location: varchar("location", { length: 100 }),
  semester: varchar("semester", { length: 50 }).notNull(),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Todo list table
export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  completed: boolean("completed").default(false).notNull(),
  priority: varchar("priority", { length: 20 }).default("medium").notNull(), // low, medium, high
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Announcements table
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  enrollments: many(enrollments),
  marks: many(marks),
  todos: many(todos),
}))

export const coursesRelations = relations(courses, ({ many }) => ({
  enrollments: many(enrollments),
  marks: many(marks),
  schedules: many(schedules),
  announcements: many(announcements),
}))

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}))

export const marksRelations = relations(marks, ({ one }) => ({
  user: one(users, {
    fields: [marks.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [marks.courseId],
    references: [courses.id],
  }),
}))

export const schedulesRelations = relations(schedules, ({ one }) => ({
  course: one(courses, {
    fields: [schedules.courseId],
    references: [courses.id],
  }),
}))

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
}))

export const announcementsRelations = relations(announcements, ({ one }) => ({
  course: one(courses, {
    fields: [announcements.courseId],
    references: [courses.id],
  }),
}))

