import { CalendarEvent } from '../../services/api';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { User, MapPin, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CalendarGridProps {
  events: CalendarEvent[];
  currentDate: Date;
  onEventClick: (event: CalendarEvent) => void;
}

// Generate time slots from 6 AM to 10 PM (including 30-minute slots)
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

export function CalendarGrid({ events, currentDate, onEventClick }: CalendarGridProps) {
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDayAndTime = (day: Date, timeSlot: string) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, day) && event.startTime === timeSlot;
    });
  };

  const getEventBorderColor = (classType: string) => {
    const type = classType.toLowerCase();
    if (type.includes('crossfit')) return 'border-l-red-500';
    if (type.includes('yoga')) return 'border-l-green-500';
    if (type.includes('workshop')) return 'border-l-blue-500';
    return 'border-l-gray-400';
  };

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <div className="min-w-[800px]">
        {/* Header row with days */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-200 dark:border-gray-700">
          <div className="p-3" />
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className="border-l border-gray-200 dark:border-gray-700 p-3 text-center"
            >
              <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                {format(day, 'EEE')}
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Time slots */}
        {timeSlots.map((timeSlot) => {
          // Only show time slots that have events
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
                    className="min-h-20 border-l border-gray-200 dark:border-gray-700 p-2"
                  >
                    {dayEvents.map((event) => (
                      <button
                        key={event._id}
                        onClick={() => onEventClick(event)}
                        className={cn(
                          'w-full rounded-md bg-white dark:bg-gray-800 border-l-4 p-2.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 mb-2 shadow-sm',
                          getEventBorderColor(event.classType)
                        )}
                      >
                        <div className="font-medium text-sm leading-tight mb-1.5 text-gray-900 dark:text-gray-100">
                          {event.classType}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <User className="h-3 w-3" />
                          {event.instructor}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <MapPin className="h-3 w-3" />
                          {event.room}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                      </button>
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
