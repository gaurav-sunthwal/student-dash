"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, Calendar, CheckSquare, Home, BarChart3, Bell, Settings, LogOut } from "lucide-react"

const navItems = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Marks",
    href: "/dashboard/marks",
    icon: BarChart3,
  },
  {
    name: "Timetable",
    href: "/dashboard/timetable",
    icon: Calendar,
  },
  {
    name: "Todo List",
    href: "/dashboard/todos",
    icon: CheckSquare,
  },
  {
    name: "Courses",
    href: "/dashboard/courses",
    icon: BookOpen,
  },
  {
    name: "Announcements",
    href: "/dashboard/announcements",
    icon: Bell,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    })
    window.location.href = "/login"
  }

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          <span>{item.name}</span>
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-100 hover:text-red-600"
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Logout</span>
      </button>
    </nav>
  )
}

