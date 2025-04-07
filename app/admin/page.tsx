// "use client";

// import React, { useState, useEffect } from 'react';
// import { db } from "@/lib/db";
// import { announcements, courses, marks, todos, users, enrollments, schedules } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";
// import { 
//   Users, Book, UserCheck, Award, Calendar, Bell, CheckSquare, 
//   Plus, Edit, Trash2, Search, RefreshCw, Save, Moon, Sun
// } from 'lucide-react';

// // Import Shadcn UI components
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { 
//   Card, 
//   CardContent, 
//   CardDescription, 
//   CardFooter, 
//   CardHeader, 
//   CardTitle 
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { useTheme } from "next-themes";

// // Define types
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   createdAt: string;
//   password?: string;
// }

// interface Course {
//   id: string;
//   code: string;
//   name: string;
//   credits: number;
//   description: string;
// }

// interface Announcement {
//   id: string;
//   title: string;
//   content: string;
//   courseId: string | null;
//   createdAt: string;
// }

// interface Mark {
//   id: string;
//   userId: string;
//   courseId: string;
//   examType: string;
//   score: number;
//   maxScore: number;
//   semester: string;
//   year: number;
// }

// interface NotificationType {
//   message: string;
//   type: 'success' | 'error';
// }

// const AdminDashboard: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<string>("users");
//   const [userData, setUserData] = useState<User[]>([]);
//   const [courseData, setCourseData] = useState<Course[]>([]);
//   const [announcementData, setAnnouncementData] = useState<Announcement[]>([]);
//   const [markData, setMarkData] = useState<Mark[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [showUserForm, setShowUserForm] = useState<boolean>(false);
//   const [showAnnouncementForm, setShowAnnouncementForm] = useState<boolean>(false);
//   const [showMarkForm, setShowMarkForm] = useState<boolean>(false);
//   const [notification, setNotification] = useState<NotificationType | null>(null);
//   const { theme, setTheme } = useTheme();

//   // Fetch initial data
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         switch (activeTab) {
//           case "users":
//             const fetchedUsers = await db.select().from(users);
//             setUserData(fetchedUsers as User[]);
//             break;
//           case "courses":
//             const fetchedCourses = await db.select().from(courses);
//             setCourseData(fetchedCourses as Course[]);
//             break;
//           case "announcements":
//             const fetchedAnnouncements = await db.select().from(announcements);
//             setAnnouncementData(fetchedAnnouncements as Announcement[]);
//             break;
//           case "marks":
//             const fetchedMarks = await db.select().from(marks);
//             setMarkData(fetchedMarks as Mark[]);
//             break;
//           default:
//             break;
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         showNotification("Error loading data. Please try again.", "error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [activeTab]);

//   const showNotification = (message: string, type: 'success' | 'error' = "success") => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 5000);
//   };

//   // Filter data based on search term
//   const getFilteredData = (): User[] | Course[] | Announcement[] | Mark[] => {
//       switch (activeTab) {
//         case "users":
//           return userData.filter(user => 
//             user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//             user.email.toLowerCase().includes(searchTerm.toLowerCase())
//           );
//         case "courses":
//           return courseData.filter(course => 
//             course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//             course.code.toLowerCase().includes(searchTerm.toLowerCase())
//           );
//         case "announcements":
//           return announcementData.filter(announcement => 
//             announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
//           );
//         case "marks":
//           return markData.filter(mark => 
//             mark.examType.toLowerCase().includes(searchTerm.toLowerCase())
//           );
//         default:
//           return [];
//       }
//     };

//   // Add new user
//   const addUser = async (userData: { name: string; email: string; password: string; role: string }) => {
//     try {
//       const newUser = {
//         name: userData.name,
//         email: userData.email,
//         password: userData.password, // In a real app, hash this password
//         role: userData.role,
//       };
      
//       await db.insert(users).values(newUser);
      
//       // Refresh user data
//       const updatedUsers = await db.select().from(users);
//       setUserData(updatedUsers as User[]);
      
//       setShowUserForm(false);
//       showNotification("User added successfully!");
//     } catch (error) {
//       console.error("Error adding user:", error);
//       showNotification("Failed to add user. Please try again.", "error");
//     }
//   };

//   // Add new announcement
//   const addAnnouncement = async (announcementData: { title: string; content: string; courseId: string | null }) => {
//     try {
//       const newAnnouncement = {
//         title: announcementData.title,
//         content: announcementData.content,
//         courseId: announcementData.courseId || null,
//       };
      
//       await db.insert(announcements).values(newAnnouncement);
      
//       // Refresh announcement data
//       const updatedAnnouncements = await db.select().from(announcements);
//       setAnnouncementData(updatedAnnouncements as Announcement[]);
      
//       setShowAnnouncementForm(false);
//       showNotification("Announcement published successfully!");
//     } catch (error) {
//       console.error("Error adding announcement:", error);
//       showNotification("Failed to publish announcement. Please try again.", "error");
//     }
//   };

//   // Add new mark/grade
//   const addMark = async (markData: { 
//     userId: string; 
//     courseId: string; 
//     examType: string; 
//     score: number; 
//     maxScore: number; 
//     semester: string; 
//     year: number;
//   }) => {
//     try {
//       const newMark = {
//         userId: markData.userId,
//         courseId: markData.courseId,
//         examType: markData.examType,
//         score: markData.score,
//         maxScore: markData.maxScore,
//         semester: markData.semester,
//         year: markData.year,
//       };
      
//       await db.insert(marks).values(newMark);
      
//       // Refresh marks data
//       const updatedMarks = await db.select().from(marks);
//       setMarkData(updatedMarks as Mark[]);
      
//       setShowMarkForm(false);
//       showNotification("Grade added successfully!");
//     } catch (error) {
//       console.error("Error adding grade:", error);
//       showNotification("Failed to add grade. Please try again.", "error");
//     }
//   };

//   // Delete item
//   const deleteItem = async (id: string, table: string) => {
//     try {
//       let dbTable;
//       switch (table) {
//         case "users":
//           dbTable = users;
//           break;
//         case "courses":
//           dbTable = courses;
//           break;
//         case "announcements":
//           dbTable = announcements;
//           break;
//         case "marks":
//           dbTable = marks;
//           break;
//         default:
//           throw new Error("Invalid table specified");
//       }
      
//       await db.delete(dbTable).where(eq(dbTable.id as any, id));
      
//       // Refresh data
//       const refreshData = async () => {
//         switch (table) {
//           case "users":
//             const updatedUsers = await db.select().from(users);
//             setUserData(updatedUsers as User[]);
//             break;
//           case "courses":
//             const updatedCourses = await db.select().from(courses);
//             setCourseData(updatedCourses as Course[]);
//             break;
//           case "announcements":
//             const updatedAnnouncements = await db.select().from(announcements);
//             setAnnouncementData(updatedAnnouncements as Announcement[]);
//             break;
//           case "marks":
//             const updatedMarks = await db.select().from(marks);
//             setMarkData(updatedMarks as Mark[]);
//             break;
//           default:
//             break;
//         }
//       };
      
//       await refreshData();
//       showNotification(`${table.slice(0, -1)} deleted successfully!`);
//     } catch (error) {
//       console.error(`Error deleting ${table.slice(0, -1)}:`, error);
//       showNotification(`Failed to delete ${table.slice(0, -1)}. Please try again.`, "error");
//     }
//   };

//   // Toggle theme handler
//   const toggleTheme = () => {
//     setTheme(theme === 'dark' ? 'light' : 'dark');
//   };

//   return (
//     <div className="flex h-screen dark:bg-gray-900 bg-gray-100 transition-colors duration-300">
//       {/* Sidebar */}
//       <div className="w-64 bg-slate-900 dark:bg-slate-950 text-white">
//         <div className="p-6">
//           <h1 className="text-2xl font-bold">Admin Panel</h1>
//           <p className="text-slate-400 text-sm">School Management System</p>
//         </div>
//         <nav className="mt-6">
//           <ul>
//             <li>
//               <button 
//                 onClick={() => setActiveTab("users")} 
//                 className={`flex items-center px-6 py-3 w-full ${activeTab === "users" ? "bg-slate-800 dark:bg-slate-800" : "hover:bg-slate-800 dark:hover:bg-slate-800"}`}
//               >
//                 <Users size={18} className="mr-3" />
//                 <span>Users</span>
//               </button>
//             </li>
//             <li>
//               <button 
//                 onClick={() => setActiveTab("courses")} 
//                 className={`flex items-center px-6 py-3 w-full ${activeTab === "courses" ? "bg-slate-800 dark:bg-slate-800" : "hover:bg-slate-800 dark:hover:bg-slate-800"}`}
//               >
//                 <Book size={18} className="mr-3" />
//                 <span>Courses</span>
//               </button>
//             </li>
//             <li>
//               <button 
//                 onClick={() => setActiveTab("announcements")} 
//                 className={`flex items-center px-6 py-3 w-full ${activeTab === "announcements" ? "bg-slate-800 dark:bg-slate-800" : "hover:bg-slate-800 dark:hover:bg-slate-800"}`}
//               >
//                 <Bell size={18} className="mr-3" />
//                 <span>Announcements</span>
//               </button>
//             </li>
//             <li>
//               <button 
//                 onClick={() => setActiveTab("marks")} 
//                 className={`flex items-center px-6 py-3 w-full ${activeTab === "marks" ? "bg-slate-800 dark:bg-slate-800" : "hover:bg-slate-800 dark:hover:bg-slate-800"}`}
//               >
//                 <Award size={18} className="mr-3" />
//                 <span>Marks</span>
//               </button>
//             </li>
//           </ul>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 overflow-auto">
//         <header className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700">
//           <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{activeTab} Management</h2>
//             <Button 
//               variant="outline"
//               size="icon"
//               onClick={toggleTheme}
//               className="rounded-full"
//             >
//               {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
//             </Button>
//           </div>
//         </header>

//         <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//           {/* Notification */}
//           {notification && (
//             <Alert className={`mb-4 ${
//               notification.type === "error" 
//                 ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" 
//                 : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
//             }`}>
//               <AlertTitle className="dark:text-white">
//                 {notification.type === "error" ? "Error" : "Success"}
//               </AlertTitle>
//               <AlertDescription className="dark:text-gray-300">
//                 {notification.message}
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* Action Bar */}
//           <div className="flex justify-between items-center mb-6">
//             <div className="relative w-64">
//               <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//               <Input 
//                 placeholder="Search..." 
//                 className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
            
//             {activeTab === "users" && (
//               <Button onClick={() => setShowUserForm(true)}>
//                 <Plus size={16} className="mr-2" />
//                 Add User
//               </Button>
//             )}
            
//             {activeTab === "announcements" && (
//               <Button onClick={() => setShowAnnouncementForm(true)}>
//                 <Plus size={16} className="mr-2" />
//                 Add Announcement
//               </Button>
//             )}
            
//             {activeTab === "marks" && (
//               <Button onClick={() => setShowMarkForm(true)}>
//                 <Plus size={16} className="mr-2" />
//                 Add Grade
//               </Button>
//             )}
//           </div>

//           {/* Data Tables */}
//           <Card className="dark:bg-gray-800 dark:border-gray-700">
//             <CardContent className="p-0">
//               {loading ? (
//                 <div className="flex justify-center items-center h-64 dark:text-white">
//                   <RefreshCw className="animate-spin" size={32} />
//                 </div>
//               ) : (
//                 <>
//                   {activeTab === "users" && (
//                     <Table>
//                       <TableHeader>
//                         <TableRow className="dark:border-gray-700">
//                           <TableHead className="dark:text-gray-300">ID</TableHead>
//                           <TableHead className="dark:text-gray-300">Name</TableHead>
//                           <TableHead className="dark:text-gray-300">Email</TableHead>
//                           <TableHead className="dark:text-gray-300">Role</TableHead>
//                           <TableHead className="dark:text-gray-300">Created At</TableHead>
//                           <TableHead className="text-right dark:text-gray-300">Actions</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {(getFilteredData() as User[]).map((user: User) => (
//                           <TableRow key={user.id} className="dark:border-gray-700 dark:hover:bg-gray-700/50">
//                             <TableCell className="dark:text-gray-300">{user.id}</TableCell>
//                             <TableCell className="font-medium dark:text-white">{user.name}</TableCell>
//                             <TableCell className="dark:text-gray-300">{user.email}</TableCell>
//                             <TableCell className="capitalize dark:text-gray-300">{user.role}</TableCell>
//                             <TableCell className="dark:text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
//                             <TableCell className="text-right">
//                               <Button variant="ghost" size="icon" onClick={() => deleteItem(user.id, "users")}>
//                                 <Trash2 size={16} className="text-red-500" />
//                               </Button>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   )}

//                   {activeTab === "courses" && (
//                     <Table>
//                       <TableHeader>
//                         <TableRow className="dark:border-gray-700">
//                           <TableHead className="dark:text-gray-300">ID</TableHead>
//                           <TableHead className="dark:text-gray-300">Code</TableHead>
//                           <TableHead className="dark:text-gray-300">Name</TableHead>
//                           <TableHead className="dark:text-gray-300">Credits</TableHead>
//                           <TableHead className="dark:text-gray-300">Description</TableHead>
//                           <TableHead className="text-right dark:text-gray-300">Actions</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {(getFilteredData() as Course[]).map((course: Course) => (
//                           <TableRow key={course.id} className="dark:border-gray-700 dark:hover:bg-gray-700/50">
//                             <TableCell className="dark:text-gray-300">{course.id}</TableCell>
//                             <TableCell className="font-medium dark:text-white">{course.code}</TableCell>
//                             <TableCell className="dark:text-gray-300">{course.name}</TableCell>
//                             <TableCell className="dark:text-gray-300">{course.credits}</TableCell>
//                             <TableCell className="truncate max-w-xs dark:text-gray-300">{course.description}</TableCell>
//                             <TableCell className="text-right">
//                               <Button variant="ghost" size="icon" onClick={() => deleteItem(course.id, "courses")}>
//                                 <Trash2 size={16} className="text-red-500" />
//                               </Button>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   )}

//                   {activeTab === "announcements" && (
//                     <Table>
//                       <TableHeader>
//                         <TableRow className="dark:border-gray-700">
//                           <TableHead className="dark:text-gray-300">ID</TableHead>
//                           <TableHead className="dark:text-gray-300">Title</TableHead>
//                           <TableHead className="dark:text-gray-300">Content</TableHead>
//                           <TableHead className="dark:text-gray-300">Course</TableHead>
//                           <TableHead className="dark:text-gray-300">Created At</TableHead>
//                           <TableHead className="text-right dark:text-gray-300">Actions</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {getFilteredData().map((announcement: Announcement) => (
//                           <TableRow key={announcement.id} className="dark:border-gray-700 dark:hover:bg-gray-700/50">
//                             <TableCell className="dark:text-gray-300">{announcement.id}</TableCell>
//                             <TableCell className="font-medium dark:text-white">{announcement.title}</TableCell>
//                             <TableCell className="truncate max-w-xs dark:text-gray-300">{announcement.content}</TableCell>
//                             <TableCell className="dark:text-gray-300">{announcement.courseId || "Global"}</TableCell>
//                             <TableCell className="dark:text-gray-300">{new Date(announcement.createdAt).toLocaleDateString()}</TableCell>
//                             <TableCell className="text-right">
//                               <Button variant="ghost" size="icon" onClick={() => deleteItem(announcement.id, "announcements")}>
//                                 <Trash2 size={16} className="text-red-500" />
//                               </Button>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   )}

//                   {activeTab === "marks" && (
//                     <Table>
//                       <TableHeader>
//                         <TableRow className="dark:border-gray-700">
//                           <TableHead className="dark:text-gray-300">ID</TableHead>
//                           <TableHead className="dark:text-gray-300">User ID</TableHead>
//                           <TableHead className="dark:text-gray-300">Course ID</TableHead>
//                           <TableHead className="dark:text-gray-300">Exam Type</TableHead>
//                           <TableHead className="dark:text-gray-300">Score</TableHead>
//                           <TableHead className="dark:text-gray-300">Semester/Year</TableHead>
//                           <TableHead className="text-right dark:text-gray-300">Actions</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {getFilteredData().map((mark: Mark) => (
//                           <TableRow key={mark.id} className="dark:border-gray-700 dark:hover:bg-gray-700/50">
//                             <TableCell className="dark:text-gray-300">{mark.id}</TableCell>
//                             <TableCell className="dark:text-gray-300">{mark.userId}</TableCell>
//                             <TableCell className="dark:text-gray-300">{mark.courseId}</TableCell>
//                             <TableCell className="dark:text-gray-300">{mark.examType}</TableCell>
//                             <TableCell className="dark:text-gray-300">{mark.score}/{mark.maxScore}</TableCell>
//                             <TableCell className="dark:text-gray-300">{mark.semester} {mark.year}</TableCell>
//                             <TableCell className="text-right">
//                               <Button variant="ghost" size="icon" onClick={() => deleteItem(mark.id, "marks")}>
//                                 <Trash2 size={16} className="text-red-500" />
//                               </Button>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   )}
//                 </>
//               )}
//             </CardContent>
//           </Card>
//         </main>
//       </div>

//       {/* Add User Dialog */}
//       <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
//         <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
//           <DialogHeader>
//             <DialogTitle className="dark:text-white">Add New User</DialogTitle>
//             <DialogDescription className="dark:text-gray-400">
//               Create a new user account in the system.
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="name" className="text-right dark:text-gray-300">
//                 Name
//               </Label>
//               <Input 
//                 id="name" 
//                 placeholder="John Doe" 
//                 className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
//               />
//             </div>
            
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="email" className="text-right dark:text-gray-300">
//                 Email
//               </Label>
//               <Input 
//                 id="email" 
//                 type="email" 
//                 placeholder="john@example.com" 
//                 className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
//               />
//             </div>
            
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="password" className="text-right dark:text-gray-300">
//                 Password
//               </Label>
//               <Input 
//                 id="password" 
//                 type="password" 
//                 className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
//               />
//             </div>
            
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="role" className="text-right dark:text-gray-300">
//                 Role
//               </Label>
//               <Select defaultValue="student">
//                 <SelectTrigger className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
//                   <SelectValue placeholder="Select a role" />
//                 </SelectTrigger>
//                 <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                   <SelectItem value="student">Student</SelectItem>
//                   <SelectItem value="teacher">Teacher</SelectItem>
//                   <SelectItem value="admin">Administrator</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowUserForm(false)} className="dark:text-gray-300 dark:border-gray-600">
//               Cancel
//             </Button>
//             <Button type="submit" onClick={() => {
//               // In a real app, get values from form fields
//               const userData = {
//                 name: (document.getElementById("name") as HTMLInputElement).value,
//                 email: (document.getElementById("email") as HTMLInputElement).value,
//                 password: (document.getElementById("password") as HTMLInputElement).value,
//                 role: document.querySelector("[data-value]")?.getAttribute("data-value") || "student",
//               };
//               addUser(userData);
//             }}>
//               <Save size={16} className="mr-2" />
//               Save User
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Add Announcement Dialog */}
//       <Dialog open={showAnnouncementForm} onOpenChange={setShowAnnouncementForm}>
//         <DialogContent className="sm:max-w-lg dark:bg-gray-800 dark:border-gray-700">
//           <DialogHeader>
//             <DialogTitle className="dark:text-white">Publish Announcement</DialogTitle>
//             <DialogDescription className="dark:text-gray-400">
//               Create a new announcement for students and faculty.
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="announcement-title" className="text-right dark:text-gray-300">
//                 Title
//               </Label>
//               <Input 
//                 id="announcement-title" 
//                 placeholder="Important Announcement" 
//                 className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
//               />
//             </div>
            
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="announcement-course" className="text-right dark:text-gray-300">
//                 Course
//               </Label>
//               <Select defaultValue="">
//                 <SelectTrigger className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
//                   <SelectValue placeholder="Select a course (optional)" />
//                 </SelectTrigger>
//                 <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                   <SelectItem value="">Global (All Courses)</SelectItem>
//                   {courseData.map(course => (
//                     <SelectItem key={course.id} value={course.id.toString()}>
//                       {course.code}: {course.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
            
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="announcement-content" className="text-right dark:text-gray-300">
//                 Content
//               </Label>
//               <Textarea 
//                 id="announcement-content" 
//                 placeholder="Write your announcement here..." 
//                 className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 rows={5}
//               />
//             </div>
//           </div>
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowAnnouncementForm(false)} className="dark:text-gray-300 dark:border-gray-600">
//               Cancel
//             </Button>
//             <Button type="submit" onClick={() => {
//               // In a real app, get values from form fields
//               const announcementData = {
//                 title: (document.getElementById("announcement-title") as HTMLInputElement).value,
//                 content: (document.getElementById("announcement-content") as HTMLTextAreaElement).value,
//                 courseId: document.querySelector("[data-value]")?.getAttribute("data-value") || null,
//               };
//               addAnnouncement(announcementData);
//             }}>
//               <Bell size={16} className="mr-2" />
//               Publish
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Add Mark/Grade Dialog */}
//       <Dialog open={showMarkForm} onOpenChange={setShowMarkForm}>
//         <DialogContent className="sm:max-w-lg dark:bg-gray-800 dark:border-gray-700">
//           <DialogHeader>
//             <DialogTitle className="dark:text-white">Add New Grade</DialogTitle>
//             <DialogDescription className="dark:text-gray-400">
//               Enter the details of the new grade.
//             </DialogDescription>
//           </DialogHeader>
//             <div className="grid gap-4 py-4">
//                 <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="mark-user" className="text-right dark:text-gray-300">
//                     User ID
//                 </Label>
//                 <Input 
//                     id="mark-user" 
//                     placeholder="User ID" 
//                     className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
//                 />
//                 </div>
                
//                 <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="mark-course" className="text-right dark:text-gray-300">
//                     Course ID
//                 </Label>
//                 <Input 
//                     id="mark-course" 
//                     placeholder="Course ID" 
//                     className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
//                 />
//                 </div>
                
//                 <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="mark-exam-type" className="text-right dark:text-gray-300">
//                     Exam Type
//                 </Label>
//                 <Input 
//                     id="mark-exam-type" 
//                     placeholder="Midterm/Final/Quiz" 
//                     className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
//                 />
//                 </div>
                
//                 <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="mark-score" className="text-right dark:text-gray-300">
//                     Score
//                 </Label>
//                 <Input 
//                     id="mark-score" 
//                     type="number" 
//                     placeholder="Score obtained" 
//                     className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
//                 />
//                 </div>
                
//                 <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="mark-max-score" className="text-right dark:text-gray-300">
//                     Max Score
//                 </Label>
//                 <Input 
//                     id="mark-max-score" 
//                     type="number" 
//                     placeholder="Maximum score possible" 
//                     className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
//                 />
//                 </div>
//                 <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="mark-semester" className="text-right dark:text-gray-300">
//                     Semester
//                 </Label>
//                 <Input 
//                     id="mark-semester" 
//                     placeholder="Fall/Spring" 
//                     className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 />
//                 </div>
//                 <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="mark-year" className="text-right dark:text-gray-300">
//                     Year
//                 </Label>
//                 <Input 
//                     id="mark-year" 
//                     type="number" 
//                     placeholder="2023" 
//                     className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 />  
//                 </div>
//               </div>
//             </div>
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowMarkForm(false)} className="dark:text-gray-300 dark:border-gray-600">
//               Cancel
//             </Button>
//             <Button type="submit" onClick={() => {
//               // In a real app, get values from form fields
//               const markData = {
//                 userId: (document.getElementById("mark-user") as HTMLInputElement).value,
//                 courseId: (document.getElementById("mark-course") as HTMLInputElement).value,
//                 examType: (document.getElementById("mark-exam-type") as HTMLInputElement).value,
//                 score: Number((document.getElementById("mark-score") as HTMLInputElement).value),
//                 maxScore: Number((document.getElementById("mark-max-score") as HTMLInputElement).value),
//                 semester: (document.getElementById("mark-semester") as HTMLInputElement).value,
//                 year: Number((document.getElementById("mark-year") as HTMLInputElement).value),
//               };
//               addMark(markData);
//             }}>
//               <Award size={16} className="mr-2" />
//               Save Grade
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default AdminDashboard;

import React from 'react'

export default function page() {
  return (
    <div>page</div>
  )
}
