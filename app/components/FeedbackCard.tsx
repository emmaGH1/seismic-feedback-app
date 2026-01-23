"use client";

import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, ThumbsDown, Laugh, Send, Trash2 } from 'lucide-react';

interface Feedback {
  id: string;
  content: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  laughs: number;
  userVotes: string[];
}

interface FeedbackCardProps {
  data: Feedback;
  isAdmin: boolean;
  onToggle: (id: string, type: 'upvotes' | 'downvotes' | 'laughs') => void;
  onDelete: (id: string) => void;
  onShare: (item: Feedback) => void;
}

export default function FeedbackCard({ data, isAdmin, onToggle, onDelete, onShare }: FeedbackCardProps) {
  return (
    <div className="w-full p-5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors relative group">
      {isAdmin && (
        <button 
          onClick={() => onDelete(data.id)} 
          className="absolute top-4 right-4 text-red-500/50 hover:text-red-500 p-2 rounded z-20"
          aria-label="Delete post"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
      
      <div className="flex items-center gap-2 mb-2 text-sm text-seismic-muted">
        <span className="font-bold text-seismic-gray">Anonymous</span>
        <span className="text-[10px] opacity-40">•</span>
        <span className="text-xs font-medium opacity-50">
          {formatDistanceToNow(new Date(data.createdAt), { addSuffix: true })}
        </span>
      </div>

      <div className="mb-4 text-[16px] text-white/90 whitespace-pre-wrap leading-relaxed">
        {data.content}
      </div>
      
      <div className="flex items-center gap-4 text-seismic-muted select-none mt-6">
        {/* Upvotes */}
        <button 
          onClick={() => onToggle(data.id, 'upvotes')} 
          aria-label={`Upvote (${data.upvotes})`}
          aria-pressed={data.userVotes.includes('upvote')}
          className={`flex gap-1.5 transition-all duration-300 items-center px-3 py-1.5 rounded-full border ${data.userVotes.includes('upvote') ? 'border-green-500/50 bg-green-500/10 text-green-400 shadow-[0_0_15px_-4px_rgba(74,222,128,0.5)]' : 'border-transparent hover:bg-white/5 hover:text-green-400'}`}
        >
          <ThumbsUp className={`w-4 h-4 ${data.userVotes.includes('upvote') ? 'fill-green-400' : ''}`} />
          <span className="text-sm font-bold">{data.upvotes}</span>
        </button>

        {/* Laughs */}
        <button 
          onClick={() => onToggle(data.id, 'laughs')} 
          aria-label={`Laugh (${data.laughs})`}
          aria-pressed={data.userVotes.includes('laugh')}
          className={`flex gap-1.5 transition-all duration-300 items-center px-3 py-1.5 rounded-full border ${data.userVotes.includes('laugh') ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300 shadow-[0_0_15px_-4px_rgba(234,179,8,0.5)]' : 'border-transparent hover:bg-white/5 hover:text-yellow-300'}`}
        >
          <Laugh className="w-4 h-4" />
          <span className="text-sm font-bold">{data.laughs}</span>
        </button>

        {/* Downvotes */}
        <button 
          onClick={() => onToggle(data.id, 'downvotes')} 
          aria-label={`Downvote (${data.downvotes})`}
          aria-pressed={data.userVotes.includes('downvote')}
          className={`flex gap-1.5 transition-all duration-300 items-center px-3 py-1.5 rounded-full border ${data.userVotes.includes('downvote') ? 'border-red-500/50 bg-red-500/10 text-red-400 shadow-[0_0_15px_-4px_rgba(248,113,113,0.5)]' : 'border-transparent hover:bg-white/5 hover:text-red-400'}`}
        >
          <ThumbsDown className={`w-4 h-4 ${data.userVotes.includes('downvote') ? 'fill-red-400' : ''}`} />
          <span className="text-sm font-bold">{data.downvotes}</span>
        </button>

        <div className="flex-1"></div> 

        {/* Share */}
        <button 
          onClick={() => onShare(data)} 
          aria-label="Share post"
          className="flex gap-1.5 text-seismic-muted/60 hover:text-purple-400 transition-colors group items-center px-2 py-1"
        >
          <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity mr-2">Share</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}