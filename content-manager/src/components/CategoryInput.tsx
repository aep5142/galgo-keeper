'use client'

import { useState, useRef } from 'react'

interface CategoryInputProps {
  value: string
  onChange: (value: string) => void
  categories: string[]
  placeholder?: string
  required?: boolean
}

export default function CategoryInput({
  value,
  onChange,
  categories,
  placeholder,
  required,
}: CategoryInputProps) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const toTitleCase = (s: string) =>
    s.replace(/\b\w/g, (c) => c.toUpperCase())

  const matches = value.trim()
    ? categories.filter(
        (cat) =>
          cat.toLowerCase().includes(value.toLowerCase()) &&
          cat.toLowerCase() !== value.toLowerCase()
      )
    : categories

  const select = (cat: string) => {
    onChange(cat)
    setOpen(false)
    setHighlighted(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || matches.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((prev) => (prev + 1) % matches.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((prev) => (prev <= 0 ? matches.length - 1 : prev - 1))
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault()
      select(matches[highlighted])
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
          setHighlighted(-1)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          if (value.trim()) onChange(toTitleCase(value.trim()))
          setTimeout(() => setOpen(false), 150)
        }}
        onKeyDown={handleKeyDown}
        required={required}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        placeholder={placeholder}
      />
      {open && matches.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-sm max-h-40 overflow-y-auto">
          {matches.map((cat, i) => (
            <li
              key={cat}
              onMouseDown={() => select(cat)}
              onMouseEnter={() => setHighlighted(i)}
              className={`px-3 py-1.5 text-sm cursor-pointer ${
                i === highlighted ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              {cat}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
