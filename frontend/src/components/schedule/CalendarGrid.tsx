import { ClassEvent } from '../../types/schedule';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { User, MapPin, Users } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CalendarGridProps {
  events: ClassEvent[];
  currentDate: Date;
  onEventClick: (event: ClassEvent) => void;
}

const timeSlots = ['1 PM', '5 PM', '9 PM'];

export function CalendarGrid({ events, currentDate, onEventClick }: CalendarGridProps) {
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDayAndTime = (day: Date, time: string) => {
    const hour = time === '1 PM' ? 13 : time === '5 PM' ? 17 : 21;
    return events.filter(
      (event) => isSameDay(event.date, day) && event.time === `${hour}:00`
    );
  };

  const getEventBorderColor = (type: ClassEvent['type']) => {
    switch (type) {
      case 'crossfit':
        return 'border-l-event-crossfit';
      case 'yoga':
        return 'border-l-event-yoga';
      case 'workshop':
        return 'border-l-event-workshop';
      default:
        return 'border-l-muted';
    }
  };

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <div className="min-w-[800px]">
        {/* Header row with days */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-border">
          <div className="p-3" />
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className="border-l border-border p-3 text-center"
            >
              <div className="text-xs font-medium uppercase text-muted-foreground">
                {format(day, 'EEE')}
              </div>
              <div className="text-lg font-semibold">{format(day, 'd')}</div>
            </div>
          ))}
        </div>

        {/* Time slots */}
        {timeSlots.map((time) => (
          <div
            key={time}
            className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-border"
          >
            <div className="flex items-start justify-end p-3 text-sm text-muted-foreground">
              {time}
            </div>
            {weekDays.map((day) => {
              const dayEvents = getEventsForDayAndTime(day, time);
              return (
                <div
                  key={day.toISOString()}
                  className="min-h-32 border-l border-border p-2"
                >
                  {dayEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className={cn(
                        'w-full rounded-md bg-card border-l-4 p-2.5 text-left transition-colors hover:bg-secondary mb-2',
                        getEventBorderColor(event.type)
                      )}
                    >
                      <div className="font-medium text-sm leading-tight mb-1.5">
                        {event.title}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <User className="h-3 w-3" />
                        {event.instructor}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <MapPin className="h-3 w-3" />
                        {event.room}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span
                          className={cn(
                            event.booked / event.capacity > 0.7
                              ? 'text-event-crossfit'
                              : 'text-muted-foreground'
                          )}
                        >
                          {event.booked}/{event.capacity}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
