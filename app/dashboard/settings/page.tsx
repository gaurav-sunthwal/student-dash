"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [profile, setProfile] = useState({
    name: "Test Student",
    email: "student@example.com",
  })

  const [notifications, setNotifications] = useState({
    email: true,
    announcements: true,
    grades: true,
    deadlines: true,
  })

  const [appearance, setAppearance] = useState({
    theme: "system",
    fontSize: "medium",
  })

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    }, 1000)
  }

  const handleNotificationUpdate = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Notification preferences updated",
        description: "Your notification preferences have been updated successfully.",
      })
    }, 1000)
  }

  const handleAppearanceUpdate = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Appearance settings updated",
        description: "Your appearance settings have been updated successfully.",
      })
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="announcements">Announcements</Label>
                    <p className="text-sm text-muted-foreground">Get notified about new announcements</p>
                  </div>
                  <Switch
                    id="announcements"
                    checked={notifications.announcements}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, announcements: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="grades">Grades</Label>
                    <p className="text-sm text-muted-foreground">Get notified when new grades are posted</p>
                  </div>
                  <Switch
                    id="grades"
                    checked={notifications.grades}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, grades: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="deadlines">Deadlines</Label>
                    <p className="text-sm text-muted-foreground">Get reminders about upcoming deadlines</p>
                  </div>
                  <Switch
                    id="deadlines"
                    checked={notifications.deadlines}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, deadlines: checked })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleNotificationUpdate} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Preferences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how the dashboard looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={appearance.theme === "light" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setAppearance({ ...appearance, theme: "light" })}
                  >
                    Light
                  </Button>
                  <Button
                    variant={appearance.theme === "dark" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setAppearance({ ...appearance, theme: "dark" })}
                  >
                    Dark
                  </Button>
                  <Button
                    variant={appearance.theme === "system" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setAppearance({ ...appearance, theme: "system" })}
                  >
                    System
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={appearance.fontSize === "small" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setAppearance({ ...appearance, fontSize: "small" })}
                  >
                    Small
                  </Button>
                  <Button
                    variant={appearance.fontSize === "medium" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setAppearance({ ...appearance, fontSize: "medium" })}
                  >
                    Medium
                  </Button>
                  <Button
                    variant={appearance.fontSize === "large" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setAppearance({ ...appearance, fontSize: "large" })}
                  >
                    Large
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAppearanceUpdate} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

