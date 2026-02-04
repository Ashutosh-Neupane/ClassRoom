import { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Header } from '../components/schedule/Header';
import { TabNav } from '../components/schedule/TabNav';
import { ViewToggle } from '../components/schedule/ViewToggle';
import { DateNavigation } from '../components/schedule/DateNavigation';
import { CalendarGrid } from '../components/schedule/CalendarGrid';
import { ListView } from '../components/schedule/ListView';
import { ScheduleClassModal } from '../components/schedule/ScheduleClassModal';
import { useCalendarEvents, useCalendarNavigation, useHealthCheck } from '../hooks/useScheduleAPI';
import { CalendarEvent } from '../services/api';
import { toast } from 'sonner';
import { DisplayMode, ViewMode } from '../types/schedule';

export default function SchedulePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('1');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'schedule' | 'type'>('schedule');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('calendar');
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // API Integration
  const { data: events = [], isLoading, error } = useCalendarEvents(currentDate, viewMode);
  const { prefetchNext, prefetchPrevious } = useCalendarNavigation(currentDate, viewMode);
  const { data: healthStatus } = useHealthCheck();

  // Show error toast if API call fails
  if (error) {
    toast.error('Failed to load calendar events', {
      description: 'Please check your connection and try again',
    });
  }

  // Apply dark mode
  useState(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  });

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    console.log('Event clicked:', event);
  };

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
    // Prefetch adjacent data
    prefetchNext();
    prefetchPrevious();
  };

  // Filter events based on search
  const filteredEvents = useMemo(() => {
    if (!searchQuery) return events;
    const query = searchQuery.toLowerCase();
    return events.filter(
      (event) =>
        event.classType?.toLowerCase().includes(query) ||
        event.instructor?.toLowerCase().includes(query) ||
        event.room?.toLowerCase().includes(query)
    );
  }, [searchQuery, events]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      <main className="p-4 md:p-6 space-y-6">
        {error && (
          <div className="text-sm text-red-600 dark:text-red-400">
            ⚠ Backend connection failed - showing offline mode
          </div>
        )}

        {/* Top Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Page Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Class Schedule</h1>
            <p className="text-muted-foreground">
              Manage recurring schedules and one-off classes.
            </p>
          </div>
          <Button
            variant="accent"
            onClick={() => setIsScheduleModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Schedule Class
          </Button>
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ViewToggle
            displayMode={displayMode}
            onDisplayModeChange={setDisplayMode}
          />
          <DateNavigation
            currentDate={currentDate}
            onDateChange={handleDateChange}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>

        {/* Mobile Search */}
        <div className="relative md:hidden">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary border-0"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Main Content */}
        {!isLoading && (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {displayMode === 'calendar' ? (
              <CalendarGrid
                events={filteredEvents}
                currentDate={currentDate}
                viewMode={viewMode}
                onEventClick={handleEventClick}
              />
            ) : (
              <ListView
                events={filteredEvents}
                onEventClick={handleEventClick}
              />
            )}
          </div>
        )}
      </main>

      <ScheduleClassModal
        open={isScheduleModalOpen}
        onOpenChange={setIsScheduleModalOpen}
      />
    </div>
  );
}
