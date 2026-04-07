'use client'

import { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppContext, formatStatus, CONTENT_CYCLE } from '@/context/AppContext'
import StatusTimeline from '@/components/StatusTimeline'

export default function ContentDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { contentItems, deleteContentItem, updateContentItem } = useAppContext()

  const item = contentItems.find((i) => i.id === id)

  if (!item) {
    return (
      <div>
        <p className="text-gray-400">Content not found.</p>
        <Link href="/content" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
          Back to content
        </Link>
      </div>
    )
  }

  const handleDelete = () => {
    deleteContentItem(id)
    router.push('/content')
  }

  const cycleStatus = () => {
    const next = CONTENT_CYCLE[(CONTENT_CYCLE.indexOf(item.status) + 1) % CONTENT_CYCLE.length]
    updateContentItem(id, { status: next })
  }

  return (
    <div className="max-w-lg">
      <Link href="/content" className="text-sm text-gray-500 hover:underline">
        &larr; Back to content
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-2">{item.title}</h1>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{item.type}</span>
        {item.category && (
          <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">{item.category}</span>
        )}
        {item.isPrivate && (
          <span className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded">private</span>
        )}
        <button
          onClick={cycleStatus}
          className={`text-xs px-2 py-1 rounded cursor-pointer ${
            item.status === 'done'
              ? 'bg-green-100 text-green-700'
              : item.status === 'in-progress'
              ? 'bg-yellow-100 text-yellow-700'
              : item.status === 'dropped'
              ? 'bg-orange-100 text-orange-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {formatStatus(item.status)}
        </button>
        <span className="text-xs text-gray-400">{item.priority} priority</span>
      </div>

      {item.yearCompleted && (
        <p className="text-sm text-gray-500 mb-4">Completed in {item.yearCompleted}</p>
      )}

      {item.url && (
        <p className="text-sm mb-4">
          <span className="text-gray-500">URL: </span>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {item.url}
          </a>
        </p>
      )}

      {item.coverImage && (
        <div className="mb-6">
          <img src={item.coverImage} alt={item.title} className="max-h-64 rounded" />
        </div>
      )}

      {item.notes && (
        <div className="mb-6">
          <h2 className="text-sm font-medium mb-1">Notes</h2>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{item.notes}</p>
        </div>
      )}

      <StatusTimeline history={item.statusHistory} />

      <p className="text-xs text-gray-400 mb-6">
        Added {new Date(item.dateAdded).toLocaleDateString()}
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
