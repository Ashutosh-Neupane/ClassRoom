export interface ClassEvent {
  id: string;
  title: string;
  classType: string;
  instructor: string;
  room: string;
  date: Date | string;
  time: string;
  startTime: string;
  endTime: string;
  duration: number;
  capacity: number;
  booked: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'crossfit' | 'yoga' | 'workshop';
  isRecurring?: boolean;
  recurringDays?: string[];
  ruleId?: string;
}

export interface ClassType {
  id: string;
  name: string;
  description: string;
  defaultDuration: number;
  defaultCapacity: number;
  color: 'crossfit' | 'yoga' | 'workshop';
}

export interface Instructor {
  id: string;
  name: string;
  avatar?: string;
}

export interface Room {
  id: string;
  name: string;
}

export type ViewMode = 'day' | 'week' | 'month';
export type DisplayMode = 'calendar' | 'list';
export type RecurringPeriod = 'daily' | 'weekly' | 'monthly' | 'custom';
