'use client'

import { formatStatus, StatusChange } from '@/context/AppContext'

const STATUS_COLORS: Record<string, { bg: string; border: string }> = {
  'queued': { bg: 'bg-gray-200', border: 'border-gray-300' },
  'want-to-read': { bg: 'bg-gray-200', border: 'border-gray-300' },
  'in-progress': { bg: 'bg-yellow-400', border: 'border-yellow-500' },
  'reading': { bg: 'bg-yellow-400', border: 'border-yellow-500' },
  'watching': { bg: 'bg-yellow-400', border: 'border-yellow-500' },
  'done': { bg: 'bg-green-400', border: 'border-green-500' },
  'finished': { bg: 'bg-green-400', border: 'border-green-500' },
  'watched': { bg: 'bg-green-400', border: 'border-green-500' },
  'dropped': { bg: 'bg-orange-400', border: 'border-orange-500' },
}

export default function StatusTimeline({ history }: { history: StatusChange[] }) {
  if (!history || history.length === 0) return null

  return (
    <div className="mb-6">
      <h2 className="text-sm font-medium mb-3">Timeline</h2>
      <div className="flex flex-col">
        {history.map((entry, i) => {
          const colors = STATUS_COLORS[entry.status] ?? { bg: 'bg-gray-200', border: 'border-gray-300' }
          const isLast = i === history.length - 1
          return (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${colors.bg} ${colors.border}`} />
                {!isLast && (
                  <div className="w-0 flex-1 border-l-2 border-dashed border-gray-300 my-1" />
                )}
              </div>
              <div className={isLast ? '' : 'pb-4'}>
                <p className="text-xs font-medium text-gray-700 leading-none">{formatStatus(entry.status)}</p>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(entry.date).toLocaleDateString()}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
