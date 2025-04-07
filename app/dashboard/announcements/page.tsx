import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"
import { announcements, courses } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// Sample dummy data for fallback
const dummyAnnouncements = [
  {
    id: 1,
    title: "Welcome to Fall Semester",
    content: "Welcome to the Fall 2023 semester! We're excited to have you join us.",
    createdAt: new Date(),
    courseName: "Introduction to Computer Science",
    courseCode: "CS101",
  },
  {
    id: 2,
    title: "Midterm Schedule Posted",
    content: "The midterm examination schedule has been posted. Please check your student portal for details.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    courseName: "Calculus I",
    courseCode: "MATH101",
  },
  {
    id: 3,
    title: "Library Hours Extended",
    content: "The university library will extend its hours during finals week to support your study needs.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    courseName: null,
    courseCode: null,
  },
]

async function getAnnouncements() {
  try {
    const data = await db
      .select({
        id: announcements.id,
        title: announcements.title,
        content: announcements.content,
        createdAt: announcements.createdAt,
        courseName: courses.name,
        courseCode: courses.code,
      })
      .from(announcements)
      .leftJoin(courses, eq(announcements.courseId, courses.id))
      .orderBy(announcements.createdAt)
    
    return data.length > 0 ? data : dummyAnnouncements
  } catch (error) {
    console.error("Error fetching announcements:", error)
    return dummyAnnouncements
  }
}

export default async function AnnouncementsPage() {
  const allAnnouncements = await getAnnouncements()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>

      <div className="grid gap-4">
        {allAnnouncements.map((announcement) => (
          <Card key={announcement.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{announcement.title}</CardTitle>
                {announcement.courseCode && (
                  <span className="text-xs text-muted-foreground">{announcement.courseCode}</span>
                )}
              </div>
              <CardDescription>
                {new Date(announcement.createdAt).toLocaleDateString()} at{" "}
                {new Date(announcement.createdAt).toLocaleTimeString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{announcement.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}