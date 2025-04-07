import type React from "react"
// import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/theme-toggle"
import { BookOpen } from "lucide-react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    // redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-6 w-6" />
            <span>College Dashboard</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            {user && <UserNav user={user} />}
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-background md:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <DashboardNav />
          </div>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

