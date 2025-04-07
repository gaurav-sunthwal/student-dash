import { db } from "./index"
import * as schema from "./schema"
import { sql } from "drizzle-orm"

export async function seed() {
  try {
    // Create a test user
    await db
      .insert(schema.users)
      .values({
        name: "Test Student",
        email: "student@example.com",
        password: "$2a$10$GQH.xZRQJSXFBY6.XS3KI.4.uBgL0xmvGK9CRkMJ1XHtj5DGlBZRe", // password: password123
        role: "student",
      })
      .onConflictDoNothing()

    // Create some courses
    await db
      .insert(schema.courses)
      .values([
        {
          code: "CS101",
          name: "Introduction to Computer Science",
          description: "An introductory course to computer science principles",
          credits: 3,
        },
        {
          code: "MATH201",
          name: "Calculus I",
          description: "Introduction to differential and integral calculus",
          credits: 4,
        },
        {
          code: "ENG105",
          name: "English Composition",
          description: "Fundamentals of academic writing",
          credits: 3,
        },
      ])
      .onConflictDoNothing()

    // Get the user and courses
    const user = await db
      .select()
      .from(schema.users)
      .where(sql`email = 'student@example.com'`)
      .then((rows) => rows[0])
    const courses = await db.select().from(schema.courses)

    if (user && courses.length > 0) {
      // Create enrollments
      for (const course of courses) {
        await db
          .insert(schema.enrollments)
          .values({
            userId: user.id,
            courseId: course.id,
            semester: "Fall",
            year: 2023,
          })
          .onConflictDoNothing()
      }

      // Add some marks
      for (const course of courses) {
        await db
          .insert(schema.marks)
          .values([
            {
              userId: user.id,
              courseId: course.id,
              examType: "Midterm",
              score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
              maxScore: 100,
              semester: "Fall",
              year: 2023,
            },
            {
              userId: user.id,
              courseId: course.id,
              examType: "Assignment",
              score: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
              maxScore: 100,
              semester: "Fall",
              year: 2023,
            },
          ])
          .onConflictDoNothing()
      }

      // Add schedules
      const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
      const startTimes = ["09:00", "11:00", "13:00", "15:00"]
      const endTimes = ["10:30", "12:30", "14:30", "16:30"]
      const locations = ["Room 101", "Room 203", "Hall A", "Lab B"]

      for (let i = 0; i < courses.length; i++) {
        await db
          .insert(schema.schedules)
          .values({
            courseId: courses[i].id,
            dayOfWeek: daysOfWeek[i % daysOfWeek.length],
            startTime: startTimes[i % startTimes.length],
            endTime: endTimes[i % endTimes.length],
            location: locations[i % locations.length],
            semester: "Fall",
            year: 2023,
          })
          .onConflictDoNothing()
      }

      // Add some todos
      await db
        .insert(schema.todos)
        .values([
          {
            userId: user.id,
            title: "Complete CS101 Assignment",
            description: "Finish the programming assignment due next week",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            priority: "high",
          },
          {
            userId: user.id,
            title: "Study for MATH201 Midterm",
            description: "Review chapters 1-5",
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            priority: "high",
          },
          {
            userId: user.id,
            title: "Read ENG105 Article",
            description: "Read the assigned article and prepare notes",
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            priority: "medium",
          },
        ])
        .onConflictDoNothing()

      // Add announcements
      for (const course of courses) {
        await db
          .insert(schema.announcements)
          .values({
            title: `Important ${course.code} Announcement`,
            content: `This is an important announcement for ${course.name}. Please check the course materials for updates.`,
            courseId: course.id,
          })
          .onConflictDoNothing()
      }
    }

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

