'use client'

import { Feedback } from "../lib/types"

const ICONS = {
  upvote: "👍",
  downvote: "👎",
  laugh: "😂",
  reply: "💬"
}

interface FeedbackCardProps {
    data: Feedback,
}

const FeedbackCard = ({ data }: FeedbackCardProps) => {
  const {id, content, timestamp, upvotes, downvotes, laughs, replyCount} = data

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }

  return (
    <div className="w-full p-6 mb-4 rounded-xl bg-seismic-dark border border-seismic-dark hover:border-seismic-purple/30 transition-all duration-300 group">
        
        {/* header */}
        <div className="flex justify-between items-center mb-3">
           <span className="text-xs font-sans text-seismic-muted uppercase tracking-wider">
              Anonymous • {timeAgo(timestamp)}
           </span>
        </div>

        {/* content */}
        <div className="mb-6">
            <p className="text-seismic-gray text-lg font-sans leading-relaxed">
                {content}
            </p>
        </div>

        {/* footer: reactions & reply */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          
          <div className="flex gap-4">
            <button className="flex items-center gap-2 text-sm text-seismic-muted hover::text-white transition-colors"
            onClick={() => console.log('Upvote', data.id)}
            >
             <span>{ICONS.upvote}</span>
             <span className="font-serif font-medium">
                {upvotes}
             </span>
            </button>

            <button className="flex items-center gap-2 text-sm text-seismic-muted hover:text-seismic-purple-ligh transition-colors"
            onClick={() => console.log('laugh', id)}
            >
             <span>{ICONS.laugh}</span>
             <span className="font-serif font-medium">{laughs}</span>
            </button>

            <button className="flex items-center gap-2 text-sm text-seismic-muted hover:text-red-400 transition-colors"
            onClick={() => console.log('Downvote', id)}
            >
             <span>{ICONS.downvote}</span>
             <span className="font-serif font-medium">{downvotes}</span>
            </button>
          </div>

          <button className="flex items-center gap-2 text-sm text-seismic-purple-light hover:text-white transition-colors">
            {ICONS.reply}
            <span className="font-medium">{replyCount} Replies</span>
          </button>

        </div>
    </div>
  )
}

export default FeedbackCard