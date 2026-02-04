import { ClassEvent } from '../../types/schedule';
import { format } from 'date-fns';
import { RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui/tooltip';
import { Badge } from '../ui/badge';

interface ListViewProps {
  events: ClassEvent[];
  onEventClick: (event: ClassEvent) => void;
}

export function ListView({ events, onEventClick }: ListViewProps) {
  const getStatusBadge = (status: ClassEvent['status']) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-success/20 text-success hover:bg-success/30 border-0">
            Complete
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30 border-0">
            Cancelled
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge className="bg-warning/20 text-warning hover:bg-warning/30 border-0">
            Scheduled
          </Badge>
        );
    }
  };

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="text-muted-foreground font-medium">Date</TableHead>
            <TableHead className="text-muted-foreground font-medium">Time</TableHead>
            <TableHead className="text-muted-foreground font-medium">Class Type</TableHead>
            <TableHead className="text-muted-foreground font-medium">Instructor</TableHead>
            <TableHead className="text-muted-foreground font-medium">Room</TableHead>
            <TableHead className="text-muted-foreground font-medium">Bookings</TableHead>
            <TableHead className="text-muted-foreground font-medium">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow
              key={event.id}
              onClick={() => onEventClick(event)}
              className="cursor-pointer border-border hover:bg-secondary/50"
            >
              <TableCell className="font-medium">
                {format(event.date, 'EEE, MMM d')}
              </TableCell>
              <TableCell>{event.time}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {event.title}
                  {event.isRecurring && (
                    <Tooltip>
                      <TooltipTrigger>
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-popover border-border">
                        <div className="text-sm">
                          <p className="font-medium mb-1">Recurring at {event.time}</p>
                          <div className="flex gap-1">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                              <span
                                key={i}
                                className={cn(
                                  'w-5 h-5 rounded-full flex items-center justify-center text-xs',
                                  event.recurringDays?.includes(day)
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-muted-foreground'
                                )}
                              >
                                {day}
                              </span>
                            ))}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </TableCell>
              <TableCell>{event.instructor}</TableCell>
              <TableCell>{event.room}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    event.booked / event.capacity > 0.7
                      ? 'text-event-crossfit'
                      : 'text-foreground'
                  )}
                >
                  {event.booked}/{event.capacity}
                </span>
                <span className="text-success ml-2">+{Math.floor(Math.random() * 3)}</span>
              </TableCell>
              <TableCell>{getStatusBadge(event.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
