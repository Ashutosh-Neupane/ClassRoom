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
import { ClassEvent, ViewMode, DisplayMode } from '../types/schedule';
import { mockEvents } from '../data/mockData';

export default function SchedulePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('1');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'schedule' | 'type'>('schedule');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('calendar');
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ClassEvent | null>(null);

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

  const handleEventClick = (event: ClassEvent) => {
    setSelectedEvent(event);
    console.log('Event clicked:', event);
  };

  // Filter events based on search
  const filteredEvents = useMemo(() => {
    if (!searchQuery) return mockEvents;
    const query = searchQuery.toLowerCase();
    return mockEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.instructor.toLowerCase().includes(query) ||
        event.room.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Add recurring data to some events for demo
  const eventsWithRecurring = useMemo(() => {
    return filteredEvents.map((event, i) => ({
      ...event,
      isRecurring: i % 2 === 0,
      recurringDays: i % 2 === 0 ? ['S', 'M', 'W', 'T', 'F'] : undefined,
      status: (['scheduled', 'completed', 'cancelled'] as const)[i % 3],
    }));
  }, [filteredEvents]);

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
            onDateChange={setCurrentDate}
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

        {/* Main Content */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {displayMode === 'calendar' ? (
            <CalendarGrid
              events={eventsWithRecurring}
              currentDate={currentDate}
              onEventClick={handleEventClick}
            />
          ) : (
            <ListView
              events={eventsWithRecurring}
              onEventClick={handleEventClick}
            />
          )}
        </div>
      </main>

      <ScheduleClassModal
        open={isScheduleModalOpen}
        onOpenChange={setIsScheduleModalOpen}
      />
    </div>
  );
}
