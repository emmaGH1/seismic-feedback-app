
"use client";

import { Feedback } from "../lib/types";

// Clean, minimalist SVGs for the 4 reactions
const Icons = {
  like: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M14.6 8H21a2 2 0 0 1 2 2v2.104a2 2 0 0 1-.15.762l-3.095 7.515a1 1 0 0 1-.925.619H2a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h3.482a1 1 0 0 0 .817-.423L11.752.85a.633.633 0 0 1 1.114.217l1.65 6.377a.633.633 0 0 0 .084.556Z"/></svg>
  ),
  dislike: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M9.4 16H3a2 2 0 0 1-2-2v-2.104a2 2 0 0 1 .15-.762L4.245 3.62A1 1 0 0 1 5.17 3H19a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-3.482a1 1 0 0 0-.817.423l-5.453 6.726a.633.633 0 0 1-1.114-.217l-1.65-6.377a.633.633 0 0 0-.084-.556Z"/></svg>
  ),
  laugh: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM9 9.75a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0Zm4.5 0a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0Zm-5.337 4.814a.75.75 0 0 1 1.126.91 5.27 5.27 0 0 0 5.422 0 .75.75 0 0 1 1.126.91 6.77 6.77 0 0 1-7.674 0Z" clipRule="evenodd" /></svg>
  ),
  reply: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.562 2.632 6.19l.575.58-.061 2.33a2.625 2.625 0 0 0 2.413 3.536ZM12 11.25a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5h-2.25a.75.75 0 0 1-.75-.75Zm-3.75 0a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75V11.25Z" clipRule="evenodd" /></svg>
  )
};

interface FeedbackCardProps {
  data: Feedback;
}

export default function FeedbackCard({ data }: FeedbackCardProps) {
  // Simple formatter
  const timeAgo = "2h ago"; 

  return (
    // A clean, minimal block. No borders, just subtle background separation.
    <div className="w-full p-5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer mb-4">
      
      {/* Header: Anonymous + Time */}
      <div className="flex items-center gap-2 mb-2 text-sm">
        <span className="font-bold text-seismic-gray">
          Anonymous
        </span>
        <span className="text-seismic-muted">·</span>
        <span className="text-seismic-muted">
          {timeAgo}
        </span>
      </div>

      {/* Content: Large, readable text */}
      <div className="mb-4 text-[16px] text-white/90 whitespace-pre-wrap leading-relaxed font-normal">
        {data.content}
      </div>

      {/* Action Bar: The 4 requested reactions */}
      {/* Used specific hover colors for each action */}
      <div className="flex items-center gap-6 text-seismic-muted">
        
        {/* Like */}
        <button className="flex items-center gap-1.5 hover:text-green-400 transition-colors group">
          {Icons.like}
          <span className="text-sm font-medium">{data.upvotes}</span>
        </button>

        {/* Dislike */}
        <button className="flex items-center gap-1.5 hover:text-red-400 transition-colors group">
          {Icons.dislike}
          <span className="text-sm font-medium">{data.downvotes}</span>
        </button>

        {/* Laugh */}
        <button className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors group">
          {Icons.laugh}
          <span className="text-sm font-medium">{data.laughs}</span>
        </button>

         {/* Reply */}
         <button className="flex items-center gap-1.5 hover:text-seismic-purple-light transition-colors group ml-auto">
          {Icons.reply}
          <span className="text-sm font-medium">{data.replyCount}</span>
        </button>

      </div>
    </div>
  );
}