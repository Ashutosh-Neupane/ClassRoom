"use client"

import { useState, useEffect } from "react"
import { Search, Moon, Sun, PanelLeft } from "lucide-react"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border">
      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="outline" size="icon" className="size-9 md:size-10 bg-transparent shrink-0">
          <PanelLeft className="size-4 md:size-5" />
        </Button>

        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-40 md:w-56 bg-secondary border-border"
          />
        </div>

        <Select defaultValue="branch1">
          <SelectTrigger className="w-32 md:w-44 bg-secondary border-border text-xs md:text-sm">
            <SelectValue placeholder="Branch/Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="branch1">Branch/Location 1</SelectItem>
            <SelectItem value="branch2">Branch/Location 2</SelectItem>
            <SelectItem value="branch3">Branch/Location 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="size-9 md:size-10"
        >
          {mounted ? (
            resolvedTheme === "dark" ? (
              <Sun className="size-4 md:size-5" />
            ) : (
              <Moon className="size-4 md:size-5" />
            )
          ) : (
            <div className="size-4 md:size-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Avatar className="size-8 md:size-10">
          <AvatarFallback className="bg-secondary text-foreground text-xs md:text-sm">SN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
