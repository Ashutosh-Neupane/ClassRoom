// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
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
  classType: string;
  instructor: string;
  room: string;
  duration: number;
  startDate: string;
  endDate: string;
  recurrenceType: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
  weeklyDays?: string[];
  monthlyDates?: number[];
  timeSlots: string[];
  interval?: number;
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

      // Backend returns { title, message, data }, convert to { success, data }
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
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