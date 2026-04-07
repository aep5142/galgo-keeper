'use client'

import Link from 'next/link'
import { useAppContext, formatStatus, CONTENT_CYCLE, BOOK_CYCLE, VIDEO_CYCLE } from '@/context/AppContext'

export default function Dashboard() {
  const { contentItems, books, videos, updateContentItem, updateBook, updateVideo } = useAppContext()

  const inProgressContent = contentItems.filter((i) => i.status === 'in-progress')
  const readingBooks = books.filter((b) => b.status === 'reading')
  const watchingVideos = videos.filter((v) => v.status === 'watching')

  const hasAnything = inProgressContent.length > 0 || readingBooks.length > 0 || watchingVideos.length > 0

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">What you&apos;re currently working through.</p>

      {!hasAnything && (
        <div className="text-center py-16 text-gray-400">
          <p className="mb-2">Nothing in progress yet.</p>
          <p className="text-sm">
            Add items from{' '}
            <Link href="/content" className="text-blue-600 hover:underline">Content</Link>,{' '}
            <Link href="/books" className="text-violet-600 hover:underline">Books</Link>, or{' '}
            <Link href="/videos" className="text-amber-600 hover:underline">Videos</Link>{' '}
            and mark them as in progress to see them here.
          </p>
        </div>
      )}

      {readingBooks.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg text-violet-700">Reading</h2>
            <Link href="/books" className="text-sm text-violet-500 hover:underline">View all books</Link>
          </div>
          <div className="space-y-3">
            {readingBooks.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="block border border-violet-100 rounded-lg p-4 hover:bg-violet-50/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{book.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{book.author}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      const next = BOOK_CYCLE[(BOOK_CYCLE.indexOf(book.status) + 1) % BOOK_CYCLE.length]
                      updateBook(book.id, { status: next })
                    }}
                    className="text-xs px-2 py-1 rounded cursor-pointer bg-violet-100 text-violet-700"
                  >
                    {formatStatus(book.status)}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {inProgressContent.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg text-blue-700">Reading / Consuming</h2>
            <Link href="/content" className="text-sm text-blue-500 hover:underline">View all content</Link>
          </div>
          <div className="space-y-3">
            {inProgressContent.map((item) => (
              <Link
                key={item.id}
                href={`/content/${item.id}`}
                className="block border border-blue-100 rounded-lg p-4 hover:bg-blue-50/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.type} &middot; {item.priority} priority
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      const next = CONTENT_CYCLE[(CONTENT_CYCLE.indexOf(item.status) + 1) % CONTENT_CYCLE.length]
                      updateContentItem(item.id, { status: next })
                    }}
                    className="text-xs px-2 py-1 rounded cursor-pointer bg-blue-100 text-blue-700"
                  >
                    {formatStatus(item.status)}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {watchingVideos.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg text-amber-700">Watching</h2>
            <Link href="/videos" className="text-sm text-amber-500 hover:underline">View all videos</Link>
          </div>
          <div className="space-y-3">
            {watchingVideos.map((video) => (
              <Link
                key={video.id}
                href={`/videos/${video.id}`}
                className="block border border-amber-100 rounded-lg p-4 hover:bg-amber-50/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{video.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {video.type === 'tv-show' ? 'TV Show' : video.type === 'documentary' ? 'Documentary' : 'Movie'}
                      {video.recommendedBy && <> &middot; rec&apos;d by {video.recommendedBy}</>}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      const next = VIDEO_CYCLE[(VIDEO_CYCLE.indexOf(video.status) + 1) % VIDEO_CYCLE.length]
                      updateVideo(video.id, { status: next })
                    }}
                    className="text-xs px-2 py-1 rounded cursor-pointer bg-amber-100 text-amber-700"
                  >
                    {formatStatus(video.status)}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
