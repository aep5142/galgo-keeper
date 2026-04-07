'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type ContentType = 'article' | 'video' | 'paper' | 'blog' | 'news' | 'other'
export type ContentStatus = 'queued' | 'in-progress' | 'done' | 'dropped'
export type Priority = 'low' | 'medium' | 'high'

export type BookStatus = 'want-to-read' | 'reading' | 'finished' | 'dropped'

export type VideoType = 'movie' | 'tv-show' | 'documentary'
export type VideoStatus = 'queued' | 'watching' | 'watched' | 'dropped'

const STATUS_LABELS: Record<string, string> = {
  'queued': 'Queued',
  'in-progress': 'In Progress',
  'done': 'Done',
  'dropped': 'Dropped',
  'want-to-read': 'Want to Read',
  'reading': 'Reading',
  'finished': 'Finished',
  'watching': 'Watching',
  'watched': 'Watched',
}

export function formatStatus(status: string): string {
  return STATUS_LABELS[status] || status
}

export interface StatusChange {
  status: string
  date: string
}

export interface ContentItem {
  id: string
  title: string
  url: string
  type: ContentType
  status: ContentStatus
  priority: Priority
  category: string
  isPrivate: boolean
  yearCompleted: number | null
  coverImage: string | null
  statusHistory: StatusChange[]
  notes: string
  dateAdded: string
}

export interface Book {
  id: string
  title: string
  author: string
  status: BookStatus
  rating: number | null
  category: string
  isPrivate: boolean
  yearCompleted: number | null
  coverImage: string | null
  statusHistory: StatusChange[]
  notes: string
  dateAdded: string
}

export interface Video {
  id: string
  title: string
  type: VideoType
  status: VideoStatus
  rating: number | null
  recommendedBy: string
  category: string
  isPrivate: boolean
  yearCompleted: number | null
  statusHistory: StatusChange[]
  notes: string
  dateAdded: string
}

interface AppContextType {
  contentItems: ContentItem[]
  books: Book[]
  videos: Video[]
  addContentItem: (item: Omit<ContentItem, 'id' | 'dateAdded' | 'statusHistory'>) => void
  updateContentItem: (id: string, updates: Partial<ContentItem>) => void
  deleteContentItem: (id: string) => void
  addBook: (book: Omit<Book, 'id' | 'dateAdded' | 'statusHistory'>) => void
  updateBook: (id: string, updates: Partial<Book>) => void
  deleteBook: (id: string) => void
  addVideo: (video: Omit<Video, 'id' | 'dateAdded' | 'statusHistory'>) => void
  updateVideo: (id: string, updates: Partial<Video>) => void
  deleteVideo: (id: string) => void
}

// Cycle order for clicking through statuses
export const CONTENT_CYCLE: ContentStatus[] = ['queued', 'in-progress', 'done', 'dropped']
export const BOOK_CYCLE: BookStatus[] = ['want-to-read', 'reading', 'finished', 'dropped']
export const VIDEO_CYCLE: VideoStatus[] = ['queued', 'watching', 'watched', 'dropped']

// History level: dropped is at the same level as done/finished (keeps queued + in-progress only)
const HISTORY_LEVEL: Record<string, number> = {
  'queued': 0, 'in-progress': 1, 'done': 2, 'dropped': 2,
  'want-to-read': 0, 'reading': 1, 'finished': 2,
  'watching': 1, 'watched': 2,
}

function updateStatusHistory(
  history: StatusChange[],
  newStatus: string,
): StatusChange[] {
  const newLevel = HISTORY_LEVEL[newStatus] ?? 0
  // Keep only statuses with a lower level
  const kept = history.filter((e) => (HISTORY_LEVEL[e.status] ?? 0) < newLevel)
  return [...kept, { status: newStatus, date: new Date().toISOString() }]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [videos, setVideos] = useState<Video[]>([])

  const addContentItem = (item: Omit<ContentItem, 'id' | 'dateAdded' | 'statusHistory'>) => {
    const now = new Date().toISOString()
    const newItem: ContentItem = {
      ...item,
      id: crypto.randomUUID(),
      statusHistory: [{ status: item.status, date: now }],
      dateAdded: now,
    }
    setContentItems((prev) => [newItem, ...prev])
  }

  const updateContentItem = (id: string, updates: Partial<ContentItem>) => {
    setContentItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const updated = { ...item, ...updates }
        if (updates.status && updates.status !== item.status) {
          updated.statusHistory = updateStatusHistory(item.statusHistory, updates.status)
        }
        return updated
      })
    )
  }

  const deleteContentItem = (id: string) => {
    setContentItems((prev) => prev.filter((item) => item.id !== id))
  }

  const addBook = (book: Omit<Book, 'id' | 'dateAdded' | 'statusHistory'>) => {
    const now = new Date().toISOString()
    const statusDate = book.status === 'finished' && book.yearCompleted
      ? new Date(book.yearCompleted, 11, 31).toISOString()
      : now
    const newBook: Book = {
      ...book,
      id: crypto.randomUUID(),
      statusHistory: [{ status: book.status, date: statusDate }],
      dateAdded: now,
    }
    setBooks((prev) => [newBook, ...prev])
  }

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks((prev) =>
      prev.map((book) => {
        if (book.id !== id) return book
        const updated = { ...book, ...updates }
        if (updates.status && updates.status !== book.status) {
          updated.statusHistory = updateStatusHistory(book.statusHistory, updates.status)
        }
        return updated
      })
    )
  }

  const deleteBook = (id: string) => {
    setBooks((prev) => prev.filter((book) => book.id !== id))
  }

  const addVideo = (video: Omit<Video, 'id' | 'dateAdded' | 'statusHistory'>) => {
    const now = new Date().toISOString()
    const newVideo: Video = {
      ...video,
      id: crypto.randomUUID(),
      statusHistory: [{ status: video.status, date: now }],
      dateAdded: now,
    }
    setVideos((prev) => [newVideo, ...prev])
  }

  const updateVideo = (id: string, updates: Partial<Video>) => {
    setVideos((prev) =>
      prev.map((video) => {
        if (video.id !== id) return video
        const updated = { ...video, ...updates }
        if (updates.status && updates.status !== video.status) {
          updated.statusHistory = updateStatusHistory(video.statusHistory, updates.status)
        }
        return updated
      })
    )
  }

  const deleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((video) => video.id !== id))
  }

  return (
    <AppContext.Provider
      value={{
        contentItems,
        books,
        videos,
        addContentItem,
        updateContentItem,
        deleteContentItem,
        addBook,
        updateBook,
        deleteBook,
        addVideo,
        updateVideo,
        deleteVideo,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
