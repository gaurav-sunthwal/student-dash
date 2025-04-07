import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center border-b px-4 md:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-6 w-6" />
          <span>College Dashboard</span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline">
            Login
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Your College Dashboard
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Access all your college information in one place. Track your courses, grades, schedule, and more.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/login">
                  <Button>Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Track Your Grades</h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Keep track of your academic performance across all your courses.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Manage Your Schedule</h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    View your class schedule and never miss an important session.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Stay Organized</h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Manage your tasks and deadlines with the built-in todo list.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex h-16 items-center border-t px-4 md:px-6">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} College Dashboard. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

