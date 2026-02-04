"use client"

import { Button } from "@/components/ui/button"
import { Calendar, List, ChevronLeft, ChevronRight, Plus, User, MapPin, Users, Clock } from "lucide-react"
import type { ClassSchedule } from "@/app/page"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ClassScheduleViewProps {
  activeTab: "schedule" | "type"
  setActiveTab: (tab: "schedule" | "type") => void
  viewMode: "calendar" | "list"
  setViewMode: (mode: "calendar" | "list") => void
  dateViewMode: "day" | "week" | "month"
  setDateViewMode: (mode: "day" | "week" | "month") => void
  schedules: ClassSchedule[]
  onCreateSchedule: () => void
  searchQuery: string
}

export function ClassScheduleView({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  dateViewMode,
  setDateViewMode,
  schedules,
  onCreateSchedule,
  searchQuery,
}: ClassScheduleViewProps) {
  // Filter schedules based on search query
  const filteredSchedules = schedules.filter((schedule) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      schedule.classType.toLowerCase().includes(query) ||
      schedule.instructor.toLowerCase().includes(query) ||
      schedule.room.toLowerCase().includes(query) ||
      schedule.date.toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-0">
        <Button
          variant={activeTab === "schedule" ? "default" : "secondary"}
          className={`rounded-r-none text-xs md:text-sm px-3 md:px-4 ${activeTab === "schedule" ? "bg-primary text-primary-foreground" : ""}`}
          onClick={() => setActiveTab("schedule")}
        >
          Class Schedule
        </Button>
        <Button
          variant={activeTab === "type" ? "default" : "secondary"}
          className="rounded-l-none text-xs md:text-sm px-3 md:px-4"
          onClick={() => setActiveTab("type")}
        >
          Class Type
        </Button>
      </div>

      {/* Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-foreground">Class Schedule</h1>
          <p className="text-sm text-muted-foreground">Manage recurring schedules and one-off classes.</p>
        </div>
        <Button onClick={onCreateSchedule} className="bg-primary text-primary-foreground w-full sm:w-auto">
          <Plus className="size-4 mr-2" />
          Schedule Class
        </Button>
      </div>

      {/* View Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          {/* Calendar/List Toggle */}
          <div className="flex items-center gap-0 bg-secondary rounded-lg p-1">
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              className={`gap-1.5 text-xs md:text-sm px-2 md:px-3 ${viewMode === "calendar" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("calendar")}
            >
              <Calendar className="size-3.5 md:size-4" />
              <span className="hidden xs:inline">Calender</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className={`gap-1.5 text-xs md:text-sm px-2 md:px-3 ${viewMode === "list" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List className="size-3.5 md:size-4" />
              <span className="hidden xs:inline">List</span>
            </Button>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center gap-1 md:gap-2 bg-secondary rounded-lg px-1 md:px-2 py-1">
            <Button variant="ghost" size="icon" className="size-7 md:size-8">
              <ChevronLeft className="size-3.5 md:size-4" />
            </Button>
            <span className="text-xs md:text-sm font-medium min-w-20 md:min-w-24 text-center">Jan 11 - Jan 17</span>
            <Button variant="ghost" size="icon" className="size-7 md:size-8">
              <ChevronRight className="size-3.5 md:size-4" />
            </Button>
          </div>
        </div>

        {/* Day/Week/Month Toggle */}
        <div className="flex items-center gap-1">
          {(["Day", "Week", "Month"] as const).map((mode) => (
            <Button
              key={mode}
              variant={dateViewMode === mode.toLowerCase() ? "secondary" : "ghost"}
              size="sm"
              className={`text-xs md:text-sm px-2 md:px-3 ${dateViewMode === mode.toLowerCase() ? "bg-secondary" : ""}`}
              onClick={() => setDateViewMode(mode.toLowerCase() as "day" | "week" | "month")}
            >
              {mode}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      {viewMode === "list" ? (
        <ScheduleListView schedules={filteredSchedules} />
      ) : (
        <ScheduleCalendarView schedules={filteredSchedules} />
      )}
    </div>
  )
}

function ScheduleListView({ schedules }: { schedules: ClassSchedule[] }) {
  return (
    <div className="border border-border rounded-lg overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead className="bg-card">
          <tr className="border-b border-border">
            <th className="text-left px-3 md:px-4 py-3 text-xs md:text-sm font-medium text-muted-foreground">Date</th>
            <th className="text-left px-3 md:px-4 py-3 text-xs md:text-sm font-medium text-muted-foreground">Time</th>
            <th className="text-left px-3 md:px-4 py-3 text-xs md:text-sm font-medium text-muted-foreground">Class Type</th>
            <th className="text-left px-3 md:px-4 py-3 text-xs md:text-sm font-medium text-muted-foreground">Instructor</th>
            <th className="text-left px-3 md:px-4 py-3 text-xs md:text-sm font-medium text-muted-foreground">Room</th>
            <th className="text-left px-3 md:px-4 py-3 text-xs md:text-sm font-medium text-muted-foreground">Bookings</th>
            <th className="text-left px-3 md:px-4 py-3 text-xs md:text-sm font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule, index) => (
            <TooltipProvider key={schedule.id}>
              <tr className={`border-b border-border last:border-0 ${index % 2 === 1 ? "bg-card/50" : ""}`}>
                <td className="px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm font-medium">{schedule.date}</td>
                <td className="px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm text-muted-foreground">{schedule.time}</td>
                <td className="px-3 md:px-4 py-3 md:py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm">{schedule.classType}</span>
                    {schedule.isRecurring && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Clock className="size-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-card border-border">
                          <div className="text-sm">
                            <p>Recurring at <span className="font-semibold">9:00 PM</span></p>
                            {schedule.recurringDays && (
                              <div className="flex gap-1 mt-1">
                                {schedule.recurringDays.map((day, i) => (
                                  <span
                                    key={i}
                                    className={`size-5 flex items-center justify-center rounded text-xs ${
                                      ["S", "M", "T", "W", "T", "F", "S"][i] === day
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                    }`}
                                  >
                                    {day}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </td>
                <td className="px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm">{schedule.instructor}</td>
                <td className="px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm text-muted-foreground">{schedule.room}</td>
                <td className="px-3 md:px-4 py-3 md:py-4">
                  <div className="flex items-center gap-1 text-xs md:text-sm">
                    <span className="text-primary">
                      {schedule.bookings.current}/{schedule.bookings.total}
                    </span>
                    <span className="text-primary">+{schedule.bookings.waitlist}</span>
                  </div>
                </td>
                <td className="px-3 md:px-4 py-3 md:py-4">
                  <StatusBadge status={schedule.status} />
                </td>
              </tr>
            </TooltipProvider>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatusBadge({ status }: { status: ClassSchedule["status"] }) {
  if (status === "Complete") {
    return (
      <Badge variant="outline" className="text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
        {status}
      </Badge>
    )
  }
  if (status === "Cancelled") {
    return (
      <Badge variant="outline" className="text-xs bg-red-500/20 text-red-400 border-red-500/30">
        {status}
      </Badge>
    )
  }
  // Scheduled - using amber/yellow colors for better visibility
  return (
    <Badge variant="outline" className="text-xs bg-amber-500/20 text-amber-300 border-amber-500/30">
      {status}
    </Badge>
  )
}

function ScheduleCalendarView({ schedules }: { schedules: ClassSchedule[] }) {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const dates = [11, 12, 13, 14, 15, 16, 17]
  const timeSlots = ["1 PM", "5 PM"]

  const getClassForDay = (dayIndex: number) => {
    if (dayIndex === 0) return schedules.filter(s => s.classType.includes("Crossfit"))
    if (dayIndex === 1) return schedules.filter(s => s.classType.includes("Yoga"))
    if (dayIndex === 2) return schedules.filter(s => s.classType.includes("Workshop"))
    return []
  }

  return (
    <div className="border border-border rounded-lg overflow-x-auto">
      <div className="min-w-[700px]">
        {timeSlots.map((time) => (
          <div key={time} className="grid grid-cols-8 border-b border-border last:border-0">
            <div className="p-2 md:p-4 border-r border-border flex items-start">
              <span className="text-xs md:text-sm font-medium text-muted-foreground">{time}</span>
            </div>
            {days.map((day, dayIndex) => {
              const classes = getClassForDay(dayIndex)
              return (
                <div key={day} className="border-r border-border last:border-0 p-1 md:p-2 min-h-24 md:min-h-32">
                  <div className="text-center mb-1 md:mb-2">
                    <div className="text-[10px] md:text-xs text-muted-foreground">{day}</div>
                    <div className="text-sm md:text-lg font-medium">{dates[dayIndex]}</div>
                  </div>
                  {classes.length > 0 && classes[0] && (
                    <div className={`rounded p-1.5 md:p-2 text-[10px] md:text-xs space-y-0.5 md:space-y-1 ${
                      dayIndex === 0 ? "border-l-2 border-red-500 bg-card" :
                      dayIndex === 1 ? "border-l-2 border-blue-500 bg-card" :
                      "border-l-2 border-amber-500 bg-card"
                    }`}>
                      <div className="font-medium truncate">{classes[0].classType}</div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <User className="size-2.5 md:size-3" />
                        <span className="truncate">{classes[0].instructor}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="size-2.5 md:size-3" />
                        <span className="truncate">{classes[0].room}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="size-2.5 md:size-3 text-red-500" />
                        <span className="text-red-500">{classes[0].bookings.current}/{classes[0].bookings.total}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
