"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Mock data for todos
const mockTodos = [
  {
    id: 1,
    title: "Complete CS101 Assignment",
    description: "Finish the programming assignment due next week",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    completed: false,
    priority: "high",
  },
  {
    id: 2,
    title: "Study for MATH201 Midterm",
    description: "Review chapters 1-5",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    completed: false,
    priority: "high",
  },
  {
    id: 3,
    title: "Read ENG105 Article",
    description: "Read the assigned article and prepare notes",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    completed: false,
    priority: "medium",
  },
  {
    id: 4,
    title: "Submit Lab Report",
    description: "Complete and submit the physics lab report",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    completed: true,
    priority: "medium",
  },
  {
    id: 5,
    title: "Group Project Meeting",
    description: "Meet with team to discuss project progress",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    completed: false,
    priority: "low",
  },
]

export default function TodosPage() {
  const router = useRouter()
  const [todos, setTodos] = useState(mockTodos)
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())

  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: new Date(),
  })

  const handleAddTodo = () => {
    const todo = {
      id: todos.length + 1,
      ...newTodo,
      completed: false,
    }

    setTodos([...todos, todo])
    setNewTodo({
      title: "",
      description: "",
      priority: "medium",
      dueDate: new Date(),
    })
    setOpen(false)
    router.refresh()
  }

  const toggleTodoStatus = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
    router.refresh()
  }

  const pendingTodos = todos.filter((todo) => !todo.completed)
  const completedTodos = todos.filter((todo) => todo.completed)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Todo List</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>Create a new task for your todo list</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  placeholder="Task title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  placeholder="Task description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTodo.priority}
                    onValueChange={(value) => setNewTodo({ ...newTodo, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddTodo}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingTodos.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTodos.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="space-y-4">
          {pendingTodos.length > 0 ? (
            <div className="grid gap-4">
              {pendingTodos.map((todo) => (
                <Card key={todo.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{todo.title}</CardTitle>
                        <CardDescription>Due: {todo.dueDate.toLocaleDateString()}</CardDescription>
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          todo.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : todo.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {todo.priority}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{todo.description}</p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`todo-${todo.id}`}
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodoStatus(todo.id)}
                      />
                      <label
                        htmlFor={`todo-${todo.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Mark as completed
                      </label>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No pending tasks</p>
          )}
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          {completedTodos.length > 0 ? (
            <div className="grid gap-4">
              {completedTodos.map((todo) => (
                <Card key={todo.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg line-through text-muted-foreground">{todo.title}</CardTitle>
                        <CardDescription>Completed on: {new Date().toLocaleDateString()}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{todo.description}</p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`todo-${todo.id}`}
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodoStatus(todo.id)}
                      />
                      <label
                        htmlFor={`todo-${todo.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Mark as pending
                      </label>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No completed tasks</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

