import { Calendar, List } from 'lucide-react';
import { Button } from '../ui/button';
import { DisplayMode } from '../../types/schedule';

interface ViewToggleProps {
  displayMode: DisplayMode;
  onDisplayModeChange: (mode: DisplayMode) => void;
}

export function ViewToggle({ displayMode, onDisplayModeChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg bg-secondary p-1">
      <Button
        variant="ghost"
        size="sm"
        data-state={displayMode === 'calendar' ? 'active' : undefined}
        onClick={() => onDisplayModeChange('calendar')}
        className="gap-2 rounded-md px-3 data-[state=active]:bg-card data-[state=active]:shadow-sm"
      >
        <Calendar className="h-4 w-4" />
        <span className="hidden sm:inline">Calender</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        data-state={displayMode === 'list' ? 'active' : undefined}
        onClick={() => onDisplayModeChange('list')}
        className="gap-2 rounded-md px-3 data-[state=active]:bg-card data-[state=active]:shadow-sm"
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline">List</span>
      </Button>
    </div>
  );
}
