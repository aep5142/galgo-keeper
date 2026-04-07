'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext, BookStatus } from '@/context/AppContext'
import CategoryInput from '@/components/CategoryInput'

export default function AddBook() {
  const router = useRouter()
  const { addBook, books } = useAppContext()
  const existingCategories = Array.from(new Set(books.map((b) => b.category).filter(Boolean)))

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [status, setStatus] = useState<BookStatus>('want-to-read')
  const [rating, setRating] = useState<string>('')
  const [category, setCategory] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [yearCompleted, setYearCompleted] = useState<string>('')
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [notes, setNotes] = useState('')

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setCoverImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addBook({
      title,
      author,
      status,
      rating: rating ? parseInt(rating) : null,
      category: category.trim(),
      isPrivate,
      yearCompleted: yearCompleted ? parseInt(yearCompleted) : null,
      coverImage,
      notes,
    })
    router.push('/books')
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-violet-700">Add Book</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Author *</label>
          <input
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BookStatus)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="want-to-read">Want to Read</option>
              <option value="reading">Reading</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">No rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <CategoryInput
            value={category}
            onChange={setCategory}
            categories={existingCategories}
            placeholder="e.g. Fiction, Technical, Self-help"
            required
          />
        </div>
        {status === 'finished' && (
          <div>
            <label className="block text-sm font-medium mb-1">Year Completed</label>
            <input
              type="number"
              value={yearCompleted}
              onChange={(e) => setYearCompleted(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder={new Date().getFullYear().toString()}
              min="1900"
              max="2099"
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPrivate"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="isPrivate" className="text-sm">Private</label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full text-sm"
          />
          {coverImage && (
            <div className="mt-2">
              <img src={coverImage} alt="Preview" className="max-h-40 rounded" />
              <button
                type="button"
                onClick={() => setCoverImage(null)}
                className="text-xs text-red-600 hover:underline mt-1"
              >
                Remove
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-violet-600 text-white text-sm px-4 py-2 rounded hover:bg-violet-700"
        >
          Add Book
        </button>
      </form>
    </div>
  )
}
