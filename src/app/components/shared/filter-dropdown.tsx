import { useState } from 'react'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Filter, Check } from 'lucide-react'

interface FilterOption {
  label: string
  value: string
}

interface FilterDropdownProps {
  options: FilterOption[]
  selectedValue: string
  onSelect: (value: string) => void
  label?: string
}

export function FilterDropdown({ 
  options, 
  selectedValue, 
  onSelect, 
  label = "Filter" 
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false)

  const selectedOption = options.find(opt => opt.value === selectedValue)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          {selectedOption ? selectedOption.label : label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => {
              onSelect(option.value)
              setOpen(false)
            }}
            className="flex items-center justify-between"
          >
            <span>{option.label}</span>
            {selectedValue === option.value && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}