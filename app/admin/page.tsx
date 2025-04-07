'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';

export default function SeedDummyDataPage() {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/seed?action=seed');
      const data = await res.json();
      if (res.ok) toast.success(data.message);
      else toast.error(data.error);
    } catch {
      toast.error('Seeding failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Admin: Seed Dummy Data</h1>
      <Button onClick={handleSeed} disabled={loading}>
        {loading ? 'Seeding...' : 'Seed All Tables'}
      </Button>
    </div>
  );
}

// --- Server action handler (GET) ---

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
 courses, enrollments, marks, schedules, todos, announcements,
 users,
} from '@/lib/db/schema';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  if (action !== 'seed') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  try {
    // Insert users including the dummy user
    const insertedUsers = await db.insert(users).values([
      { name: 'Alice', email: 'alice@example.com', password: 'pwd1', role: 'student' },
      { name: 'Bob', email: 'bob@example.com', password: 'pwd2', role: 'teacher' },
      { name: 'Admin', email: 'admin@example.com', password: 'adminpwd', role: 'admin' },
      { name: 'Dummy User', email: 'dummyuser@example.com', password: 'dummypwd', role: 'student' },
    ]).returning({ id: users.id, email: users.email });

    const dummyUser = insertedUsers.find(u => u.email === 'dummyuser@example.com');
    const dummyUserId = dummyUser?.id || 1;

    // Insert courses
    const insertedCourses = await db.insert(courses).values([
      { code: 'CS101', name: 'Computer Science', description: 'Basics of CS', credits: 3 },
      { code: 'MATH102', name: 'Maths', description: 'Math stuff', credits: 4 },
    ]).returning({ id: courses.id });

    const course1Id = insertedCourses[0]?.id || 1;
    const course2Id = insertedCourses[1]?.id || 2;

    // Insert enrollments
    await db.insert(enrollments).values([
      { userId: dummyUserId, courseId: course1Id, semester: 'Fall', year: 2024 },
      { userId: dummyUserId, courseId: course2Id, semester: 'Fall', year: 2024 },
    ]);

    // Insert marks
    await db.insert(marks).values([
      { userId: dummyUserId, courseId: course1Id, examType: 'midterm', score: 88, maxScore: 100, semester: 'Fall', year: 2024 },
    ]);

    // Insert schedules
    await db.insert(schedules).values([
      { courseId: course1Id, dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:30', location: 'Room A', semester: 'Fall', year: 2024 },
    ]);

    // Insert todos
    await db.insert(todos).values([
      { userId: dummyUserId, title: 'Read Chapter 1', description: 'From CS101 book', dueDate: new Date(), completed: false, priority: 'high' },
    ]);

    // Insert announcements
    await db.insert(announcements).values([
      { courseId: course1Id, title: 'Welcome!', content: 'First class starts on Monday.' },
    ]);

    return NextResponse.json({ message: 'Dummy user and data seeded successfully.' });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
  }
}