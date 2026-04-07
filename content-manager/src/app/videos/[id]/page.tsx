'use client'

import { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppContext, formatStatus, VIDEO_CYCLE } from '@/context/AppContext'
import StatusTimeline from '@/components/StatusTimeline'

const typeLabel: Record<string, string> = {
  'movie': 'Movie',
  'tv-show': 'TV Show',
  'documentary': 'Documentary',
}

export default function VideoDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { videos, deleteVideo, updateVideo } = useAppContext()

  const video = videos.find((v) => v.id === id)

  if (!video) {
    return (
      <div>
        <p className="text-gray-400">Video not found.</p>
        <Link href="/videos" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
          Back to videos
        </Link>
      </div>
    )
  }

  const handleDelete = () => {
    deleteVideo(id)
    router.push('/videos')
  }

  const cycleStatus = () => {
    const next = VIDEO_CYCLE[(VIDEO_CYCLE.indexOf(video.status) + 1) % VIDEO_CYCLE.length]
    updateVideo(id, { status: next })
  }

  return (
    <div className="max-w-lg">
      <Link href="/videos" className="text-sm text-gray-500 hover:underline">
        &larr; Back to videos
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-1">{video.title}</h1>
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

      <button
        onClick={handleDelete}
        className="text-sm text-red-600 hover:underline"
      >
        Delete
      </button>
    </div>
  )
}
