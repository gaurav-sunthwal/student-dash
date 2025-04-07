import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"
import { announcements, courses } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

async function getAnnouncements() {
  return db
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
}

export default async function AnnouncementsPage() {
  const allAnnouncements = await getAnnouncements()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>

      <div className="grid gap-4">
        {allAnnouncements.length > 0 ? (
          allAnnouncements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{announcement.title}</CardTitle>
                  <span className="text-xs text-muted-foreground">{announcement.courseCode}</span>
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
          ))
        ) : (
          <p className="text-muted-foreground">No announcements available</p>
        )}
      </div>
    </div>
  )
}

