import { addDays, addWeeks, addMonths, format, startOfDay, isValid } from 'date-fns';

export interface TimeSlot {
  hour: number;
  minute: number;
}

export interface RecurrenceRule {
  pattern: 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate: Date;
  endDate: Date;
  interval?: number; // Every N days/weeks/months
  
  // Daily pattern
  timeSlots?: TimeSlot[];
  
  // Weekly pattern
  weeklySchedule?: {
    [key: string]: TimeSlot[]; // day: timeSlots
  };
  
  // Monthly pattern
  monthlySchedule?: {
    [key: number]: TimeSlot[]; // date: timeSlots
  };
  
  // Custom pattern
  customSchedule?: {
    [key: string]: TimeSlot[]; // ISO date string: timeSlots
  };
}

export interface GeneratedOccurrence {
  date: Date;
  timeSlots: TimeSlot[];
}

export class RecurrenceEngine {
  static generateOccurrences(rule: RecurrenceRule): GeneratedOccurrence[] {
    const occurrences: GeneratedOccurrence[] = [];
    
    if (!isValid(rule.startDate) || !isValid(rule.endDate)) {
      throw new Error('Invalid start or end date');
    }
    
    if (rule.startDate >= rule.endDate) {
      throw new Error('Start date must be before end date');
    }
    
    switch (rule.pattern) {
      case 'daily':
        return this.generateDailyOccurrences(rule);
      case 'weekly':
        return this.generateWeeklyOccurrences(rule);
      case 'monthly':
        return this.generateMonthlyOccurrences(rule);
      case 'custom':
        return this.generateCustomOccurrences(rule);
      default:
        throw new Error(`Unsupported recurrence pattern: ${rule.pattern}`);
    }
  }
  
  private static generateDailyOccurrences(rule: RecurrenceRule): GeneratedOccurrence[] {
    const occurrences: GeneratedOccurrence[] = [];
    const interval = rule.interval || 1;
    const timeSlots = rule.timeSlots || [];
    
    let currentDate = startOfDay(rule.startDate);
    const endDate = startOfDay(rule.endDate);
    
    while (currentDate <= endDate) {
      occurrences.push({
        date: new Date(currentDate),
        timeSlots: [...timeSlots]
      });
      
      currentDate = addDays(currentDate, interval);
    }
    
    return occurrences;
  }
  
  private static generateWeeklyOccurrences(rule: RecurrenceRule): GeneratedOccurrence[] {
    const occurrences: GeneratedOccurrence[] = [];
    const interval = rule.interval || 1;
    const weeklySchedule = rule.weeklySchedule || {};
    
    let currentDate = startOfDay(rule.startDate);
    const endDate = startOfDay(rule.endDate);
    
    while (currentDate <= endDate) {
      const dayName = format(currentDate, 'EEEE').toLowerCase();
      const timeSlots = weeklySchedule[dayName];
      
      if (timeSlots && timeSlots.length > 0) {
        occurrences.push({
          date: new Date(currentDate),
          timeSlots: [...timeSlots]
        });
      }
      
      currentDate = addDays(currentDate, 1);
      
      // Skip to next interval week if we've completed a week
      if (format(currentDate, 'EEEE').toLowerCase() === 'sunday' && interval > 1) {
        currentDate = addWeeks(currentDate, interval - 1);
      }
    }
    
    return occurrences;
  }
  
  private static generateMonthlyOccurrences(rule: RecurrenceRule): GeneratedOccurrence[] {
    const occurrences: GeneratedOccurrence[] = [];
    const interval = rule.interval || 1;
    const monthlySchedule = rule.monthlySchedule || {};
    
    let currentDate = startOfDay(rule.startDate);
    const endDate = startOfDay(rule.endDate);
    
    while (currentDate <= endDate) {
      const dayOfMonth = currentDate.getDate();
      const timeSlots = monthlySchedule[dayOfMonth];
      
      if (timeSlots && timeSlots.length > 0) {
        occurrences.push({
          date: new Date(currentDate),
          timeSlots: [...timeSlots]
        });
      }
      
      // Move to next day
      currentDate = addDays(currentDate, 1);
      
      // Skip months based on interval
      if (currentDate.getDate() === 1 && interval > 1) {
        currentDate = addMonths(currentDate, interval - 1);
      }
    }
    
    return occurrences;
  }
  
  private static generateCustomOccurrences(rule: RecurrenceRule): GeneratedOccurrence[] {
    const occurrences: GeneratedOccurrence[] = [];
    const customSchedule = rule.customSchedule || {};
    
    for (const [dateStr, timeSlots] of Object.entries(customSchedule)) {
      const date = new Date(dateStr);
      
      if (isValid(date) && 
          date >= startOfDay(rule.startDate) && 
          date <= startOfDay(rule.endDate) &&
          timeSlots.length > 0) {
        occurrences.push({
          date: startOfDay(date),
          timeSlots: [...timeSlots]
        });
      }
    }
    
    return occurrences.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  
  static validateTimeSlot(timeSlot: TimeSlot): boolean {
    return timeSlot.hour >= 0 && timeSlot.hour <= 23 && 
           timeSlot.minute >= 0 && timeSlot.minute <= 59;
  }
  
  static validateRecurrenceRule(rule: RecurrenceRule): string[] {
    const errors: string[] = [];
    
    if (!rule.startDate || !isValid(rule.startDate)) {
      errors.push('Invalid start date');
    }
    
    if (!rule.endDate || !isValid(rule.endDate)) {
      errors.push('Invalid end date');
    }
    
    if (rule.startDate && rule.endDate && rule.startDate >= rule.endDate) {
      errors.push('Start date must be before end date');
    }
    
    if (rule.interval && rule.interval < 1) {
      errors.push('Interval must be at least 1');
    }
    
    // Validate time slots based on pattern
    switch (rule.pattern) {
      case 'daily':
        if (!rule.timeSlots || rule.timeSlots.length === 0) {
          errors.push('Daily pattern requires at least one time slot');
        } else {
          rule.timeSlots.forEach((slot, index) => {
            if (!this.validateTimeSlot(slot)) {
              errors.push(`Invalid time slot at index ${index}`);
            }
          });
        }
        break;
        
      case 'weekly':
        if (!rule.weeklySchedule || Object.keys(rule.weeklySchedule).length === 0) {
          errors.push('Weekly pattern requires at least one day with time slots');
        } else {
          Object.entries(rule.weeklySchedule).forEach(([day, slots]) => {
            if (!slots || slots.length === 0) {
              errors.push(`No time slots defined for ${day}`);
            } else {
              slots.forEach((slot, index) => {
                if (!this.validateTimeSlot(slot)) {
                  errors.push(`Invalid time slot for ${day} at index ${index}`);
                }
              });
            }
          });
        }
        break;
        
      case 'monthly':
        if (!rule.monthlySchedule || Object.keys(rule.monthlySchedule).length === 0) {
          errors.push('Monthly pattern requires at least one date with time slots');
        } else {
          Object.entries(rule.monthlySchedule).forEach(([date, slots]) => {
            const dayNum = parseInt(date);
            if (dayNum < 1 || dayNum > 31) {
              errors.push(`Invalid day of month: ${date}`);
            }
            if (!slots || slots.length === 0) {
              errors.push(`No time slots defined for day ${date}`);
            } else {
              slots.forEach((slot, index) => {
                if (!this.validateTimeSlot(slot)) {
                  errors.push(`Invalid time slot for day ${date} at index ${index}`);
                }
              });
            }
          });
        }
        break;
        
      case 'custom':
        if (!rule.customSchedule || Object.keys(rule.customSchedule).length === 0) {
          errors.push('Custom pattern requires at least one date with time slots');
        } else {
          Object.entries(rule.customSchedule).forEach(([dateStr, slots]) => {
            const date = new Date(dateStr);
            if (!isValid(date)) {
              errors.push(`Invalid date: ${dateStr}`);
            }
            if (!slots || slots.length === 0) {
              errors.push(`No time slots defined for ${dateStr}`);
            } else {
              slots.forEach((slot, index) => {
                if (!this.validateTimeSlot(slot)) {
                  errors.push(`Invalid time slot for ${dateStr} at index ${index}`);
                }
              });
            }
          });
        }
        break;
    }
    
    return errors;
  }
}