import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { courses, schedules, enrollments } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

async function getStudentSchedule(userId: number) {
  return db
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
}

export default async function TimetablePage() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const schedule = await getStudentSchedule(user.id)

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
                  {scheduleByDay[day].length > 0 ? (
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
              <CardTitle>Today's Schedule</CardTitle>
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

