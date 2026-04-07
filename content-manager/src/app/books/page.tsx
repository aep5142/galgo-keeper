'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAppContext, BookStatus, Book, formatStatus, BOOK_CYCLE } from '@/context/AppContext'
import StatusTimeline from '@/components/StatusTimeline'

const STATUS_ORDER: Record<string, number> = {
  'reading': 0,
  'want-to-read': 1,
  'finished': 2,
  'dropped': 3,
}

function DetailPanel({ book, onClose }: { book: Book; onClose: () => void }) {
  const { updateBook, deleteBook } = useAppContext()

  const cycleStatus = () => {
    const next = BOOK_CYCLE[(BOOK_CYCLE.indexOf(book.status) + 1) % BOOK_CYCLE.length]
    updateBook(book.id, { status: next })
  }

  const handleDelete = () => {
    deleteBook(book.id)
    onClose()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onClose} className="text-sm text-gray-500 hover:underline cursor-pointer">&larr; Close</button>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg">&times;</button>
      </div>

      <h1 className="text-2xl font-bold mt-2 mb-1">{book.title}</h1>
      <p className="text-gray-500 mb-4">{book.author}</p>

      <div className="flex items-center gap-3 mb-6">
        {book.category && (
          <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">{book.category}</span>
        )}
        {book.isPrivate && (
          <span className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded">private</span>
        )}
        <button
          onClick={cycleStatus}
          className={`text-xs px-2 py-1 rounded cursor-pointer ${
            book.status === 'finished'
              ? 'bg-green-100 text-green-700'
              : book.status === 'reading'
              ? 'bg-yellow-100 text-yellow-700'
              : book.status === 'dropped'
              ? 'bg-orange-100 text-orange-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {formatStatus(book.status)}
        </button>
        {book.rating && (
          <span className="text-sm text-yellow-600">
            {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
          </span>
        )}
      </div>

      {book.yearCompleted && (
        <p className="text-sm text-gray-500 mb-4">Finished in {book.yearCompleted}</p>
      )}

      {book.coverImage && (
        <div className="mb-6">
          <img src={book.coverImage} alt={book.title} className="max-h-64 rounded" />
        </div>
      )}

      {book.notes && (
        <div className="mb-6">
          <h2 className="text-sm font-medium mb-1">Notes</h2>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{book.notes}</p>
        </div>
      )}

      <StatusTimeline history={book.statusHistory} />

      <p className="text-xs text-gray-400 mb-6">
        Added {new Date(book.dateAdded).toLocaleDateString()}
      </p>

      <button onClick={handleDelete} className="text-sm text-red-600 hover:underline">
        Delete
      </button>
    </div>
  )
}

export default function BooksList() {
  const { books, updateBook } = useAppContext()
  const [filterStatus, setFilterStatus] = useState<BookStatus | 'all'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showCompleted, setShowCompleted] = useState<Record<string, boolean>>({})
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const categories = Array.from(new Set(books.map((b) => b.category).filter(Boolean)))

  const filtered = books.filter((book) => {
    if (filterStatus !== 'all' && book.status !== filterStatus) return false
    if (filterCategory !== 'all' && book.category !== filterCategory) return false
    return true
  })

  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, book) => {
    const cat = book.category || 'Uncategorized'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(book)
    return acc
  }, {})

  for (const cat of Object.keys(grouped)) {
    grouped[cat].sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9))
  }

  const sortedCategories = Object.keys(grouped).sort()
  const selectedBook = selectedId ? books.find((b) => b.id === selectedId) : null

  const renderRow = (book: typeof books[0], hasBorder: boolean) => (
    <Link
      key={book.id}
      href={`/books/${book.id}`}
      onClick={(e) => {
        if (window.innerWidth >= 768) {
          e.preventDefault()
          setSelectedId(book.id)
        }
      }}
      className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50${
        hasBorder ? ' border-t border-gray-100' : ''
      }${selectedId === book.id ? ' bg-violet-50' : ' bg-white'}`}
    >
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm">{book.title}</p>
          {book.isPrivate && (
            <span className="text-xs bg-red-50 text-red-500 px-1.5 py-0.5 rounded">
              private
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">{book.author}</p>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const next = BOOK_CYCLE[(BOOK_CYCLE.indexOf(book.status) + 1) % BOOK_CYCLE.length]
          updateBook(book.id, { status: next })
        }}
        className={`text-xs px-2 py-0.5 rounded cursor-pointer ${
          book.status === 'finished'
            ? 'bg-green-100 text-green-700'
            : book.status === 'reading'
            ? 'bg-yellow-100 text-yellow-700'
            : book.status === 'dropped'
            ? 'bg-orange-100 text-orange-700'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        {formatStatus(book.status)}
      </button>
    </Link>
  )

  return (
    <div className="md:flex md:gap-0">
      {/* List panel */}
      <div className={`max-w-4xl ${selectedBook ? 'md:w-[420px] md:shrink-0 md:max-w-none' : 'w-full'}`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-violet-700">Books</h1>
          <Link
            href="/books/add"
            className="bg-violet-600 text-white text-sm px-4 py-2 rounded hover:bg-violet-700"
          >
            + Add Book
          </Link>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as BookStatus | 'all')}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="want-to-read">Want to Read</option>
            <option value="reading">Reading</option>
            <option value="finished">Finished</option>
            <option value="dropped">Dropped</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No books found.{' '}
            <Link href="/books/add" className="text-violet-600 hover:underline">
              Add one
            </Link>
          </p>
        ) : (
          <div className="space-y-8">
            {sortedCategories.map((category) => {
              const active = grouped[category].filter((b) => b.status !== 'finished' && b.status !== 'dropped')
              const completed = grouped[category].filter((b) => b.status === 'finished' || b.status === 'dropped')
              const isExpanded = showCompleted[category] ?? false

              return (
                <div key={category}>
                  <div className="mb-3">
                    <span className="inline-block bg-violet-100 text-violet-700 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full">
                      {category}
                    </span>
                  </div>
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    {active.map((book, i) => renderRow(book, i > 0))}
                    {completed.length > 0 && (
                      <>
                        <button
                          onClick={() => setShowCompleted((prev) => ({ ...prev, [category]: !isExpanded }))}
                          className={`w-full text-left px-4 py-2 text-xs text-gray-500 hover:bg-gray-50 cursor-pointer${
                            active.length > 0 ? ' border-t border-gray-100' : ''
                          }`}
                        >
                          {isExpanded ? 'Hide' : 'Show'} completed ({completed.length})
                        </button>
                        {isExpanded && completed.map((book) => renderRow(book, true))}
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail panel — desktop only */}
      {selectedBook && (
        <div className="hidden md:block md:flex-1 md:border-l md:border-gray-200 md:ml-6 md:overflow-y-auto">
          <DetailPanel book={selectedBook} onClose={() => setSelectedId(null)} />
        </div>
      )}
    </div>
  )
}
