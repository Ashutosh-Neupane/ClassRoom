import { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
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

interface TimeSlot {
  hour: number;
  minute: number;
}

interface RecurrenceRule {
  pattern: 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate: string;
  endDate: string;
  interval?: number;
  timeSlots?: TimeSlot[];
  weeklySchedule?: { [key: string]: TimeSlot[] };
  monthlySchedule?: { [key: number]: TimeSlot[] };
  customSchedule?: { [key: string]: TimeSlot[] };
}

interface RecurringSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (rule: RecurrenceRule) => void;
  initialRule?: RecurrenceRule;
}

const WEEKDAYS = [
  { key: 'sunday', label: 'Sunday' },
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' }
];

const MONTH_DATES = Array.from({ length: 31 }, (_, i) => i + 1);

export function RecurringSettingsModal({
  open,
  onOpenChange,
  onSave,
  initialRule
}: RecurringSettingsModalProps) {
  const [rule, setRule] = useState<RecurrenceRule>({
    pattern: 'daily',
    startDate: '',
    endDate: '',
    interval: 1,
    timeSlots: [{ hour: 9, minute: 0 }]
  });

  const [customDates, setCustomDates] = useState<string[]>([]);
  const [newCustomDate, setNewCustomDate] = useState('');

  useEffect(() => {
    if (initialRule) {
      setRule(initialRule);
      if (initialRule.customSchedule) {
        setCustomDates(Object.keys(initialRule.customSchedule));
      }
    }
  }, [initialRule]);

  const formatTime = (hour: number, minute: number): string => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const parseTime = (timeStr: string): TimeSlot => {
    const [hour, minute] = timeStr.split(':').map(Number);
    return { hour, minute };
  };

  const addTimeSlot = (target: 'daily' | string | number) => {
    const newSlot = { hour: 9, minute: 0 };
    
    if (target === 'daily') {
      setRule(prev => ({
        ...prev,
        timeSlots: [...(prev.timeSlots || []), newSlot]
      }));
    } else if (typeof target === 'string') {
      if (target.includes('-')) {
        setRule(prev => ({
          ...prev,
          customSchedule: {
            ...prev.customSchedule,
            [target]: [...(prev.customSchedule?.[target] || []), newSlot]
          }
        }));
      } else {
        setRule(prev => ({
          ...prev,
          weeklySchedule: {
            ...prev.weeklySchedule,
            [target]: [...(prev.weeklySchedule?.[target] || []), newSlot]
          }
        }));
      }
    } else {
      setRule(prev => ({
        ...prev,
        monthlySchedule: {
          ...prev.monthlySchedule,
          [target]: [...(prev.monthlySchedule?.[target] || []), newSlot]
        }
      }));
    }
  };

  const removeTimeSlot = (target: 'daily' | string | number, index: number) => {
    if (target === 'daily') {
      setRule(prev => ({
        ...prev,
        timeSlots: prev.timeSlots?.filter((_, i) => i !== index)
      }));
    } else if (typeof target === 'string') {
      if (target.includes('-')) {
        setRule(prev => ({
          ...prev,
          customSchedule: {
            ...prev.customSchedule,
            [target]: prev.customSchedule?.[target]?.filter((_, i) => i !== index) || []
          }
        }));
      } else {
        setRule(prev => ({
          ...prev,
          weeklySchedule: {
            ...prev.weeklySchedule,
            [target]: prev.weeklySchedule?.[target]?.filter((_, i) => i !== index) || []
          }
        }));
      }
    } else {
      setRule(prev => ({
        ...prev,
        monthlySchedule: {
          ...prev.monthlySchedule,
          [target]: prev.monthlySchedule?.[target]?.filter((_, i) => i !== index) || []
        }
      }));
    }
  };

  const updateTimeSlot = (target: 'daily' | string | number, index: number, timeStr: string) => {
    const timeSlot = parseTime(timeStr);
    
    if (target === 'daily') {
      setRule(prev => ({
        ...prev,
        timeSlots: prev.timeSlots?.map((slot, i) => i === index ? timeSlot : slot)
      }));
    } else if (typeof target === 'string') {
      if (target.includes('-')) {
        setRule(prev => ({
          ...prev,
          customSchedule: {
            ...prev.customSchedule,
            [target]: prev.customSchedule?.[target]?.map((slot, i) => i === index ? timeSlot : slot) || []
          }
        }));
      } else {
        setRule(prev => ({
          ...prev,
          weeklySchedule: {
            ...prev.weeklySchedule,
            [target]: prev.weeklySchedule?.[target]?.map((slot, i) => i === index ? timeSlot : slot) || []
          }
        }));
      }
    } else {
      setRule(prev => ({
        ...prev,
        monthlySchedule: {
          ...prev.monthlySchedule,
          [target]: prev.monthlySchedule?.[target]?.map((slot, i) => i === index ? timeSlot : slot) || []
        }
      }));
    }
  };

  const toggleWeekday = (day: string) => {
    setRule(prev => {
      const weeklySchedule = prev.weeklySchedule || {};
      if (weeklySchedule[day]) {
        const { [day]: removed, ...rest } = weeklySchedule;
        return { ...prev, weeklySchedule: rest };
      } else {
        return {
          ...prev,
          weeklySchedule: {
            ...weeklySchedule,
            [day]: [{ hour: 9, minute: 0 }]
          }
        };
      }
    });
  };

  const toggleMonthDate = (date: number) => {
    setRule(prev => {
      const monthlySchedule = prev.monthlySchedule || {};
      if (monthlySchedule[date]) {
        const { [date]: removed, ...rest } = monthlySchedule;
        return { ...prev, monthlySchedule: rest };
      } else {
        return {
          ...prev,
          monthlySchedule: {
            ...monthlySchedule,
            [date]: [{ hour: 9, minute: 0 }]
          }
        };
      }
    });
  };

  const addCustomDate = () => {
    if (newCustomDate && !customDates.includes(newCustomDate)) {
      const newDates = [...customDates, newCustomDate];
      setCustomDates(newDates);
      setRule(prev => ({
        ...prev,
        customSchedule: {
          ...prev.customSchedule,
          [newCustomDate]: [{ hour: 9, minute: 0 }]
        }
      }));
      setNewCustomDate('');
    }
  };

  const removeCustomDate = (dateStr: string) => {
    setCustomDates(prev => prev.filter(d => d !== dateStr));
    setRule(prev => {
      const { [dateStr]: removed, ...rest } = prev.customSchedule || {};
      return { ...prev, customSchedule: rest };
    });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(rule);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Recurring Schedule Settings</DialogTitle>
          <p className="text-muted-foreground text-sm">
            Configure your recurring class schedule pattern with multiple time slots.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Pattern Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Recurring Period</Label>
            <Select
              value={rule.pattern}
              onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'custom') => 
                setRule(prev => ({ ...prev, pattern: value }))
              }
            >
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

          {/* Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Start Date</Label>
              <Input
                type="date"
                value={rule.startDate}
                onChange={(e) => setRule(prev => ({ ...prev, startDate: e.target.value }))}
                className="bg-secondary border-0"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">End Date</Label>
              <Input
                type="date"
                value={rule.endDate}
                onChange={(e) => setRule(prev => ({ ...prev, endDate: e.target.value }))}
                className="bg-secondary border-0"
              />
            </div>
          </div>

          {/* Daily Pattern */}
          {rule.pattern === 'daily' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Time Slots (Every Day)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTimeSlot('daily')}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Time
                </Button>
              </div>
              <div className="space-y-2">
                {rule.timeSlots?.map((slot, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={formatTime(slot.hour, slot.minute)}
                      onChange={(e) => updateTimeSlot('daily', index, e.target.value)}
                      className="flex-1 bg-secondary border-0"
                    />
                    {(rule.timeSlots?.length || 0) > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimeSlot('daily', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Pattern */}
          {rule.pattern === 'weekly' && (
            <div className="space-y-4">
              <Label className="text-sm font-medium">Select Days and Time Slots</Label>
              <div className="space-y-3">
                {WEEKDAYS.map(({ key, label }) => (
                  <div key={key} className="border border-border rounded-lg p-4 bg-secondary/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={!!rule.weeklySchedule?.[key]}
                          onCheckedChange={() => toggleWeekday(key)}
                        />
                        <Label className="text-sm font-medium">{label}</Label>
                      </div>
                      {rule.weeklySchedule?.[key] && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addTimeSlot(key)}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Time
                        </Button>
                      )}
                    </div>
                    {rule.weeklySchedule?.[key] && (
                      <div className="space-y-2">
                        {rule.weeklySchedule[key].map((slot, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={formatTime(slot.hour, slot.minute)}
                              onChange={(e) => updateTimeSlot(key, index, e.target.value)}
                              className="flex-1 bg-background border-0"
                            />
                            {rule.weeklySchedule![key].length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTimeSlot(key, index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monthly Pattern */}
          {rule.pattern === 'monthly' && (
            <div>
              <Label className="mb-3 block">Select Dates and Time Slots</Label>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {MONTH_DATES.map(date => (
                  <Button
                    key={date}
                    type="button"
                    variant={rule.monthlySchedule?.[date] ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleMonthDate(date)}
                    className="h-8"
                  >
                    {date}
                  </Button>
                ))}
              </div>
              <div className="space-y-4">
                {Object.entries(rule.monthlySchedule || {}).map(([date, slots]) => (
                  <div key={date} className="border border-border rounded-lg p-4 bg-secondary/50">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-medium">Day {date}</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTimeSlot(parseInt(date))}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Time
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {slots.map((slot, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={formatTime(slot.hour, slot.minute)}
                            onChange={(e) => updateTimeSlot(parseInt(date), index, e.target.value)}
                            className="flex-1 bg-background border-0"
                          />
                          {slots.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTimeSlot(parseInt(date), index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Pattern */}
          {rule.pattern === 'custom' && (
            <div>
              <Label className="mb-3 block">Custom Schedule - Select Specific Dates</Label>
              <div className="flex gap-2 mb-4">
                <Input
                  type="date"
                  value={newCustomDate}
                  onChange={(e) => setNewCustomDate(e.target.value)}
                  className="flex-1 bg-secondary border-0"
                  placeholder="Select date"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCustomDate}
                  disabled={!newCustomDate}
                >
                  <Calendar className="h-4 w-4 mr-1" /> Add Date
                </Button>
              </div>
              <div className="space-y-4">
                {customDates.map(dateStr => (
                  <div key={dateStr} className="border border-border rounded-lg p-4 bg-secondary/50">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-medium">
                        {new Date(dateStr).toLocaleDateString()}
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addTimeSlot(dateStr)}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Time
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomDate(dateStr)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {(rule.customSchedule?.[dateStr] || []).map((slot, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={formatTime(slot.hour, slot.minute)}
                            onChange={(e) => updateTimeSlot(dateStr, index, e.target.value)}
                            className="flex-1 bg-background border-0"
                          />
                          {(rule.customSchedule?.[dateStr]?.length || 0) > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTimeSlot(dateStr, index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
