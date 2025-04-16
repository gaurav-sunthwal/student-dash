"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


import { CalendarDays, GraduationCap, CheckSquare, Bell } from "lucide-react"
import Link from "next/link"

// Removed unused getStudentStats function to resolve the error

// async function getRecentAnnouncements() {
//   const result = await db
//     .select({
//       id: announcements.id,
//       title: announcements.title,
//       content: announcements.content,
//       createdAt: announcements.createdAt,
//       courseName: courses.name,
//       courseCode: courses.code,
//     })
//     .from(announcements)
//     .leftJoin(courses, eq(announcements.courseId, courses.id))
//     .orderBy(announcements.createdAt)
//     .limit(5)
  
//   // Ensure each announcement has the required fields
//   return result.map(item => ({
//     ...item,
//     id: item.id || 0,
//     title: item.title || "",
//     content: item.content || "",
//     createdAt: item.createdAt || new Date(),
//     courseCode: item.courseCode || "N/A"
//   }))
// }


interface Todo {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  dueDate?: string | Date;
}

interface User {
  name: string;
  // Add other properties of the user object as needed
}

interface Stats {
  coursesCount: number;
  upcomingTodos: number;
  recentAnnouncements: number;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  createdAt: string | Date;
  courseCode: string;
}

export default function DashboardPage() {
  // Mock data for demonstration; replace with actual data fetching logic
  const user: User = { name: "Gaurav Sunthwal" };
  const stats: Stats = { coursesCount: 5, upcomingTodos: 3, recentAnnouncements: 2 };
  const announcementsList: Announcement[] = [
    { id: 1, title: "Exam Schedule", content: "The exam schedule is out.", createdAt: new Date(), courseCode: "CS101" },
    { id: 2, title: "Holiday Notice", content: "Next Monday is a holiday.", createdAt: new Date(), courseCode: "CS102" },
  ];
  const todosList: Todo[] = [
    { id: "1", title: "Submit Assignment", priority: "high", dueDate: new Date() },
    { id: "2", title: "Prepare for Quiz", priority: "medium", dueDate: new Date() },
  ];

  if (!user) {
    return null;
  }

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
            {announcementsList && announcementsList.length > 0 ? (
              announcementsList.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <span className="text-xs text-muted-foreground">{announcement.courseCode}</span>
                    </div>
                    <CardDescription>
                      {announcement.createdAt instanceof Date 
                        ? announcement.createdAt.toLocaleDateString() 
                        : new Date(announcement.createdAt).toLocaleDateString()}
                    </CardDescription>
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
            {todosList && todosList.length > 0 ? (
              todosList.map((todo) => (
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
                Due: {todo.dueDate 
                ? (todo.dueDate instanceof Date 
                ? todo.dueDate.toLocaleDateString() 
                : new Date(todo.dueDate).toLocaleDateString())
                : "No due date"}
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