'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext, ContentType, ContentStatus, Priority } from '@/context/AppContext'
import CategoryInput from '@/components/CategoryInput'

export default function AddContent() {
  const router = useRouter()
  const { addContentItem, contentItems } = useAppContext()
  const existingCategories = Array.from(new Set(contentItems.map((i) => i.category).filter(Boolean)))

  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [type, setType] = useState<ContentType>('article')
  const [status, setStatus] = useState<ContentStatus>('queued')
  const [priority, setPriority] = useState<Priority>('medium')
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
    addContentItem({
      title,
      url: url && !/^https?:\/\//i.test(url) ? `https://${url}` : url,
      type,
      status,
      priority,
      category: category.trim(),
      isPrivate,
      yearCompleted: yearCompleted ? parseInt(yearCompleted) : null,
      coverImage,
      notes,
    })
    router.push('/content')
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Add Content</h1>
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
          <label className="block text-sm font-medium mb-1">URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="https://..."
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ContentType)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="paper">Paper</option>
              <option value="blog">Blog</option>
              <option value="news">News</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ContentStatus)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="queued">Queued</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <CategoryInput
            value={category}
            onChange={setCategory}
            categories={existingCategories}
            placeholder="e.g. Machine Learning, Finance, Politics"
            required
          />
        </div>
        {status === 'done' && (
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
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Content
        </button>
      </form>
    </div>
  )
}
