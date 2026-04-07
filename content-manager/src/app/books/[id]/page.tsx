'use client'

import { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppContext, formatStatus, BOOK_CYCLE } from '@/context/AppContext'
import StatusTimeline from '@/components/StatusTimeline'

export default function BookDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { books, deleteBook, updateBook } = useAppContext()

  const book = books.find((b) => b.id === id)

  if (!book) {
    return (
      <div>
        <p className="text-gray-400">Book not found.</p>
        <Link href="/books" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
          Back to books
        </Link>
      </div>
    )
  }

  const handleDelete = () => {
    deleteBook(id)
    router.push('/books')
  }

  const cycleStatus = () => {
    const next = BOOK_CYCLE[(BOOK_CYCLE.indexOf(book.status) + 1) % BOOK_CYCLE.length]
    updateBook(id, { status: next })
  }

  return (
    <div className="max-w-lg">
      <Link href="/books" className="text-sm text-gray-500 hover:underline">
        &larr; Back to books
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-1">{book.title}</h1>
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

      <button
        onClick={handleDelete}
        className="text-sm text-red-600 hover:underline"
      >
        Delete
      </button>
    </div>
  )
}
