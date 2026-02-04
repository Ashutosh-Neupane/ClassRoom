import { useState } from 'react';
import { Plus, Upload, Clock, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { mockClassTypes, mockInstructors, mockRooms } from '../../data/mockData';
import { RecurringSettingsModal } from './RecurringSettingsModal';
import { RecurringPeriod } from '../../types/schedule';

interface ScheduleClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TimeSlot {
  id: string;
  time: string;
}

interface DaySchedule {
  day: string;
  slots: TimeSlot[];
}

export function ScheduleClassModal({ open, onOpenChange }: ScheduleClassModalProps) {
  const [waitingListCapacity, setWaitingListCapacity] = useState('0');
  const [dropInAvailability, setDropInAvailability] = useState(true);
  const [duration, setDuration] = useState('60');
  const [capacity, setCapacity] = useState('20');
  const [isRecurring, setIsRecurring] = useState(false);
  const [showRecurringSettings, setShowRecurringSettings] = useState(false);
  const [recurringPeriod, setRecurringPeriod] = useState<RecurringPeriod>('weekly');
  const [selectedClassType, setSelectedClassType] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [daySchedules, setDaySchedules] = useState<DaySchedule[]>([
    { day: 'Sunday', slots: [{ id: '1', time: '' }, { id: '2', time: '' }] },
    { day: 'Monday', slots: [{ id: '1', time: '' }, { id: '2', time: '' }] },
    { day: 'Tuesday', slots: [{ id: '1', time: '' }] },
    { day: 'Wednesday', slots: [] },
    { day: 'Thursday', slots: [] },
    { day: 'Friday', slots: [] },
    { day: 'Saturday', slots: [] },
  ]);

  const handleClassTypeChange = (value: string) => {
    setSelectedClassType(value);
    const classType = mockClassTypes.find((ct) => ct.id === value);
    if (classType) {
      setDuration(classType.defaultDuration.toString());
      setCapacity(classType.defaultCapacity.toString());
    }
  };

  const handleSubmit = () => {
    console.log('Creating schedule...', {
      classType: selectedClassType,
      instructor: selectedInstructor,
      room: selectedRoom,
      duration,
      capacity,
      waitingListCapacity,
      dropInAvailability,
      isRecurring,
      recurringPeriod,
    });
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create Class Schedule</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Schedule a new class, either as a one-off event or a recurring series.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* File Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">File Upload</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <p className="font-medium mb-1">Click or drag file to upload</p>
                <p className="text-sm text-muted-foreground">
                  SVG, PNG, JPG or GIF (max. 5MBG)
                </p>
              </div>
            </div>

            {/* Class Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Choose Class Type</Label>
              <Select value={selectedClassType} onValueChange={handleClassTypeChange}>
                <SelectTrigger className="bg-secondary border-0">
                  <SelectValue placeholder="Select a class type to auto fill" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {mockClassTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Waiting List & Drop-in */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Waiting List Capacity</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={waitingListCapacity}
                    onChange={(e) => setWaitingListCapacity(e.target.value)}
                    className="bg-secondary border-0"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                <Label className="text-sm font-medium">Drop in Availability</Label>
                <Switch
                  checked={dropInAvailability}
                  onCheckedChange={setDropInAvailability}
                  className="data-[state=checked]:bg-success"
                />
              </div>
            </div>

            {/* Duration & Capacity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Duration (mins)</Label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-secondary border-0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Capacity</Label>
                <Input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="bg-secondary border-0"
                />
              </div>
            </div>

            {/* Instructor & Room */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Instructor</Label>
                <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
                  <SelectTrigger className="bg-secondary border-0">
                    <SelectValue placeholder="Instructor name" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {mockInstructors.map((instructor) => (
                      <SelectItem key={instructor.id} value={instructor.id}>
                        {instructor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Room/Studio</Label>
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger className="bg-secondary border-0">
                    <SelectValue placeholder="e.g, Main Studio" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {mockRooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Recurring Schedule */}
            <div className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Recurring Schedule</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable to create a repeating class schedule
                  </p>
                </div>
                <Switch
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                  className="data-[state=checked]:bg-success"
                />
              </div>
              {isRecurring && (
                <Button
                  variant="secondary"
                  className="w-auto"
                  onClick={() => setShowRecurringSettings(true)}
                >
                  Open Recurring Settings
                </Button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleSubmit}>
              <Plus className="h-4 w-4 mr-1" />
              Create Schedule
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <RecurringSettingsModal
        open={showRecurringSettings}
        onOpenChange={setShowRecurringSettings}
        period={recurringPeriod}
        onPeriodChange={setRecurringPeriod}
      />
    </>
  );
}
