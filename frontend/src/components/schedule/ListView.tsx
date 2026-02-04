import { CalendarEvent } from '../../services/api';
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
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function ListView({ events, onEventClick }: ListViewProps) {
  const getStatusBadge = (isRecurring: boolean) => {
    return (
      <Badge className="bg-success/20 text-success hover:bg-success/30 border-0">
        {isRecurring ? 'Recurring' : 'Scheduled'}
      </Badge>
    );
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
            <TableHead className="text-muted-foreground font-medium">Duration</TableHead>
            <TableHead className="text-muted-foreground font-medium">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow
              key={event._id}
              onClick={() => onEventClick(event)}
              className="cursor-pointer border-border hover:bg-secondary/50"
            >
              <TableCell className="font-medium">
                {format(event.date, 'EEE, MMM d')}
              </TableCell>
              <TableCell>{event.startTime} - {event.endTime}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {event.classType}
                  {event.isRecurring && (
                    <Tooltip>
                      <TooltipTrigger>
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-popover border-border">
                        <div className="text-sm">
                          <p className="font-medium mb-1">Recurring class</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </TableCell>
              <TableCell>{event.instructor}</TableCell>
              <TableCell>{event.room}</TableCell>
              <TableCell>{event.duration} mins</TableCell>
              <TableCell>{getStatusBadge(event.isRecurring)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
