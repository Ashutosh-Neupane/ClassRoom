import { useState } from 'react';
import { Plus, Clock, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
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
import { cn } from '../../lib/utils';

interface RecurringSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  period: RecurringPeriod;
  onPeriodChange: (period: RecurringPeriod) => void;
}

interface TimeSlot {
  id: string;
  time: string;
}

interface DaySchedule {
  day: string;
  label: string;
  slots: TimeSlot[];
}

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function RecurringSettingsModal({
  open,
  onOpenChange,
  period,
  onPeriodChange,
}: RecurringSettingsModalProps) {
  const [selectedDay, setSelectedDay] = useState('Sunday');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [daySchedules, setDaySchedules] = useState<DaySchedule[]>(
    weekDays.map((day) => ({
      day,
      label: day,
      slots: [],
    }))
  );
  const [monthlyDates, setMonthlyDates] = useState<string[]>(['10', '15', '20']);

  const addTimeSlot = (dayIndex: number) => {
    const newSchedules = [...daySchedules];
    newSchedules[dayIndex].slots.push({
      id: Date.now().toString(),
      time: '',
    });
    setDaySchedules(newSchedules);
  };

  const updateTimeSlot = (dayIndex: number, slotIndex: number, time: string) => {
    const newSchedules = [...daySchedules];
    newSchedules[dayIndex].slots[slotIndex].time = time;
    setDaySchedules(newSchedules);
  };

  const getVisibleDays = () => {
    switch (period) {
      case 'daily':
        return [{ day: 'Everyday', label: 'Everyday', slots: daySchedules[0]?.slots || [] }];
      case 'weekly':
        return daySchedules.filter((d) => d.day === selectedDay);
      case 'monthly':
        return monthlyDates.map((date) => ({
          day: date,
          label: `${date}th`,
          slots: daySchedules[0]?.slots || [],
        }));
      case 'custom':
      default:
        return daySchedules;
    }
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
          {/* Recurring Toggle */}
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label className="text-sm font-medium">Recurring Schedule</Label>
                <p className="text-sm text-muted-foreground">
                  Enable to create a repeating class schedule
                </p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-success" />
            </div>

            {/* Period & Duration Row */}
            <div className={cn(
              "grid gap-4",
              period === 'weekly' ? 'grid-cols-3' : 'grid-cols-2'
            )}>
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
                    placeholder={period === 'monthly' ? 'MM/YYYY' : 'DD/MM/YYYY'}
                    className="bg-secondary border-0"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    placeholder={period === 'monthly' ? 'MM/YYYY' : 'DD/MM/YYYY'}
                    className="bg-secondary border-0"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>

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
                  <Label className="text-sm font-medium">Chose dates for classes</Label>
                  <Input
                    placeholder="10, 15, 20"
                    className="bg-secondary border-0"
                    value={monthlyDates.join(', ')}
                    onChange={(e) => setMonthlyDates(e.target.value.split(',').map((s) => s.trim()))}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Time Slots Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-3 border-b border-border bg-secondary/50">
              <div className="text-sm font-medium text-muted-foreground">
                {period === 'monthly' ? 'Date' : 'Day'}
              </div>
              <div className="text-sm font-medium text-muted-foreground">Time 1</div>
              <div className="text-sm font-medium text-muted-foreground">Time 2</div>
              <div className="text-sm font-medium text-muted-foreground">Time 3</div>
            </div>

            {getVisibleDays().map((schedule, dayIndex) => (
              <div
                key={schedule.day}
                className="grid grid-cols-4 gap-4 p-3 border-b border-border last:border-0 items-center"
              >
                <div className="text-sm font-medium">{schedule.label}</div>
                
                {[0, 1, 2].map((slotIndex) => {
                  const slot = schedule.slots[slotIndex];
                  if (slot) {
                    return (
                      <div key={slotIndex} className="relative">
                        <Input
                          placeholder="--:--"
                          value={slot.time}
                          onChange={(e) => updateTimeSlot(dayIndex, slotIndex, e.target.value)}
                          className="bg-secondary border-0 pr-8"
                        />
                        <Clock className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    );
                  }
                  
                  // Show add button if previous slots are filled or it's the first slot
                  const canAdd =
                    slotIndex === 0 ||
                    (schedule.slots[slotIndex - 1] && schedule.slots[slotIndex - 1].time);
                  
                  if (canAdd && slotIndex === schedule.slots.length) {
                    return (
                      <Button
                        key={slotIndex}
                        variant="default"
                        size="sm"
                        className="w-12 h-9"
                        onClick={() => addTimeSlot(dayIndex)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    );
                  }
                  
                  return (
                    <Button
                      key={slotIndex}
                      variant="default"
                      size="sm"
                      className="w-12 h-9"
                      onClick={() => addTimeSlot(dayIndex)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="accent" onClick={() => onOpenChange(false)}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
