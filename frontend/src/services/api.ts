// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Response Types
export interface ApiResponse<T> {
  title: string;
  message: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  title: string;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

// Backend Types (matching exact backend schema)
export interface ScheduleRule {
  _id?: string;
  classType: string;
  instructor: string; // ObjectId as string
  room: string; // ObjectId as string
  duration: number; // in minutes
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  recurrenceType: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
  weeklyDays?: string[]; // ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
  monthlyDates?: number[]; // [5, 20]
  timeSlots: string[]; // ["09:00", "14:00"]
  interval?: number; // every n days/weeks
  createdAt?: string;
  updatedAt?: string;
}

// Calendar Event (projected from backend)
export interface CalendarEvent {
  _id: string;
  classType: string;
  instructor: string;
  room: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  ruleId: string;
  isRecurring: boolean;
}

// Instructor and Room types
export interface Instructor {
  _id: string;
  name: string;
  email?: string;
  specialization?: string[];
}

export interface Room {
  _id: string;
  name: string;
  capacity?: number;
  equipment?: string[];
}

// Form data for creating schedules
export interface CreateScheduleData {
  title: string;
  description?: string;
  classType: string;
  instructor: string;
  room: string;
  capacity: number;
  waitingListCapacity: number;
  duration: number;
  dropInAvailability: boolean;
  isRecurring: boolean;
  // Single event fields
  date?: string;
  startTime?: string;
  endTime?: string;
  // Recurring event fields
  recurrenceRule?: {
    pattern: 'daily' | 'weekly' | 'monthly' | 'custom';
    startDate: string;
    endDate: string;
    interval?: number;
    timeSlots?: Array<{ hour: number; minute: number }>;
    weeklySchedule?: { [key: string]: Array<{ hour: number; minute: number }> };
    monthlySchedule?: { [key: number]: Array<{ hour: number; minute: number }> };
  };
}

// API Service Class
class ScheduleAPI {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      // Backend returns { title, message, data, pagination? }
      return {
        title: data.title,
        message: data.message,
        data: data.data,
        ...(data.pagination && { pagination: data.pagination })
      };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Create Schedule Rule
  async createSchedule(schedule: CreateScheduleData): Promise<ApiResponse<ScheduleRule>> {
    return this.request<ScheduleRule>('/schedules', {
      method: 'POST',
      body: JSON.stringify(schedule),
    });
  }

  // Get Calendar Events (projected occurrences)
  async getCalendarEvents(startDate: string, endDate: string): Promise<ApiResponse<CalendarEvent[]>> {
    const params = new URLSearchParams({
      startDate,
      endDate
    });
    return this.request<CalendarEvent[]>(`/schedules/calendar?${params}`);
  }

  // Get All Schedule Rules with pagination
  async getScheduleRules(page: number = 1, limit: number = 10): Promise<ApiResponse<ScheduleRule[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    return this.request<ScheduleRule[]>(`/schedules?${params}`);
  }

  // Get Single Schedule Rule
  async getScheduleRule(id: string): Promise<ApiResponse<ScheduleRule>> {
    return this.request<ScheduleRule>(`/schedules/${id}`);
  }

  // Update Schedule Rule
  async updateSchedule(id: string, schedule: Partial<CreateScheduleData>): Promise<ApiResponse<ScheduleRule>> {
    return this.request<ScheduleRule>(`/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(schedule),
    });
  }

  // Delete Schedule Rule
  async deleteSchedule(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/schedules/${id}`, {
      method: 'DELETE',
    });
  }

  // Get All Instructors
  async getInstructors(): Promise<ApiResponse<Instructor[]>> {
    return this.request<Instructor[]>('/schedules/instructors');
  }

  // Get All Rooms
  async getRooms(): Promise<ApiResponse<Room[]>> {
    return this.request<Room[]>('/schedules/rooms');
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.request<{ status: string }>('/health');
  }

  // Check Schedule Conflicts (remove - not implemented in backend)
  // async checkConflicts(schedule: CreateScheduleData): Promise<ApiResponse<{ hasConflicts: boolean; conflicts: CalendarEvent[] }>> {
  //   return this.request<{ hasConflicts: boolean; conflicts: CalendarEvent[] }>('/schedules/conflicts', {
  //     method: 'POST',
  //     body: JSON.stringify(schedule),
  //   });
  // }
}

// Export singleton instance
export const scheduleAPI = new ScheduleAPI();