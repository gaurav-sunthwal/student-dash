import { cookies } from "next/headers"
import { db } from "./db"
import { users } from "./db/schema"
import { eq } from "drizzle-orm"

export async function getSession() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get("session_id")?.value

  if (!sessionId) {
    return null
  }

  try {
    // In a real app, you would validate the session from a sessions table
    // For simplicity, we're just checking if the user exists
    const userId = Number.parseInt(sessionId)
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) {
      return null
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user || null
}

