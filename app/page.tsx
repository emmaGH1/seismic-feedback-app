"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image"; 
import { formatDistanceToNow } from 'date-fns'
import { toPng } from 'html-to-image';
import { getFeedbacks, createFeedback, toggleReaction, deleteFeedback } from "./lib/actions";

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

// --- MAIN LOGIC COMPONENT (Wrapped below) ---
function FeedbackContent() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [inputText, setInputText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // 1. Get the admin secret safely
  const searchParams = useSearchParams();
  // We use "|| ''" to handle the TypeScript undefined error safely
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

  const handleToggle = async (id: string, type: 'upvotes' | 'downvotes' | 'laughs') => {
    const singularMap: Record<string, string> = { upvotes: 'upvote', downvotes: 'downvote', laughs: 'laugh' };
    const voteTag = singularMap[type];

    setFeedbacks(current => 
      current.map(f => {
        if (f.id !== id) return f;
        const hasVoted = f.userVotes.includes(voteTag);
        return {
          ...f,
          [type]: hasVoted ? f[type] - 1 : f[type] + 1,
          userVotes: hasVoted 
            ? f.userVotes.filter(v => v !== voteTag) 
            : [...f.userVotes, voteTag]
        };
      })
    );

    await toggleReaction(id, type);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Nuke this post?")) return;
    setFeedbacks(current => current.filter(f => f.id !== id));
    // Pass the secret from the URL or env to the server action
    await deleteFeedback(id, secretKey);
  };

  const handleShare = async (id: string) => {
    const node = document.getElementById(`card-${id}`);
    
    if (node) {
      try {
        const dataUrl = await toPng(node, {
          backgroundColor: '#000', // Force black background for the image
          style: {
            padding: '40px',
            borderRadius: '0px',
          }
        });
        
        // Trigger download
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
             <Image src="/logo.png" alt="Seismic Logo" fill className="object-contain"/>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight text-shadow-sm">
            Seismic Unfiltered
          </h1>
        </header>

        <div className="bg-white/[0.03] p-6 rounded-2xl mb-10 border border-white/5 shadow-2xl backdrop-blur-sm">
           <textarea 
             placeholder="What's on your mind?"
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
             <div key={item.id} id={`card-${item.id}`} className="w-full p-5 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-colors relative group">
                
                {/* ADMIN BUTTON */}
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-4 right-4 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 p-2 rounded transition-all z-20"
                    title="Delete Post"
                  >
                    🗑️
                  </button>
                )}

                <div className="flex items-center gap-2 mb-2 text-sm text-seismic-muted">
                  <span className="font-bold text-seismic-gray">Anonymous</span>
                  
                  {/* The Separator Dot */}
                  <span className="text-[10px] opacity-40">•</span>
                  
                  {/* The Timestamp */}
                  <span className="text-xs font-medium opacity-50">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="mb-4 text-[16px] text-white/90 whitespace-pre-wrap leading-relaxed">
                  {item.content}
                </div>
                <div className="flex items-center gap-6 text-seismic-muted select-none">
                  <button 
                    onClick={() => handleToggle(item.id, 'upvotes')} 
                    className={`flex gap-1.5 transition-all duration-200 group items-center px-2 py-1 rounded-md
                      ${item.userVotes.includes('upvote') ? 'text-green-400 bg-green-400/10' : 'hover:text-green-400 hover:bg-white/5'}
                    `}
                  >
                    <span className="group-hover:scale-110 transition-transform">👍</span> 
                    <span className="text-sm font-medium">{item.upvotes}</span>
                  </button>
                  <button 
                    onClick={() => handleToggle(item.id, 'laughs')} 
                    className={`flex gap-1.5 transition-all duration-200 group items-center px-2 py-1 rounded-md
                      ${item.userVotes.includes('laugh') ? 'text-yellow-400 bg-yellow-400/10' : 'hover:text-yellow-400 hover:bg-white/5'}
                    `}
                  >
                    <span className="group-hover:scale-110 transition-transform">😂</span> 
                    <span className="text-sm font-medium">{item.laughs}</span>
                  </button>
                  <button 
                    onClick={() => handleToggle(item.id, 'downvotes')} 
                    className={`flex gap-1.5 transition-all duration-200 group items-center px-2 py-1 rounded-md
                      ${item.userVotes.includes('downvote') ? 'text-red-400 bg-red-400/10' : 'hover:text-red-400 hover:bg-white/5'}
                    `}
                  >
                    <span className="group-hover:scale-110 transition-transform">👎</span> 
                    <span className="text-sm font-medium">{item.downvotes}</span>
                  </button>

                  <div className="flex-1"></div> {/* Spacer to push share to the right */}                  
                  <button 
                    onClick={() => handleShare(item.id)}
                    className="flex gap-1.5 hover:text-purple-400 transition-colors group items-center"
                    title="Share as Image"
                  >
                    <span className="group-hover:scale-110 transition-transform">📸</span>
                  </button>
                </div>
             </div>
          ))}
          
        </div>
      </div> 
  );
}
// --- THE DEFAULT EXPORT (The Safety Wrapper) ---
export default function Home() {
  return (
    <main className="min-h-screen pb-20 relative selection:bg-[#6D4C6F] selection:text-white">
      <div className="seismic-gradient-bg" /> 
      
      {/* This Suspense block handles the "useSearchParams" error */}
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white/50">Loading Secure Channel...</div>}>
        <FeedbackContent />
      </Suspense>
    </main>
  );
}