import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { courses, schedules, enrollments } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

// Sample dummy data for fallback
const dummySchedule = [
  {
    id: 1,
    dayOfWeek: "Monday",
    startTime: "09:00",
    endTime: "10:30",
    location: "Building A, Room 101",
    semester: "Fall",
    year: 2023,
    courseName: "Introduction to Computer Science",
    courseCode: "CS101",
  },
  {
    id: 2,
    dayOfWeek: "Monday",
    startTime: "14:00",
    endTime: "15:30",
    location: "Building B, Room 205",
    semester: "Fall",
    year: 2023,
    courseName: "Calculus I",
    courseCode: "MATH101",
  },
  {
    id: 3,
    dayOfWeek: "Tuesday",
    startTime: "11:00",
    endTime: "12:30",
    location: "Library, Room 112",
    semester: "Fall",
    year: 2023,
    courseName: "Academic Writing",
    courseCode: "ENG105",
  },
  {
    id: 4,
    dayOfWeek: "Wednesday",
    startTime: "09:00",
    endTime: "10:30",
    location: "Building A, Room 101",
    semester: "Fall",
    year: 2023,
    courseName: "Introduction to Computer Science",
    courseCode: "CS101",
  },
  {
    id: 5,
    dayOfWeek: "Thursday",
    startTime: "13:00",
    endTime: "15:00",
    location: "Science Lab, Room 302",
    semester: "Fall",
    year: 2023,
    courseName: "Physics I",
    courseCode: "PHYS101",
  },
  {
    id: 6,
    dayOfWeek: "Friday",
    startTime: "10:00",
    endTime: "11:30",
    location: "Building C, Room 405",
    semester: "Fall",
    year: 2023,
    courseName: "Calculus I",
    courseCode: "MATH101",
  },
]

async function getStudentSchedule(userId: number) {
  try {
    const data = await db
      .select({
        id: schedules.id,
        dayOfWeek: schedules.dayOfWeek,
        startTime: schedules.startTime,
        endTime: schedules.endTime,
        location: schedules.location,
        semester: schedules.semester,
        year: schedules.year,
        courseName: courses.name,
        courseCode: courses.code,
      })
      .from(schedules)
      .innerJoin(courses, eq(schedules.courseId, courses.id))
      .innerJoin(enrollments, and(eq(enrollments.courseId, courses.id), eq(enrollments.userId, userId)))
      .orderBy(schedules.dayOfWeek, schedules.startTime)
    
    return data.length > 0 ? data : dummySchedule
  } catch (error) {
    console.error("Error fetching student schedule:", error)
    return dummySchedule
  }
}

export default async function TimetablePage() {
  const user = await getCurrentUser()
  
  // Use a default user ID if not available
  const userId = user?.id || 1
  const schedule = await getStudentSchedule(userId)

  // Group schedule by day
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const scheduleByDay = days.reduce(
    (acc, day) => {
      acc[day] = schedule.filter((item) => item.dayOfWeek === day)
      return acc
    },
    {} as Record<string, typeof schedule>,
  )

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Class Schedule</h1>

      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          <TabsTrigger value="daily">Daily View</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-5">
            {days.map((day) => (
              <Card key={day} className="h-full">
                <CardHeader>
                  <CardTitle>{day}</CardTitle>
                </CardHeader>
                <CardContent>
                  {scheduleByDay[day] && scheduleByDay[day].length > 0 ? (
                    <div className="space-y-3">
                      {scheduleByDay[day].map((item) => (
                        <div key={item.id} className="rounded-md border p-3">
                          <div className="font-medium">{item.courseCode}</div>
                          <div className="text-sm text-muted-foreground">{item.courseName}</div>
                          <div className="mt-2 text-xs">
                            <div className="flex justify-between">
                              <span>
                                {item.startTime} - {item.endTime}
                              </span>
                            </div>
                            <div>{item.location}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No classes scheduled</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{`Today's Schedule`}</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
                const todaySchedule = scheduleByDay[today] || []

                return todaySchedule.length > 0 ? (
                  <div className="space-y-4">
                    {todaySchedule.map((item) => (
                      <div key={item.id} className="flex items-start space-x-4 rounded-md border p-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{item.courseCode}</div>
                              <div className="text-sm text-muted-foreground">{item.courseName}</div>
                            </div>
                            <div className="text-sm font-medium">
                              {item.startTime} - {item.endTime}
                            </div>
                          </div>
                          <div className="mt-2 text-sm">
                            <div>Location: {item.location}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No classes scheduled for today</p>
                )
              })()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}