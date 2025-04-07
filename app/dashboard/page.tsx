import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { announcements, courses, marks, todos } from "@/lib/db/schema"
import { eq, and, gte, count } from "drizzle-orm"
import { CalendarDays, GraduationCap, CheckSquare, Bell } from "lucide-react"
import Link from "next/link"

async function getStudentStats(userId: number) {
  const coursesCount = await db
    .select({ count: count() })
    .from(courses)
    .innerJoin(marks, eq(courses.id, marks.courseId))
    .where(eq(marks.userId, userId))

  const upcomingTodos = await db
    .select({ count: count() })
    .from(todos)
    .where(and(eq(todos.userId, userId), eq(todos.completed, false), gte(todos.dueDate, new Date())))

  const recentAnnouncements = await db
    .select({ count: count() })
    .from(announcements)
    .where(gte(announcements.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))) // Last 7 days

  return {
    coursesCount: coursesCount[0]?.count || 0,
    upcomingTodos: upcomingTodos[0]?.count || 0,
    recentAnnouncements: recentAnnouncements[0]?.count || 0,
  }
}

async function getRecentAnnouncements() {
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
    .limit(5)
}

async function getUpcomingTodos(userId: number) {
  return db
    .select({
      id: todos.id,
      title: todos.title,
      dueDate: todos.dueDate,
      priority: todos.priority,
      completed: todos.completed,
    })
    .from(todos)
    .where(and(eq(todos.userId, userId), eq(todos.completed, false), gte(todos.dueDate, new Date())))
    .orderBy(todos.dueDate)
    .limit(5)
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const stats = await getStudentStats(user.id)
  const announcements = await getRecentAnnouncements()
  const todos = await getUpcomingTodos(user.id)

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.coursesCount}</div>
            <p className="text-xs text-muted-foreground">Active courses this semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingTodos}</div>
            <p className="text-xs text-muted-foreground">Tasks due soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Announcements</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentAnnouncements}</div>
            <p className="text-xs text-muted-foreground">New in the last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Class</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">CS101</div>
            <p className="text-xs text-muted-foreground">Today at 11:00 AM in Room 101</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="announcements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="todos">Upcoming Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="announcements" className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Announcements</h2>
          <div className="grid gap-4">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <span className="text-xs text-muted-foreground">{announcement.courseCode}</span>
                    </div>
                    <CardDescription>{new Date(announcement.createdAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{announcement.content}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">No recent announcements</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="todos" className="space-y-4">
          <h2 className="text-xl font-semibold">Upcoming Tasks</h2>
          <div className="grid gap-4">
            {todos.length > 0 ? (
              todos.map((todo) => (
                <Card key={todo.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{todo.title}</CardTitle>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          todo.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : todo.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {todo.priority}
                      </span>
                    </div>
                    <CardDescription>
                      Due: {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "No due date"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">No upcoming tasks</p>
            )}
            <Link href="/dashboard/todos" className="text-sm text-primary hover:underline">
              View all tasks →
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

