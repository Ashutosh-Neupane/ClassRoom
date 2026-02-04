"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ClassScheduleView } from "@/components/class-schedule-view"
import { CreateScheduleModal } from "@/components/create-schedule-modal"
import { RecurringSettingsModal } from "@/components/recurring-settings-modal"

export interface ClassSchedule {
  id: string
  date: string
  time: string
  classType: string
  instructor: string
  room: string
  bookings: { current: number; total: number; waitlist: number }
  status: "Complete" | "Scheduled" | "Cancelled"
  isRecurring?: boolean
  recurringDays?: string[]
}

export interface RecurringSettings {
  enabled: boolean
  period: "daily" | "weekly" | "monthly" | "custom"
  duration: { start: Date | null; end: Date | null }
  selectedDay?: string
  selectedDates?: number[]
  timeSlots: Record<string, string[]>
}

const mockSchedules: ClassSchedule[] = [
  {
    id: "1",
    date: "Tue, Dec 16",
    time: "06:00",
    classType: "Morning Crossfit",
    instructor: "John Smith",
    room: "Main Studio",
    bookings: { current: 15, total: 20, waitlist: 2 },
    status: "Complete",
    isRecurring: true,
    recurringDays: ["S", "M", "T", "W", "T", "F", "S"],
  },
  {
    id: "2",
    date: "Tue, Dec 16",
    time: "09:00",
    classType: "Yoga Flow",
    instructor: "Sarah Johnson",
    room: "Yoga Studio",
    bookings: { current: 12, total: 15, waitlist: 0 },
    status: "Cancelled",
  },
  {
    id: "3",
    date: "Sat, Dec 20",
    time: "10:00",
    classType: "Saturday Workshop: Olympic Lifting",
    instructor: "Mike Davis",
    room: "Main Studio",
    bookings: { current: 8, total: 12, waitlist: 1 },
    status: "Scheduled",
    isRecurring: true,
  },
  {
    id: "4",
    date: "Sat, Dec 20",
    time: "10:00",
    classType: "Saturday Workshop: Olympic Lifting",
    instructor: "Sarah Johnson",
    room: "Main Studio",
    bookings: { current: 15, total: 25, waitlist: 1 },
    status: "Complete",
    isRecurring: true,
    recurringDays: ["S", "M", "T", "W", "T", "F", "S"],
  },
]

export default function ClassSchedulePage() {
  const [activeTab, setActiveTab] = useState<"schedule" | "type">("schedule")
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list")
  const [dateViewMode, setDateViewMode] = useState<"day" | "week" | "month">("week")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false)
  const [schedules] = useState<ClassSchedule[]>(mockSchedules)
  const [searchQuery, setSearchQuery] = useState("")
  const [recurringSettings, setRecurringSettings] = useState<RecurringSettings>({
    enabled: true,
    period: "daily",
    duration: { start: null, end: null },
    timeSlots: {},
  })

  const handleOpenRecurringSettings = () => {
    setIsRecurringModalOpen(true)
  }

  const handleSaveRecurringSettings = (settings: RecurringSettings) => {
    setRecurringSettings(settings)
    setIsRecurringModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main className="p-4 md:p-6">
        <ClassScheduleView
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          viewMode={viewMode}
          setViewMode={setViewMode}
          dateViewMode={dateViewMode}
          setDateViewMode={setDateViewMode}
          schedules={schedules}
          onCreateSchedule={() => setIsCreateModalOpen(true)}
          searchQuery={searchQuery}
        />
      </main>

      <CreateScheduleModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        recurringEnabled={recurringSettings.enabled}
        onOpenRecurringSettings={handleOpenRecurringSettings}
      />

      <RecurringSettingsModal
        open={isRecurringModalOpen}
        onOpenChange={setIsRecurringModalOpen}
        settings={recurringSettings}
        onSave={handleSaveRecurringSettings}
      />
    </div>
  )
}
