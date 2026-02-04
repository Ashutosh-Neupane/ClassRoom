import { CalendarEvent } from '../../services/api';
import { format } from 'date-fns';
import { User, MapPin, Clock, Repeat, Calendar as CalendarIcon, Users } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';

interface ListViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const getEventBorderColor = (classType: string) => {
  const type = classType.toLowerCase();
  if (type.includes('crossfit')) return 'border-l-red-500';
  if (type.includes('yoga')) return 'border-l-green-500';
  if (type.includes('pilates')) return 'border-l-purple-500';
  if (type.includes('cardio') || type.includes('cycling')) return 'border-l-orange-500';
  if (type.includes('martial') || type.includes('boxing')) return 'border-l-indigo-500';
  if (type.includes('swimming') || type.includes('aqua')) return 'border-l-cyan-500';
  return 'border-l-gray-400';
};

interface EventRowTooltipProps {
  event: CalendarEvent;
  children: React.ReactNode;
}

function EventRowTooltip({ event, children }: EventRowTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div className="absolute z-50 top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            {event.title || event.classType}
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" />
              <span>{event.instructor}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span>{event.room}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-3 w-3" />
              <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
            </div>
          </div>
          
          {event.isRecurring && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs">
                <Repeat className="h-3 w-3" />
                <span className="font-medium">Recurring Event</span>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Repeats weekly on the same day
              </div>
            </div>
          )}
          
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Capacity</span>
              <span className="font-medium">{event.booked}/{event.capacity}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${(event.booked / event.capacity) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ListView({ events, onEventClick }: ListViewProps) {
  const groupedEvents = events.reduce((groups, event) => {
    const date = format(new Date(event.date), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, CalendarEvent[]>);

  const sortedDates = Object.keys(groupedEvents).sort();

  return (
    <div className="space-y-6 p-4">
      {sortedDates.map((date) => {
        const dayEvents = groupedEvents[date];
        const dateObj = new Date(date);
        
        return (
          <div key={date} className="space-y-3">
            {/* Date Header */}
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {format(dateObj, 'EEEE, MMMM d')}
              </h3>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {dayEvents.length} {dayEvents.length === 1 ? 'class' : 'classes'}
              </span>
            </div>
            
            {/* Events for this date */}
            <div className="grid gap-3">
              {dayEvents
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((event) => (
                  <EventRowTooltip key={event._id} event={event}>
                    <button
                      onClick={() => onEventClick(event)}
                      className={cn(
                        'w-full p-4 rounded-lg border-l-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left shadow-sm',
                        getEventBorderColor(event.classType)
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {event.classType}
                            </h4>
                            {event.isRecurring && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                <Repeat className="h-3 w-3 mr-1" />
                                Recurring
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{event.startTime} - {event.endTime}</span>
                              <span className="text-xs">({event.duration} min)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{event.instructor}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{event.room}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 ml-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <Users className="h-4 w-4" />
                            <span>{event.booked}/{event.capacity}</span>
                          </div>
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={cn(
                                'h-2 rounded-full',
                                event.booked / event.capacity > 0.8 ? 'bg-red-500' :
                                event.booked / event.capacity > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                              )}
                              style={{ width: `${(event.booked / event.capacity) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  </EventRowTooltip>
                ))
              }
            </div>
          </div>
        );
      })}
      
      {events.length === 0 && (
        <div className="text-center py-12">
          <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No classes scheduled
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            There are no classes scheduled for the selected time period.
          </p>
        </div>
      )}
    </div>
  );
}
