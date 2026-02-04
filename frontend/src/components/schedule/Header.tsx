import { Search, Moon, Sun, PanelLeftClose } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { locations } from '../../data/mockData';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedLocation: string;
  onLocationChange: (value: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  selectedLocation,
  onLocationChange,
  isDarkMode,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="shrink-0">
          <PanelLeftClose className="h-5 w-5" />
        </Button>
        
        <div className="relative hidden w-64 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-secondary border-0"
          />
        </div>

        <Select value={selectedLocation} onValueChange={onLocationChange}>
          <SelectTrigger className="w-40 md:w-48 bg-secondary border-0">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onToggleTheme}>
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-secondary text-foreground text-sm font-medium">
            SN
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
