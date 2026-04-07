'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAppContext, ContentType, ContentStatus, ContentItem, formatStatus, CONTENT_CYCLE } from '@/context/AppContext'
import StatusTimeline from '@/components/StatusTimeline'

const STATUS_ORDER: Record<string, number> = {
  'in-progress': 0,
  'queued': 1,
  'done': 2,
  'dropped': 3,
}

function DetailPanel({ item, onClose }: { item: ContentItem; onClose: () => void }) {
  const { updateContentItem, deleteContentItem } = useAppContext()

  const cycleStatus = () => {
    const next = CONTENT_CYCLE[(CONTENT_CYCLE.indexOf(item.status) + 1) % CONTENT_CYCLE.length]
    updateContentItem(item.id, { status: next })
  }

  const handleDelete = () => {
    deleteContentItem(item.id)
    onClose()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onClose} className="text-sm text-gray-500 hover:underline cursor-pointer">&larr; Close</button>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg">&times;</button>
      </div>

      <h1 className="text-2xl font-bold mt-2 mb-2">{item.title}</h1>

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
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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

      <button onClick={handleDelete} className="text-sm text-red-600 hover:underline">
        Delete
      </button>
    </div>
  )
}

export default function ContentList() {
  const { contentItems, updateContentItem } = useAppContext()
  const [filterType, setFilterType] = useState<ContentType | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<ContentStatus | 'all'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showCompleted, setShowCompleted] = useState<Record<string, boolean>>({})
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const categories = Array.from(new Set(contentItems.map((i) => i.category).filter(Boolean)))

  const filtered = contentItems.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false
    if (filterStatus !== 'all' && item.status !== filterStatus) return false
    if (filterCategory !== 'all' && item.category !== filterCategory) return false
    return true
  })

  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, item) => {
    const cat = item.category || 'Uncategorized'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  for (const cat of Object.keys(grouped)) {
    grouped[cat].sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9))
  }

  const sortedCategories = Object.keys(grouped).sort()
  const selectedItem = selectedId ? contentItems.find((i) => i.id === selectedId) : null

  const renderRow = (item: typeof contentItems[0], hasBorder: boolean) => (
    <Link
      key={item.id}
      href={`/content/${item.id}`}
      onClick={(e) => {
        if (window.innerWidth >= 768) {
          e.preventDefault()
          setSelectedId(item.id)
        }
      }}
      className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50${
        hasBorder ? ' border-t border-gray-100' : ''
      }${selectedId === item.id ? ' bg-blue-50' : ' bg-white'}`}
    >
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm">{item.title}</p>
          {item.isPrivate && (
            <span className="text-xs bg-red-50 text-red-500 px-1.5 py-0.5 rounded">
              private
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">
          {item.type} &middot; {item.priority} priority
        </p>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const next = CONTENT_CYCLE[(CONTENT_CYCLE.indexOf(item.status) + 1) % CONTENT_CYCLE.length]
          updateContentItem(item.id, { status: next })
        }}
        className={`text-xs px-2 py-0.5 rounded cursor-pointer ${
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
    </Link>
  )

  return (
    <div className="md:flex md:gap-0">
      {/* List panel */}
      <div className={`max-w-4xl ${selectedItem ? 'md:w-[420px] md:shrink-0 md:max-w-none' : 'w-full'}`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Content</h1>
          <Link
            href="/content/add"
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Content
          </Link>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ContentType | 'all')}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="all">All Types</option>
            <option value="article">Article</option>
            <option value="video">Video</option>
            <option value="paper">Paper</option>
            <option value="blog">Blog</option>
            <option value="news">News</option>
            <option value="other">Other</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ContentStatus | 'all')}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="queued">Queued</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
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
            No content found.{' '}
            <Link href="/content/add" className="text-blue-600 hover:underline">
              Add something
            </Link>
          </p>
        ) : (
          <div className="space-y-8">
            {sortedCategories.map((category) => {
              const active = grouped[category].filter((i) => i.status !== 'done' && i.status !== 'dropped')
              const completed = grouped[category].filter((i) => i.status === 'done' || i.status === 'dropped')
              const isExpanded = showCompleted[category] ?? false

              return (
                <div key={category}>
                  <div className="mb-3">
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full">
                      {category}
                    </span>
                  </div>
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    {active.map((item, i) => renderRow(item, i > 0))}
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
                        {isExpanded && completed.map((item) => renderRow(item, true))}
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
      {selectedItem && (
        <div className="hidden md:block md:flex-1 md:border-l md:border-gray-200 md:ml-6 md:overflow-y-auto">
          <DetailPanel item={selectedItem} onClose={() => setSelectedId(null)} />
        </div>
      )}
    </div>
  )
}
