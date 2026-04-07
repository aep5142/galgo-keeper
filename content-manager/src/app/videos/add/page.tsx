'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext, VideoType, VideoStatus } from '@/context/AppContext'
import CategoryInput from '@/components/CategoryInput'

export default function AddVideo() {
  const router = useRouter()
  const { addVideo, videos } = useAppContext()
  const existingCategories = Array.from(new Set(videos.map((v) => v.category).filter(Boolean)))

  const [title, setTitle] = useState('')
  const [type, setType] = useState<VideoType>('movie')
  const [status, setStatus] = useState<VideoStatus>('queued')
  const [rating, setRating] = useState<string>('')
  const [recommendedBy, setRecommendedBy] = useState('')
  const [category, setCategory] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [yearCompleted, setYearCompleted] = useState<string>('')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addVideo({
      title,
      type,
      status,
      rating: rating ? parseInt(rating) : null,
      recommendedBy: recommendedBy.trim(),
      category: category.trim(),
      isPrivate,
      yearCompleted: yearCompleted ? parseInt(yearCompleted) : null,
      notes,
    })
    router.push('/videos')
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-amber-700">Add Video</h1>
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
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as VideoType)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="movie">Movie</option>
              <option value="tv-show">TV Show</option>
              <option value="documentary">Documentary</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as VideoStatus)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="queued">Queued</option>
              <option value="watching">Watching</option>
              <option value="watched">Watched</option>
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
          <label className="block text-sm font-medium mb-1">Recommended by</label>
          <input
            value={recommendedBy}
            onChange={(e) => setRecommendedBy(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="Who recommended this?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <CategoryInput
            value={category}
            onChange={setCategory}
            categories={existingCategories}
            placeholder="e.g. Sci-Fi, Comedy, True Crime"
            required
          />
        </div>
        {status === 'watched' && (
          <div>
            <label className="block text-sm font-medium mb-1">Year Watched</label>
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
          className="bg-amber-600 text-white text-sm px-4 py-2 rounded hover:bg-amber-700"
        >
          Add Video
        </button>
      </form>
    </div>
  )
}
