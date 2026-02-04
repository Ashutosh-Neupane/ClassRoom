import { useState } from 'react';
import { Plus, Clock, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
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
import { RecurringPeriod } from '../../types/schedule';

interface RecurringSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  period: RecurringPeriod;
  onPeriodChange: (period: RecurringPeriod) => void;
}

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function RecurringSettingsModal({
  open,
  onOpenChange,
  period,
  onPeriodChange,
}: RecurringSettingsModalProps) {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeSlots, setTimeSlots] = useState<string[]>(['']);
  const [monthlyDates, setMonthlyDates] = useState('10, 15, 20');

  const addTimeSlot = () => {
    if (timeSlots.length < 3) {
      setTimeSlots([...timeSlots, '']);
    }
  };

  const updateTimeSlot = (index: number, time: string) => {
    const newSlots = [...timeSlots];
    newSlots[index] = time;
    setTimeSlots(newSlots);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create Class Schedule</DialogTitle>
          <p className="text-muted-foreground text-sm">
            Schedule a new class, either as a one-off event or a recurring series.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Period & Duration Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Recurring Period</Label>
              <Select value={period} onValueChange={(v) => onPeriodChange(v as RecurringPeriod)}>
                <SelectTrigger className="bg-secondary border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Duration</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  className="bg-secondary border-0"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="date"
                  className="bg-secondary border-0"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Day/Date Selection */}
          {period === 'weekly' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Choose Day</Label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="bg-secondary border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {weekDays.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {period === 'monthly' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Choose dates for classes</Label>
              <Input
                placeholder="10, 15, 20"
                className="bg-secondary border-0"
                value={monthlyDates}
                onChange={(e) => setMonthlyDates(e.target.value)}
              />
            </div>
          )}

          {/* Time Slots */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Time Slots</Label>
            {timeSlots.map((slot, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="time"
                  placeholder="--:--"
                  value={slot}
                  onChange={(e) => updateTimeSlot(index, e.target.value)}
                  className="bg-secondary border-0"
                />
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
            {timeSlots.length < 3 && (
              <Button
                variant="outline"
                size="sm"
                onClick={addTimeSlot}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Time Slot
              </Button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
