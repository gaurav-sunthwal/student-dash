import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// In a real app, you would use a proper password hashing library like bcrypt
// This is a simplified version for demonstration purposes
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // In a real app: return await bcrypt.compare(password, hashedPassword);
  return hashedPassword === "$2a$10$GQH.xZRQJSXFBY6.XS3KI.4.uBgL0xmvGK9CRkMJ1XHtj5DGlBZRe" && password === "password123"
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Set a cookie with the user ID as a simple session
    // In a real app, you would use a proper session management system
    const cookieStore = await cookies();
    cookieStore.set({
      name: "session_id",
      value: user.id.toString(),
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}

