import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleAPI, ScheduleRule, CalendarEvent, CreateScheduleData, Instructor, Room } from '../services/api';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';

// Query Keys
export const QUERY_KEYS = {
  schedules: ['schedules'],
  schedule: (id: string) => ['schedule', id],
  calendar: (startDate: string, endDate: string) => ['calendar', startDate, endDate],
  instructors: ['instructors'],
  rooms: ['rooms'],
  conflicts: ['conflicts'],
  health: ['health'],
} as const;

// Hook for fetching calendar events with pagination
export function useCalendarEvents(currentDate: Date, viewMode: 'day' | 'week' | 'month' = 'week') {
  const getDateRange = (date: Date, mode: 'day' | 'week' | 'month') => {
    switch (mode) {
      case 'day':
        return { start: date, end: date };
      case 'week':
        return { start: startOfWeek(date), end: endOfWeek(date) };
      case 'month':
        return { start: startOfMonth(date), end: endOfMonth(date) };
      default:
        return { start: startOfWeek(date), end: endOfWeek(date) };
    }
  };

  const { start, end } = getDateRange(currentDate, viewMode);
  const startDateStr = format(start, 'yyyy-MM-dd');
  const endDateStr = format(end, 'yyyy-MM-dd');

  return useQuery({
    queryKey: QUERY_KEYS.calendar(startDateStr, endDateStr),
    queryFn: () => scheduleAPI.getCalendarEvents(startDateStr, endDateStr),
    select: (response) => response.data || [],
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new
  });
}

// Hook for navigation with prefetching
export function useCalendarNavigation(currentDate: Date, viewMode: 'day' | 'week' | 'month') {
  const queryClient = useQueryClient();

  const prefetchNext = () => {
    let nextDate: Date;
    switch (viewMode) {
      case 'day':
        nextDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 'week':
        nextDate = addWeeks(currentDate, 1);
        break;
      case 'month':
        nextDate = addMonths(currentDate, 1);
        break;
      default:
        nextDate = addWeeks(currentDate, 1);
    }

    const getDateRange = (date: Date, mode: 'day' | 'week' | 'month') => {
      switch (mode) {
        case 'day':
          return { start: date, end: date };
        case 'week':
          return { start: startOfWeek(date), end: endOfWeek(date) };
        case 'month':
          return { start: startOfMonth(date), end: endOfMonth(date) };
        default:
          return { start: startOfWeek(date), end: endOfWeek(date) };
      }
    };

    const { start, end } = getDateRange(nextDate, viewMode);
    const startDateStr = format(start, 'yyyy-MM-dd');
    const endDateStr = format(end, 'yyyy-MM-dd');

    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.calendar(startDateStr, endDateStr),
      queryFn: () => scheduleAPI.getCalendarEvents(startDateStr, endDateStr),
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchPrevious = () => {
    let prevDate: Date;
    switch (viewMode) {
      case 'day':
        prevDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        prevDate = subWeeks(currentDate, 1);
        break;
      case 'month':
        prevDate = subMonths(currentDate, 1);
        break;
      default:
        prevDate = subWeeks(currentDate, 1);
    }

    const getDateRange = (date: Date, mode: 'day' | 'week' | 'month') => {
      switch (mode) {
        case 'day':
          return { start: date, end: date };
        case 'week':
          return { start: startOfWeek(date), end: endOfWeek(date) };
        case 'month':
          return { start: startOfMonth(date), end: endOfMonth(date) };
        default:
          return { start: startOfWeek(date), end: endOfWeek(date) };
      }
    };

    const { start, end } = getDateRange(prevDate, viewMode);
    const startDateStr = format(start, 'yyyy-MM-dd');
    const endDateStr = format(end, 'yyyy-MM-dd');

    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.calendar(startDateStr, endDateStr),
      queryFn: () => scheduleAPI.getCalendarEvents(startDateStr, endDateStr),
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetchNext, prefetchPrevious };
}

// Hook for fetching all schedule rules
export function useScheduleRules(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...QUERY_KEYS.schedules, page, limit],
    queryFn: () => scheduleAPI.getScheduleRules(page, limit),
    select: (response) => ({
      schedules: response.data || [],
      pagination: response.pagination
    }),
  });
}

// Hook for fetching single schedule rule
export function useScheduleRule(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.schedule(id),
    queryFn: () => scheduleAPI.getScheduleRule(id),
    select: (response) => response.data,
    enabled: !!id,
  });
}

// Hook for fetching instructors
export function useInstructors() {
  return useQuery({
    queryKey: QUERY_KEYS.instructors,
    queryFn: () => scheduleAPI.getInstructors(),
    select: (response) => response.data || [],
    staleTime: 10 * 60 * 1000, // 10 minutes - instructors don't change often
  });
}

// Hook for fetching rooms
export function useRooms() {
  return useQuery({
    queryKey: QUERY_KEYS.rooms,
    queryFn: () => scheduleAPI.getRooms(),
    select: (response) => response.data || [],
    staleTime: 10 * 60 * 1000, // 10 minutes - rooms don't change often
  });
}

// Hook for creating a new schedule
export function useCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schedule: CreateScheduleData) => scheduleAPI.createSchedule(schedule),
    onSuccess: () => {
      // Invalidate and refetch calendar and schedules data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.schedules });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
}

// Hook for updating a schedule
export function useUpdateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, schedule }: { id: string; schedule: Partial<CreateScheduleData> }) =>
      scheduleAPI.updateSchedule(id, schedule),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.schedules });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.schedule(id) });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
}

// Hook for deleting a schedule
export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scheduleAPI.deleteSchedule(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.schedules });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.schedule(id) });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
}

// Hook for checking schedule conflicts (commented out - not implemented)
// export function useCheckConflicts() {
//   return useMutation({
//     mutationFn: (schedule: CreateScheduleData) => scheduleAPI.checkConflicts(schedule),
//   });
// }

// Hook for health check
export function useHealthCheck() {
  return useQuery({
    queryKey: QUERY_KEYS.health,
    queryFn: () => scheduleAPI.healthCheck(),
    select: (response) => response.data,
    retry: 3,
    retryDelay: 1000,
  });
}