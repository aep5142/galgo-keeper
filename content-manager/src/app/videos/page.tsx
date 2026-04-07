'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAppContext, VideoType, VideoStatus, Video, formatStatus, VIDEO_CYCLE } from '@/context/AppContext'
import StatusTimeline from '@/components/StatusTimeline'

const STATUS_ORDER: Record<string, number> = {
  'watching': 0,
  'queued': 1,
  'watched': 2,
  'dropped': 3,
}

const typeLabel: Record<VideoType, string> = {
  'movie': 'Movie',
  'tv-show': 'TV Show',
  'documentary': 'Documentary',
}

function DetailPanel({ video, onClose }: { video: Video; onClose: () => void }) {
  const { updateVideo, deleteVideo } = useAppContext()

  const cycleStatus = () => {
    const next = VIDEO_CYCLE[(VIDEO_CYCLE.indexOf(video.status) + 1) % VIDEO_CYCLE.length]
    updateVideo(video.id, { status: next })
  }

  const handleDelete = () => {
    deleteVideo(video.id)
    onClose()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onClose} className="text-sm text-gray-500 hover:underline cursor-pointer">&larr; Close</button>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg">&times;</button>
      </div>

      <h1 className="text-2xl font-bold mt-2 mb-1">{video.title}</h1>
      <p className="text-gray-500 mb-4">{typeLabel[video.type]}</p>

      <div className="flex items-center gap-3 mb-6">
        {video.category && (
          <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">{video.category}</span>
        )}
        {video.isPrivate && (
          <span className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded">private</span>
        )}
        <button
          onClick={cycleStatus}
          className={`text-xs px-2 py-1 rounded cursor-pointer ${
            video.status === 'watched'
              ? 'bg-green-100 text-green-700'
              : video.status === 'watching'
              ? 'bg-yellow-100 text-yellow-700'
              : video.status === 'dropped'
              ? 'bg-orange-100 text-orange-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {formatStatus(video.status)}
        </button>
        {video.rating && (
          <span className="text-sm text-yellow-600">
            {'★'.repeat(video.rating)}{'☆'.repeat(5 - video.rating)}
          </span>
        )}
      </div>

      {video.yearCompleted && (
        <p className="text-sm text-gray-500 mb-4">Watched in {video.yearCompleted}</p>
      )}

      {video.recommendedBy && (
        <p className="text-sm text-gray-500 mb-4">Recommended by {video.recommendedBy}</p>
      )}

      {video.notes && (
        <div className="mb-6">
          <h2 className="text-sm font-medium mb-1">Notes</h2>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{video.notes}</p>
        </div>
      )}

      <StatusTimeline history={video.statusHistory} />

      <p className="text-xs text-gray-400 mb-6">
        Added {new Date(video.dateAdded).toLocaleDateString()}
      </p>

      <button onClick={handleDelete} className="text-sm text-red-600 hover:underline">
        Delete
      </button>
    </div>
  )
}

export default function VideosList() {
  const { videos, updateVideo } = useAppContext()
  const [filterType, setFilterType] = useState<VideoType | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<VideoStatus | 'all'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showCompleted, setShowCompleted] = useState<Record<string, boolean>>({})
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const categories = Array.from(new Set(videos.map((v) => v.category).filter(Boolean)))

  const filtered = videos.filter((video) => {
    if (filterType !== 'all' && video.type !== filterType) return false
    if (filterStatus !== 'all' && video.status !== filterStatus) return false
    if (filterCategory !== 'all' && video.category !== filterCategory) return false
    return true
  })

  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, video) => {
    const cat = video.category || 'Uncategorized'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(video)
    return acc
  }, {})

  for (const cat of Object.keys(grouped)) {
    grouped[cat].sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9))
  }

  const sortedCategories = Object.keys(grouped).sort()
  const selectedVideo = selectedId ? videos.find((v) => v.id === selectedId) : null

  const renderRow = (video: typeof videos[0], hasBorder: boolean) => (
    <Link
      key={video.id}
      href={`/videos/${video.id}`}
      onClick={(e) => {
        if (window.innerWidth >= 768) {
          e.preventDefault()
          setSelectedId(video.id)
        }
      }}
      className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50${
        hasBorder ? ' border-t border-gray-100' : ''
      }${selectedId === video.id ? ' bg-amber-50' : ' bg-white'}`}
    >
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm">{video.title}</p>
          {video.isPrivate && (
            <span className="text-xs bg-red-50 text-red-500 px-1.5 py-0.5 rounded">
              private
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">
          {typeLabel[video.type]}
          {video.recommendedBy && <> &middot; rec&apos;d by {video.recommendedBy}</>}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const next = VIDEO_CYCLE[(VIDEO_CYCLE.indexOf(video.status) + 1) % VIDEO_CYCLE.length]
          updateVideo(video.id, { status: next })
        }}
        className={`text-xs px-2 py-0.5 rounded cursor-pointer ${
          video.status === 'watched'
            ? 'bg-green-100 text-green-700'
            : video.status === 'watching'
            ? 'bg-yellow-100 text-yellow-700'
            : video.status === 'dropped'
            ? 'bg-orange-100 text-orange-700'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        {formatStatus(video.status)}
      </button>
    </Link>
  )

  return (
    <div className="md:flex md:gap-0">
      {/* List panel */}
      <div className={`max-w-4xl ${selectedVideo ? 'md:w-[420px] md:shrink-0 md:max-w-none' : 'w-full'}`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-amber-700">Videos</h1>
          <Link
            href="/videos/add"
            className="bg-amber-600 text-white text-sm px-4 py-2 rounded hover:bg-amber-700"
          >
            + Add Video
          </Link>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as VideoType | 'all')}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="all">All Types</option>
            <option value="movie">Movie</option>
            <option value="tv-show">TV Show</option>
            <option value="documentary">Documentary</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as VideoStatus | 'all')}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="queued">Queued</option>
            <option value="watching">Watching</option>
            <option value="watched">Watched</option>
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
            No videos found.{' '}
            <Link href="/videos/add" className="text-amber-600 hover:underline">
              Add one
            </Link>
          </p>
        ) : (
          <div className="space-y-8">
            {sortedCategories.map((category) => {
              const active = grouped[category].filter((v) => v.status !== 'watched' && v.status !== 'dropped')
              const completed = grouped[category].filter((v) => v.status === 'watched' || v.status === 'dropped')
              const isExpanded = showCompleted[category] ?? false

              return (
                <div key={category}>
                  <div className="mb-3">
                    <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full">
                      {category}
                    </span>
                  </div>
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    {active.map((video, i) => renderRow(video, i > 0))}
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
                        {isExpanded && completed.map((video) => renderRow(video, true))}
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
      {selectedVideo && (
        <div className="hidden md:block md:flex-1 md:border-l md:border-gray-200 md:ml-6 md:overflow-y-auto">
          <DetailPanel video={selectedVideo} onClose={() => setSelectedId(null)} />
        </div>
      )}
    </div>
  )
}
