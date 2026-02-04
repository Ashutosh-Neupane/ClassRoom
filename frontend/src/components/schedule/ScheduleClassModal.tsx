import { useState } from 'react';
import { Plus, Upload } from 'lucide-react';
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
import { useInstructors, useRooms, useCreateSchedule } from '../../hooks/useScheduleAPI';
import { RecurringSettingsModal } from './RecurringSettingsModal';
import { RecurringPeriod } from '../../types/schedule';
import { toast } from 'sonner';

interface ScheduleClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleClassModal({ open, onOpenChange }: ScheduleClassModalProps) {
  const [waitingListCapacity, setWaitingListCapacity] = useState('0');
  const [dropInAvailability, setDropInAvailability] = useState(true);
  const [duration, setDuration] = useState('60');
  const [capacity, setCapacity] = useState('20');
  const [classType, setClassType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [showRecurringSettings, setShowRecurringSettings] = useState(false);
  const [recurringPeriod, setRecurringPeriod] = useState<RecurringPeriod>('weekly');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // API hooks
  const { data: instructors = [], isLoading: loadingInstructors } = useInstructors();
  const { data: rooms = [], isLoading: loadingRooms } = useRooms();
  const createScheduleMutation = useCreateSchedule();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!classType || !selectedInstructor || !selectedRoom || !startDate || !endDate || !timeSlot) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const scheduleData = {
        classType,
        instructor: selectedInstructor,
        room: selectedRoom,
        duration: parseInt(duration),
        startDate,
        endDate,
        recurrenceType: (isRecurring ? 'WEEKLY' : 'NONE') as 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM',
        timeSlots: [timeSlot]
      };

      await createScheduleMutation.mutateAsync(scheduleData);
      
      toast.success('Schedule created successfully!');
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to create schedule');
      console.error('Error creating schedule:', error);
    }
  };

  const resetForm = () => {
    setClassType('');
    setSelectedInstructor('');
    setSelectedRoom('');
    setDuration('60');
    setCapacity('20');
    setStartDate('');
    setEndDate('');
    setTimeSlot('');
    setIsRecurring(false);
    setFile(null);
  };

  const handleRecurringToggle = (checked: boolean) => {
    setIsRecurring(checked);
    if (checked) {
      setShowRecurringSettings(true);
    }
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
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-medium mb-1">
                    {file ? file.name : 'Click or drag file to upload'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    SVG, PNG, JPG or GIF (max. 5MB)
                  </p>
                </label>
              </div>
            </div>

            {/* Class Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Class Type *</Label>
              <Input
                value={classType}
                onChange={(e) => setClassType(e.target.value)}
                placeholder="e.g., Morning Crossfit, Yoga Flow"
                className="bg-secondary border-0"
              />
            </div>

            {/* Waiting List & Drop-in */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Waiting List Capacity</Label>
                <Input
                  type="number"
                  value={waitingListCapacity}
                  onChange={(e) => setWaitingListCapacity(e.target.value)}
                  className="bg-secondary border-0"
                />
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
                <Label className="text-sm font-medium">Duration (mins) *</Label>
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

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Start Date *</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-secondary border-0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">End Date *</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-secondary border-0"
                />
              </div>
            </div>

            {/* Time Slot */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Time Slot *</Label>
              <Input
                type="time"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="bg-secondary border-0"
              />
            </div>

            {/* Instructor & Room */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Instructor *</Label>
                <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
                  <SelectTrigger className="bg-secondary border-0">
                    <SelectValue placeholder={loadingInstructors ? "Loading..." : "Instructor name"} />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {instructors.map((instructor) => (
                      <SelectItem key={instructor._id} value={instructor._id}>
                        {instructor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Room/Studio *</Label>
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger className="bg-secondary border-0">
                    <SelectValue placeholder={loadingRooms ? "Loading..." : "e.g, Main Studio"} />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {rooms.map((room) => (
                      <SelectItem key={room._id} value={room._id}>
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
                  onCheckedChange={handleRecurringToggle}
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
            <Button 
              variant="accent" 
              onClick={handleSubmit}
              disabled={createScheduleMutation.isPending}
            >
              {createScheduleMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Create Schedule
                </>
              )}
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