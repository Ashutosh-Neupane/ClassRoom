"use client"

import { useState } from "react"
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
import { Upload, Plus, Search } from "lucide-react"

interface CreateScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recurringEnabled: boolean
  onOpenRecurringSettings: () => void
}

export function CreateScheduleModal({
  open,
  onOpenChange,
  recurringEnabled,
  onOpenRecurringSettings,
}: CreateScheduleModalProps) {
  const [isRecurring, setIsRecurring] = useState(recurringEnabled)
  const [dropInAvailability, setDropInAvailability] = useState(true)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-background border-border p-0 gap-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="p-4 md:p-6 pb-0 md:pb-0 shrink-0">
          <DialogTitle className="text-lg md:text-xl font-semibold">Create Class Schedule</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Schedule a new class, either as a one-off event or a recurring series.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-auto">
          <div className="space-y-4 md:space-y-6 p-4 md:p-6 pt-4">
            {/* File Upload */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">File Upload</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 md:p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-muted-foreground/50 transition-colors">
                <div className="size-10 rounded-full bg-foreground flex items-center justify-center">
                  <Upload className="size-5 text-background" />
                </div>
                <p className="font-medium text-sm md:text-base text-center">Click or drag file to upload</p>
                <p className="text-xs md:text-sm text-muted-foreground text-center">SVG, PNG, JPG or GIF (max. 5MBG)</p>
              </div>
            </div>

            {/* Choose Class Type */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Choose Class Type</Label>
              <Select>
                <SelectTrigger className="w-full bg-secondary border-border">
                  <SelectValue placeholder="Select a class type to auto fill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crossfit">Morning Crossfit</SelectItem>
                  <SelectItem value="yoga">Yoga Flow</SelectItem>
                  <SelectItem value="hiit">HIIT Training</SelectItem>
                  <SelectItem value="pilates">Pilates</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Waiting List Capacity & Drop in Availability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Waiting List Capacity</Label>
                <Input type="number" defaultValue={0} className="bg-secondary border-border" />
              </div>
              <div className="flex items-center justify-between sm:pt-6">
                <Label className="text-sm">Drop in Availability</Label>
                <Switch checked={dropInAvailability} onCheckedChange={setDropInAvailability} />
              </div>
            </div>

            {/* Duration & Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Duration (mins)</Label>
                <Input type="number" defaultValue={60} className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Capacity</Label>
                <Input type="number" defaultValue={20} className="bg-secondary border-border" />
              </div>
            </div>

            {/* Instructor & Room */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Instructor</Label>
                <Select>
                  <SelectTrigger className="w-full bg-secondary border-border">
                    <div className="flex items-center gap-2">
                      <Search className="size-4 text-muted-foreground" />
                      <SelectValue placeholder="Instructor name" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Smith</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="mike">Mike Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Room/Studio</Label>
                <Select>
                  <SelectTrigger className="w-full bg-secondary border-border">
                    <div className="flex items-center gap-2">
                      <Search className="size-4 text-muted-foreground" />
                      <SelectValue placeholder="e.g, Main Studio" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Studio</SelectItem>
                    <SelectItem value="yoga">Yoga Studio</SelectItem>
                    <SelectItem value="spin">Spin Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Recurring Schedule */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-medium text-sm md:text-base">Recurring Schedule</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Enable to create a repeating class schedule</p>
                </div>
                <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
              </div>
              {isRecurring && (
                <Button
                  variant="secondary"
                  className="bg-accent text-accent-foreground hover:bg-accent/80 w-full sm:w-auto"
                  onClick={onOpenRecurringSettings}
                >
                  Open Recurring Settings
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="p-4 md:p-6 pt-4 border-t border-border shrink-0">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 w-full">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/80 w-full sm:w-auto">
              <Plus className="size-4 mr-2" />
              Create Schedule
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
