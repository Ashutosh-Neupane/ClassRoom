import { Button } from '../ui/button';

interface TabNavProps {
  activeTab: 'schedule' | 'type';
  onTabChange: (tab: 'schedule' | 'type') => void;
}

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="inline-flex rounded-lg bg-secondary p-1">
      <Button
        variant="ghost"
        size="sm"
        data-state={activeTab === 'schedule' ? 'active' : undefined}
        onClick={() => onTabChange('schedule')}
        className="rounded-md px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
      >
        Class Schedule
      </Button>
      <Button
        variant="ghost"
        size="sm"
        data-state={activeTab === 'type' ? 'active' : undefined}
        onClick={() => onTabChange('type')}
        className="rounded-md px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
      >
        Class Type
      </Button>
    </div>
  );
}
