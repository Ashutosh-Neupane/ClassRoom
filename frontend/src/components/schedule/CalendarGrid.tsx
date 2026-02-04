import { CalendarEvent } from '../../services/api';
import { format, startOfWeek, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { User, MapPin, Clock, Repeat, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';

interface CalendarGridProps {
  events: CalendarEvent[];
  currentDate: Date;
  viewMode: 'day' | 'week' | 'month';
  onEventClick: (event: CalendarEvent) => void;
}

// Generate time slots from 6 AM to 10 PM
const timeSlots = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', 
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

const formatTimeSlot = (time: string) => {
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr);
  const minute = minuteStr;
  const suffix = minute === '30' ? ':30' : '';
  
  if (hour === 0) return `12${suffix} AM`;
  if (hour < 12) return `${hour}${suffix} AM`;
  if (hour === 12) return `12${suffix} PM`;
  return `${hour - 12}${suffix} PM`;
};

const getEventBorderColor = (classType: string) => {
  const type = classType.toLowerCase();
  if (type.includes('crossfit')) return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
  if (type.includes('yoga')) return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
  if (type.includes('pilates')) return 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20';
  if (type.includes('cardio') || type.includes('cycling')) return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20';
  if (type.includes('martial') || type.includes('boxing')) return 'border-l-indigo-500 bg-indigo-50 dark:bg-indigo-900/20';
  if (type.includes('swimming') || type.includes('aqua')) return 'border-l-cyan-500 bg-cyan-50 dark:bg-cyan-900/20';
  return 'border-l-gray-400 bg-gray-50 dark:bg-gray-800';
};

const getRecurrenceInfo = (event: CalendarEvent) => {
  if (!event.isRecurring) return null;
  
  // Infer recurrence pattern from event data
  // In a real app, this would come from the API
  return {
    pattern: 'Weekly',
    description: 'Repeats every week on the same day'
  };
};

interface EventTooltipProps {
  event: CalendarEvent;
  children: React.ReactNode;
}

function EventTooltip({ event, children }: EventTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const recurrenceInfo = getRecurrenceInfo(event);
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {event.title || event.classType}
          </div>
          
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" />
              <span>Instructor: {event.instructor}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span>Room: {event.room} (Capacity: {event.capacity})</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>Time: {event.startTime} - {event.endTime} ({event.duration} min)</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-3 w-3" />
              <span>Date: {format(new Date(event.date), 'MMM d, yyyy')}</span>
            </div>
            
            {event.isRecurring && recurrenceInfo && (
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Repeat className="h-3 w-3" />
                  <span className="font-medium">Recurring Event</span>
                </div>
                <div className="mt-1 text-xs">
                  {recurrenceInfo.description}
                </div>
              </div>
            )}
            
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
              <div className="text-xs">
                <span className="font-medium">Booked:</span> {event.booked}/{event.capacity}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full" 
                    style={{ width: `${(event.booked / event.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EventCard({ event, onEventClick, compact = false }: { event: CalendarEvent; onEventClick: (event: CalendarEvent) => void; compact?: boolean }) {
  return (
    <EventTooltip event={event}>
      <button
        onClick={() => onEventClick(event)}
        className={cn(
          'w-full rounded-md border-l-4 p-2 text-left transition-all hover:shadow-md mb-1',
          getEventBorderColor(event.classType),
          compact ? 'p-1.5' : 'p-2.5'
        )}
      >
        <div className={cn(
          'font-medium leading-tight mb-1 text-gray-900 dark:text-gray-100 flex items-center gap-2',
          compact ? 'text-xs' : 'text-sm'
        )}>
          <span className="flex-1">{event.classType}</span>
          {event.isRecurring && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Repeat className="h-3 w-3 mr-1" />
              Recurring
            </span>
          )}
        </div>
        
        {!compact && (
          <>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 mb-1">
              <User className="h-3 w-3" />
              {event.instructor}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 mb-1">
              <MapPin className="h-3 w-3" />
              {event.room}
            </div>
          </>
        )}
        
        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
          <Clock className="h-3 w-3" />
          <span>{event.startTime} - {event.endTime}</span>
        </div>
      </button>
    </EventTooltip>
  );
}

export function CalendarGrid({ events, currentDate, viewMode, onEventClick }: CalendarGridProps) {
  const getEventsForDayAndTime = (day: Date, timeSlot: string) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, day) && event.startTime === timeSlot;
    });
  };

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, day);
    });
  };

  // Day View
  if (viewMode === 'day') {
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </h2>
          </div>
          
          {/* Time slots */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {timeSlots.map((timeSlot) => {
              const dayEvents = getEventsForDayAndTime(currentDate, timeSlot);
              if (dayEvents.length === 0) return null;
              
              return (
                <div key={timeSlot} className="flex">
                  <div className="w-20 flex-shrink-0 p-4 text-sm text-gray-500 dark:text-gray-400 text-right">
                    {formatTimeSlot(timeSlot)}
                  </div>
                  <div className="flex-1 p-4">
                    {dayEvents.map((event) => (
                      <EventCard key={event._id} event={event} onEventClick={onEventClick} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Week View
  if (viewMode === 'week') {
    const weekStart = startOfWeek(currentDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header row with days */}
          <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-200 dark:border-gray-700">
            <div className="p-3" />
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className={cn(
                  'border-l border-gray-200 dark:border-gray-700 p-3 text-center',
                  isToday(day) && 'bg-blue-50 dark:bg-blue-900/20'
                )}
              >
                <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  {format(day, 'EEE')}
                </div>
                <div className={cn(
                  'text-lg font-semibold',
                  isToday(day) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                )}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Time slots */}
          {timeSlots.map((timeSlot) => {
            const hasEvents = weekDays.some(day => getEventsForDayAndTime(day, timeSlot).length > 0);
            if (!hasEvents) return null;
            
            return (
              <div
                key={timeSlot}
                className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-end p-3 text-sm text-gray-500 dark:text-gray-400">
                  {formatTimeSlot(timeSlot)}
                </div>
                {weekDays.map((day) => {
                  const dayEvents = getEventsForDayAndTime(day, timeSlot);
                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        'min-h-20 border-l border-gray-200 dark:border-gray-700 p-2',
                        isToday(day) && 'bg-blue-50/30 dark:bg-blue-900/10'
                      )}
                    >
                      {dayEvents.map((event) => (
                        <EventCard key={event._id} event={event} onEventClick={onEventClick} />
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Month View
  if (viewMode === 'month') {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Pad to start on Sunday
    const startDay = startOfWeek(monthStart);
    const endDay = addDays(startDay, 41); // 6 weeks
    const calendarDays = eachDayOfInterval({ start: startDay, end: endDay });

    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Month header */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
          </div>
          
          {/* Days of week header */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'min-h-32 border-r border-b border-gray-200 dark:border-gray-700 p-2',
                    !isCurrentMonth && 'bg-gray-50 dark:bg-gray-800/50',
                    isToday(day) && 'bg-blue-50 dark:bg-blue-900/20'
                  )}
                >
                  <div className={cn(
                    'text-sm font-medium mb-2',
                    !isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100',
                    isToday(day) && 'text-blue-600 dark:text-blue-400'
                  )}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <EventCard key={event._id} event={event} onEventClick={onEventClick} compact />
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
