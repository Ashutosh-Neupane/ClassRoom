"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, Plus } from "lucide-react"
import type { RecurringSettings } from "@/app/page"

interface RecurringSettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: RecurringSettings
  onSave: (settings: RecurringSettings) => void
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function RecurringSettingsModal({
  open,
  onOpenChange,
  settings,
  onSave,
}: RecurringSettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<RecurringSettings>(settings)
  const [timeSlots, setTimeSlots] = useState<Record<string, string[]>>({})

  useEffect(() => {
    setLocalSettings(settings)
    initializeTimeSlots(settings.period, settings.selectedDay, settings.selectedDates)
  }, [settings])

  const initializeTimeSlots = (period: string, selectedDay?: string, selectedDates?: number[]) => {
    const newTimeSlots: Record<string, string[]> = {}
    
    if (period === "daily") {
      newTimeSlots["Everyday"] = ["", ""]
    } else if (period === "weekly" && selectedDay) {
      newTimeSlots[selectedDay] = ["", ""]
    } else if (period === "monthly" && selectedDates) {
      selectedDates.forEach(date => {
        newTimeSlots[`${date}th`] = ["", ""]
      })
    } else if (period === "custom") {
      DAYS_OF_WEEK.forEach(day => {
        newTimeSlots[day] = []
      })
    }
    
    setTimeSlots(newTimeSlots)
  }

  const handlePeriodChange = (period: "daily" | "weekly" | "monthly" | "custom") => {
    setLocalSettings(prev => ({ ...prev, period }))
    initializeTimeSlots(period, localSettings.selectedDay, localSettings.selectedDates)
  }

  const handleDayChange = (day: string) => {
    setLocalSettings(prev => ({ ...prev, selectedDay: day }))
    initializeTimeSlots("weekly", day)
  }

  const addTimeSlot = (key: string) => {
    setTimeSlots(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), ""]
    }))
  }

  const updateTimeSlot = (key: string, index: number, value: string) => {
    setTimeSlots(prev => ({
      ...prev,
      [key]: prev[key].map((slot, i) => i === index ? value : slot)
    }))
  }

  const handleSave = () => {
    onSave({ ...localSettings, timeSlots })
  }

  const renderTimeSlotRow = (label: string, key: string) => {
    const slots = timeSlots[key] || []
    
    return (
      <tr key={key} className="border-b border-border last:border-0">
        <td className="px-3 md:px-4 py-3 text-xs md:text-sm whitespace-nowrap">{label}</td>
        {[0, 1, 2].map((index) => (
          <td key={index} className="px-2 md:px-4 py-3">
            {index < slots.length ? (
              <div className="relative">
                <Input
                  type="text"
                  placeholder="--:--"
                  value={slots[index]}
                  onChange={(e) => updateTimeSlot(key, index, e.target.value)}
                  className="bg-secondary border-border pr-8 w-20 md:w-32 text-xs md:text-sm"
                />
                <Clock className="absolute right-2 top-1/2 -translate-y-1/2 size-3 md:size-4 text-muted-foreground" />
              </div>
            ) : index === slots.length ? (
              <Button
                size="sm"
                className="bg-primary text-primary-foreground size-8 md:size-9 p-0"
                onClick={() => addTimeSlot(key)}
              >
                <Plus className="size-4" />
              </Button>
            ) : null}
          </td>
        ))}
      </tr>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-background border-border p-0 gap-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="p-4 md:p-6 pb-0 md:pb-0 shrink-0">
          <DialogTitle className="text-lg md:text-xl font-semibold">Create Class Schedule</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Schedule a new class, either as a one-off event or a recurring series.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-auto">
          <div className="space-y-4 md:space-y-6 p-4 md:p-6 pt-4">
            {/* Recurring Schedule Toggle */}
            <div className="border border-border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-medium text-sm md:text-base">Recurring Schedule</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Enable to create a repeating class schedule</p>
                </div>
                <Switch
                  checked={localSettings.enabled}
                  onCheckedChange={(enabled) => setLocalSettings(prev => ({ ...prev, enabled }))}
                />
              </div>

              {localSettings.enabled && (
                <div className={`grid gap-4 ${localSettings.period === "weekly" || localSettings.period === "monthly" ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}>
                  {/* Recurring Period */}
                  <div className="space-y-2">
                    <Label className="text-xs md:text-sm text-muted-foreground">Recurring Period</Label>
                    <Select value={localSettings.period} onValueChange={handlePeriodChange}>
                      <SelectTrigger className="w-full bg-secondary border-border text-xs md:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <Label className="text-xs md:text-sm text-muted-foreground">Duration</Label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder={localSettings.period === "monthly" ? "MM/YYYY -MM/YYYY" : "DD/MM/YYYY - DD/MM/YYYY"}
                        className="bg-secondary border-border pr-10 text-xs md:text-sm"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Choose Day (for Weekly) */}
                  {localSettings.period === "weekly" && (
                    <div className="space-y-2">
                      <Label className="text-xs md:text-sm text-muted-foreground">Choose Day</Label>
                      <Select value={localSettings.selectedDay} onValueChange={handleDayChange}>
                        <SelectTrigger className="w-full bg-secondary border-border text-xs md:text-sm">
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS_OF_WEEK.map(day => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Choose Dates (for Monthly) */}
                  {localSettings.period === "monthly" && (
                    <div className="space-y-2">
                      <Label className="text-xs md:text-sm text-muted-foreground">Chose dates for classes</Label>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="10, 15, 20"
                          className="bg-secondary border-border pr-10 text-xs md:text-sm"
                          onChange={(e) => {
                            const dates = e.target.value.split(",").map(d => parseInt(d.trim())).filter(d => !isNaN(d))
                            setLocalSettings(prev => ({ ...prev, selectedDates: dates }))
                            initializeTimeSlots("monthly", undefined, dates)
                          }}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Time Slots Table */}
            {localSettings.enabled && (
              <div className="border border-border rounded-lg overflow-x-auto">
                <table className="w-full min-w-[400px]">
                  <thead className="bg-card">
                    <tr className="border-b border-border">
                      <th className="text-left px-3 md:px-4 py-3 text-xs md:text-sm font-medium text-muted-foreground w-24 md:w-40">
                        {localSettings.period === "monthly" ? "Date" : "Day"}
                      </th>
                      <th className="text-left px-2 md:px-4 py-3 text-xs md:text-sm font-medium text-muted-foreground">Time 1</th>
                      <th className="text-left px-2 md:px-4 py-3 text-xs md:text-sm font-medium text-muted-foreground">Time 2</th>
                      <th className="text-left px-2 md:px-4 py-3 text-xs md:text-sm font-medium text-muted-foreground">Time 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localSettings.period === "daily" && renderTimeSlotRow("Everyday", "Everyday")}
                    
                    {localSettings.period === "weekly" && localSettings.selectedDay && 
                      renderTimeSlotRow(localSettings.selectedDay, localSettings.selectedDay)}
                    
                    {localSettings.period === "monthly" && localSettings.selectedDates?.map(date => 
                      renderTimeSlotRow(`${date}th`, `${date}th`)
                    )}
                    
                    {localSettings.period === "custom" && DAYS_OF_WEEK.map(day => 
                      renderTimeSlotRow(day, day)
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="p-4 md:p-6 pt-4 border-t border-border shrink-0">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 w-full">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/80 w-full sm:w-auto" onClick={handleSave}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
