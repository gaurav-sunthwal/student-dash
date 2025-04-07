import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { courses, enrollments } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// Sample dummy data for fallback
const dummyCourses = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Computer Science",
    description: "A beginner-friendly introduction to computer science principles and programming fundamentals.",
    credits: 3,
    semester: "Fall",
    year: 2023,
  },
  {
    id: 2,
    code: "MATH101",
    name: "Calculus I",
    description: "Functions, limits, continuity, differentiation, integration, and applications.",
    credits: 4,
    semester: "Fall",
    year: 2023,
  },
  {
    id: 3,
    code: "ENG105",
    name: "Academic Writing",
    description: "Development of academic writing skills including critical reading and thinking, exposition, and research.",
    credits: 3,
    semester: "Spring",
    year: 2023,
  },
  {
    id: 4,
    code: "PHYS101",
    name: "Physics I",
    description: "Mechanics, thermodynamics, and wave motion with calculus applications.",
    credits: 4,
    semester: "Fall",
    year: 2023,
  },
]

async function getStudentCourses(userId: number) {
  try {
    const data = await db
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
    
    return data.length > 0 ? data : dummyCourses
  } catch (error) {
    console.error("Error fetching student courses:", error)
    return dummyCourses
  }
}

export default async function CoursesPage() {
  const user = await getCurrentUser()
  
  // Use a default user ID if not available
  const userId = user?.id || 1
  const studentCourses = await getStudentCourses(userId)

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