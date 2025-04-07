import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { courses, marks } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

async function getStudentMarks(userId: number) {
  return db
    .select({
      id: marks.id,
      examType: marks.examType,
      score: marks.score,
      maxScore: marks.maxScore,
      semester: marks.semester,
      year: marks.year,
      courseName: courses.name,
      courseCode: courses.code,
    })
    .from(marks)
    .innerJoin(courses, eq(marks.courseId, courses.id))
    .where(eq(marks.userId, userId))
    .orderBy(courses.code)
}

export default async function MarksPage() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const studentMarks = await getStudentMarks(user.id)

  // Group marks by course
  const marksByCourse = studentMarks.reduce(
    (acc, mark) => {
      if (!acc[mark.courseCode]) {
        acc[mark.courseCode] = {
          courseCode: mark.courseCode,
          courseName: mark.courseName,
          marks: [],
        }
      }
      acc[mark.courseCode].marks.push(mark)
      return acc
    },
    {} as Record<string, { courseCode: string; courseName: string; marks: typeof studentMarks }>,
  )

  // Calculate GPA (simplified)
  const calculateGPA = (marks: typeof studentMarks) => {
    if (marks.length === 0) return 0

    const totalPercentage = marks.reduce((sum, mark) => {
      return sum + (mark.score / mark.maxScore) * 100
    }, 0)

    const averagePercentage = totalPercentage / marks.length

    // Simple conversion to 4.0 scale (simplified)
    if (averagePercentage >= 90) return 4.0
    if (averagePercentage >= 80) return 3.5
    if (averagePercentage >= 70) return 3.0
    if (averagePercentage >= 60) return 2.5
    if (averagePercentage >= 50) return 2.0
    return 1.0
  }

  const overallGPA = calculateGPA(studentMarks)

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Academic Performance</h1>

      <Card>
        <CardHeader>
          <CardTitle>Overall GPA</CardTitle>
          <CardDescription>Your current academic standing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{overallGPA.toFixed(2)}</div>
          <p className="text-sm text-muted-foreground mt-2">Based on all your course grades</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="current">Current Semester</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {Object.values(marksByCourse).map((course) => (
              <Card key={course.courseCode}>
                <CardHeader>
                  <CardTitle>{course.courseCode}</CardTitle>
                  <CardDescription>{course.courseName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {course.marks.map((mark) => (
                      <div key={mark.id} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{mark.examType}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {mark.semester} {mark.year}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold">{mark.score}</span>
                          <span className="text-muted-foreground">/{mark.maxScore}</span>
                          <span className="ml-2 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {Math.round((mark.score / mark.maxScore) * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="current" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {Object.values(marksByCourse)
              .filter((course) => course.marks.some((mark) => mark.semester === "Fall" && mark.year === 2023))
              .map((course) => (
                <Card key={course.courseCode}>
                  <CardHeader>
                    <CardTitle>{course.courseCode}</CardTitle>
                    <CardDescription>{course.courseName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {course.marks
                        .filter((mark) => mark.semester === "Fall" && mark.year === 2023)
                        .map((mark) => (
                          <div key={mark.id} className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{mark.examType}</span>
                            </div>
                            <div>
                              <span className="font-bold">{mark.score}</span>
                              <span className="text-muted-foreground">/{mark.maxScore}</span>
                              <span className="ml-2 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                {Math.round((mark.score / mark.maxScore) * 100)}%
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

