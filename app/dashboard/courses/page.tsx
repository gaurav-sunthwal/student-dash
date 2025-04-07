import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { courses, enrollments } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

async function getStudentCourses(userId: number) {
  return db
    .select({
      id: courses.id,
      code: courses.code,
      name: courses.name,
      description: courses.description,
      credits: courses.credits,
      semester: enrollments.semester,
      year: enrollments.year,
    })
    .from(courses)
    .innerJoin(enrollments, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.userId, userId))
    .orderBy(courses.code)
}

export default async function CoursesPage() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const studentCourses = await getStudentCourses(user.id)

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Current Semester</TabsTrigger>
          <TabsTrigger value="all">All Courses</TabsTrigger>
        </TabsList>
        <TabsContent value="current" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {studentCourses
              .filter((course) => course.semester === "Fall" && course.year === 2023)
              .map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>{course.code}</CardTitle>
                      <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {course.credits} credits
                      </div>
                    </div>
                    <CardDescription>{course.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{course.description || "No description available"}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {studentCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>{course.code}</CardTitle>
                    <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {course.credits} credits
                    </div>
                  </div>
                  <CardDescription>
                    {course.name}
                    <div className="mt-1 text-xs">
                      {course.semester} {course.year}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{course.description || "No description available"}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

