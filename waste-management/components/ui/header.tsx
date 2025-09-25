import * as React from "react"

import { 
  Search, 
  Bell, 
  ArrowLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Input } from "./input"

export interface HeaderProps {
  title?: string
  showBackButton?: boolean
  onBackClick?: () => void
  searchPlaceholder?: string
  onSearchChange?: (value: string) => void
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ComponentType<{ className?: string }>
  }
  className?: string
}

const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
  ({ 
    title, 
    showBackButton = false, 
    onBackClick, 
    searchPlaceholder = "Search Here...", 
    onSearchChange,
    primaryAction,
    className 
  }, ref) => {
    const [searchValue, setSearchValue] = React.useState("")
    const [isDark, setIsDark] = React.useState(false)

    React.useEffect(() => {
      const checkTheme = () => {
        setIsDark(document.documentElement.classList.contains('dark'))
      }
      
      checkTheme()
      const observer = new MutationObserver(checkTheme)
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
      
      return () => observer.disconnect()
    }, [])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchValue(value)
      onSearchChange?.(value)
    }

    return (
      <header
        ref={ref}
        className={cn(
          "flex flex-col sm:flex-row items-center p-3 pt-3 bg-background gap-3 sm:gap-0",
          className
        )}
      >
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          {showBackButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBackClick}
              className="flex items-center space-x-2 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          )}
        </div>

        {/* <div className="flex items-center justify-between w-full sm:max-w-sm md:max-w-md lg:max-w-lg sm:ml-4 md:ml-6 sm:mr-auto">
          <div className="relative w-3/4 sm:w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={handleSearchChange}
              className="pl-10 pr-10 sm:pr-16 rounded-lg bg-white w-full h-10 sm:h-12"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 hidden sm:flex">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
          
          <div 
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ml-2 sm:hidden",
              isDark 
                ? "hover:opacity-80" 
                : "bg-white hover:bg-white/95"
            )}
            style={{
              backgroundColor: isDark ? '#393939' : undefined
            }}
          >
            <Bell className="h-4 w-4 text-gray-700 dark:text-white" />
          </div>
        </div> */}

        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-center sm:justify-end sm:ml-auto">
          
          <div 
            className={cn(
              "w-10 h-10 rounded-xl hidden sm:flex items-center justify-center transition-all cursor-pointer",
              isDark 
                ? "hover:opacity-80" 
                : "bg-white hover:bg-white/95"
            )}
            style={{
              backgroundColor: isDark ? '#393939' : undefined
            }}
          >
            <Bell className="h-4 w-4 text-gray-700 dark:text-white" />
          </div>

          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              className="flex items-center space-x-1 bg-[#1D923C] text-white hover:bg-[#0d4e27]/80 rounded-full py-2 h-10 justify-center cursor-pointer w-auto px-4 sm:px-8"
            >
              {primaryAction.icon && <primaryAction.icon className="h-5 w-5" />}
              <span className="font-medium text-xs sm:text-sm">{primaryAction.label}</span>
            </Button>
          )}
        </div>
      </header>
    )
  }
)
Header.displayName = "Header"

export { Header }