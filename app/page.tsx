/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image"; 
import { formatDistanceToNow } from 'date-fns';
import { toPng } from 'html-to-image';
import { getFeedbacks, createFeedback, toggleReaction, deleteFeedback } from "./lib/actions";
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

const Toast = ({ show }: { show: boolean }) => (
  <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 transform ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
    <div className="bg-[#6D4C6F] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
      <span className="text-xl">🚀</span>
      <span className="font-medium">Sent to the void.</span>
    </div>
  </div>
);

function FeedbackContent() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [inputText, setInputText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const searchParams = useSearchParams();
  const secretKey = process.env.NEXT_PUBLIC_ADMIN_SECRET || "";
  const isAdmin = searchParams.get("admin") === secretKey;

  useEffect(() => {
    const init = async () => {
      const data = await getFeedbacks();
      setFeedbacks(data);
    };
    init();
  }, []);

  const handlePost = async () => {
    if (!inputText.trim()) return;
    setIsPosting(true);

    const result = await createFeedback(inputText);
    
    if (result.success) {
      setInputText("");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      const newData = await getFeedbacks();
      setFeedbacks(newData);
    }
    
    setIsPosting(false);
  };

  // --- VOTE LOGIC (MUTUAL EXCLUSION KEPT) ---
  const handleToggle = async (id: string, type: 'upvotes' | 'downvotes' | 'laughs') => {
    const singularMap: Record<string, string> = { upvotes: 'upvote', downvotes: 'downvote', laughs: 'laugh' };
    const voteTag = singularMap[type];

    const targetPost = feedbacks.find(f => f.id === id);
    let conflictType: 'upvotes' | 'downvotes' | null = null;

    if (targetPost) {
        if (type === 'upvotes' && targetPost.userVotes.includes('downvote')) {
            conflictType = 'downvotes';
        }
        if (type === 'downvotes' && targetPost.userVotes.includes('upvote')) {
            conflictType = 'upvotes';
        }
    }

    setFeedbacks(current => 
      current.map(f => {
        if (f.id !== id) return f;
        
        const hasVoted = f.userVotes.includes(voteTag);
        let newVotes = [...f.userVotes];
        let newUpvotes = f.upvotes;
        let newDownvotes = f.downvotes;
        let newLaughs = f.laughs;

        if (hasVoted) {
            newVotes = newVotes.filter(v => v !== voteTag);
            if (type === 'upvotes') newUpvotes--;
            if (type === 'downvotes') newDownvotes--;
            if (type === 'laughs') newLaughs--;
        } else {
            newVotes.push(voteTag);
            if (type === 'upvotes') newUpvotes++;
            if (type === 'downvotes') newDownvotes++;
            if (type === 'laughs') newLaughs++;
            
            if (conflictType === 'downvotes') {
                newVotes = newVotes.filter(v => v !== 'downvote');
                newDownvotes--;
            }
            if (conflictType === 'upvotes') {
                newVotes = newVotes.filter(v => v !== 'upvote');
                newUpvotes--;
            }
        }

        return {
          ...f,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          laughs: newLaughs,
          userVotes: newVotes
        };
      })
    );

    await toggleReaction(id, type);

    if (conflictType) {
        await toggleReaction(id, conflictType);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Nuke this post?")) return;
    setFeedbacks(current => current.filter(f => f.id !== id));
    await deleteFeedback(id, secretKey);
  };

  // --- SIMPLIFIED SCREENSHOT LOGIC ---
  const handleShare = async (id: string) => {
    const node = document.getElementById(`card-${id}`);
    
    if (node) {
      try {
        const dataUrl = await toPng(node, {
          // No complex width/height forcing - just let it capture the card as is
          backgroundColor: undefined, 
          style: {
            // Add the nice background frame
            backgroundImage: 'linear-gradient(135deg, #0F0514 0%, #3D2242 100%)',
            padding: '60px',
            borderRadius: '0px', 
            // Ensure Flexbox centers it in the image
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          beforeClone: (domNode: any) => {
             if (domNode instanceof HTMLElement) {
               // Just make the card look solid so it pops against the gradient
               domNode.style.backgroundColor = '#1A0B1F'; 
               domNode.style.borderRadius = '16px';
               domNode.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.6)';
               
               // Hide buttons we don't need in the image
               const shareBtn = domNode.querySelector('.share-btn');
               if (shareBtn) (shareBtn as HTMLElement).style.display = 'none';
               
               const adminBtn = domNode.querySelector('.admin-btn');
               if (adminBtn) (adminBtn as HTMLElement).style.display = 'none';
             }
          }
        } as any);
        
        const link = document.createElement('a');
        link.download = `seismic-secret-${id.slice(0, 5)}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to generate image', err);
      }
    }
  };

  return (
      <div className="max-w-xl mx-auto min-h-screen relative z-10 px-4 md:px-0">
        <Toast show={showToast} />
        <header className="py-10 flex items-center justify-center gap-3">
          <div className="w-8 h-8 relative opacity-90">
             <Image src="/seismic-logo.png" alt="Seismic Logo" fill className="object-contain"/>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight text-shadow-sm">
            Seismic Unfiltered
          </h1>
        </header>

        <div className="bg-white/[0.03] p-6 rounded-2xl mb-10 border border-white/5 shadow-2xl backdrop-blur-sm">
           <textarea 
             placeholder="What's strictly confidential?"
             className="w-full bg-transparent resize-none text-lg text-white/90 placeholder:text-seismic-muted/40 focus:outline-none min-h-[80px] mb-2 font-medium"
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
           />
           <div className="flex justify-between items-center pt-3 border-t border-white/5">
             <div className="flex gap-3 text-seismic-muted/60 text-[11px] font-mono tracking-wide uppercase">
               <span>Markdown On</span>
             </div>
             <button 
               onClick={handlePost}
               disabled={!inputText.trim() || isPosting}
               className={`text-[14px] font-bold px-6 py-2 rounded-lg transition-all duration-300 shadow-lg ${!inputText.trim() ? 'bg-white/5 text-white/20' : 'bg-[#6D4C6F] hover:bg-[#7E5A80] text-white'}`}
             >
               {isPosting ? 'Encrypting...' : 'Post'}
             </button>
           </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-4">
          {feedbacks.map((item) => (
             <div 
               key={item.id} 
               id={`card-${item.id}`} 
               className="w-full p-5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors relative group"
             >
                
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="admin-btn absolute top-4 right-4 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 p-2 rounded transition-all z-20"
                    title="Delete Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="flex items-center gap-2 mb-2 text-sm text-seismic-muted">
                  <span className="font-bold text-seismic-gray">Anonymous</span>
                  <span className="text-[10px] opacity-40">•</span>
                  <span className="text-xs font-medium opacity-50">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </span>
                </div>

                <div className="mb-4 text-[16px] text-white/90 whitespace-pre-wrap leading-relaxed">
                  {item.content}
                </div>

                <div className="flex items-center gap-4 text-seismic-muted select-none mt-6">
                  
                  {/* UPVOTE */}
                  <button 
                    onClick={() => handleToggle(item.id, 'upvotes')} 
                    className={`flex gap-1.5 transition-all duration-300 items-center px-3 py-1.5 rounded-full border
                      ${item.userVotes.includes('upvote') 
                        ? 'border-green-500/50 bg-green-500/10 text-green-400 shadow-[0_0_15px_-4px_rgba(74,222,128,0.5)]' 
                        : 'border-transparent hover:bg-white/5 hover:text-green-400'}
                    `}
                  >
                    <ThumbsUp className={`w-4 h-4 ${item.userVotes.includes('upvote') ? 'fill-green-400' : ''}`} />
                    <span className="text-sm font-bold">{item.upvotes}</span>
                  </button>

                  {/* LAUGH - FIXED: REMOVED FILL PROPERTY */}
                  <button 
                    onClick={() => handleToggle(item.id, 'laughs')} 
                    className={`flex gap-1.5 transition-all duration-300 items-center px-3 py-1.5 rounded-full border
                      ${item.userVotes.includes('laugh') 
                        ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300 shadow-[0_0_15px_-4px_rgba(234,179,8,0.5)]' 
                        : 'border-transparent hover:bg-white/5 hover:text-yellow-300'}
                    `}
                  >
                    {/* Only class w-4 h-4. No fill-yellow-300. This fixes the blob. */}
                    <Laugh className="w-4 h-4" />
                    <span className="text-sm font-bold">{item.laughs}</span>
                  </button>

                  {/* DOWNVOTE */}
                  <button 
                    onClick={() => handleToggle(item.id, 'downvotes')} 
                    className={`flex gap-1.5 transition-all duration-300 items-center px-3 py-1.5 rounded-full border
                      ${item.userVotes.includes('downvote') 
                        ? 'border-red-500/50 bg-red-500/10 text-red-400 shadow-[0_0_15px_-4px_rgba(248,113,113,0.5)]' 
                        : 'border-transparent hover:bg-white/5 hover:text-red-400'}
                    `}
                  >
                    <ThumbsDown className={`w-4 h-4 ${item.userVotes.includes('downvote') ? 'fill-red-400' : ''}`} />
                    <span className="text-sm font-bold">{item.downvotes}</span>
                  </button>

                  <div className="flex-1"></div> 

                  {/* SHARE BUTTON */}
                  <button 
                    onClick={() => handleShare(item.id)}
                    className="share-btn flex gap-1.5 text-seismic-muted/60 hover:text-purple-400 transition-colors group items-center px-2 py-1"
                    title="Share as Image"
                  >
                    <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity mr-2">Share</span>
                    <Send className="w-4 h-4" />
                  </button>

                </div>
             </div>
          ))}
        </div>
      </div> 
  );
}

export default function Home() {
  return (
    <main className="min-h-screen pb-20 relative selection:bg-[#6D4C6F] selection:text-white">
      <div className="seismic-gradient-bg" /> 
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white/50">Loading Secure Channel...</div>}>
        <FeedbackContent />
      </Suspense>
    </main>
  );
}