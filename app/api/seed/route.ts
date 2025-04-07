import { NextResponse } from "next/server"
import { seed } from "@/lib/db/migrations"

export async function GET() {
  try {
    await seed()
    return NextResponse.json({ success: true, message: "Database seeded successfully" })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ success: false, error: "Failed to seed database" }, { status: 500 })
  }
}

