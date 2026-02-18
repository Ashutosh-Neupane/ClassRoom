import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { format, addWeeks, subWeeks, addDays, subDays, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ViewMode } from '../../types/schedule';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface DateNavigationProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function DateNavigation({
  currentDate,
  onDateChange,
  viewMode,
  onViewModeChange,
}: DateNavigationProps) {
  const handlePrev = () => {
    switch (viewMode) {
      case 'day':
        onDateChange(subDays(currentDate, 1));
        break;
      case 'week':
        onDateChange(subWeeks(currentDate, 1));
        break;
      case 'month':
        onDateChange(subMonths(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (viewMode) {
      case 'day':
        onDateChange(addDays(currentDate, 1));
        break;
      case 'week':
        onDateChange(addWeeks(currentDate, 1));
        break;
      case 'month':
        onDateChange(addMonths(currentDate, 1));
        break;
    }
  };

  const getDateLabel = () => {
    switch (viewMode) {
      case 'day':
        return format(currentDate, 'MMM d');
      case 'week': {
        const start = startOfWeek(currentDate);
        const end = endOfWeek(currentDate);
        return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
      }
      case 'month':
        return format(currentDate, 'MMMM yyyy');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="min-w-28 text-center text-sm font-medium">
          {getDateLabel()}
        </span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="inline-flex rounded-lg bg-secondary p-1">
        {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
          <Button
            key={mode}
            variant="ghost"
            size="sm"
            data-state={viewMode === mode ? 'active' : undefined}
            onClick={() => onViewModeChange(mode)}
            className="rounded-md px-3 capitalize data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            {mode}
          </Button>
        ))}
      </div>

      <Select defaultValue="all">
        <SelectTrigger className="w-32 bg-secondary border-0">
          <SelectValue placeholder="All Events" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <SelectItem value="all">All Events</SelectItem>
          <SelectItem value="crossfit">Crossfit</SelectItem>
          <SelectItem value="yoga">Yoga</SelectItem>
          <SelectItem value="workshop">Workshop</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
