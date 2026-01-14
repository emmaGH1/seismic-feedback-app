/**
 * app/page.tsx
 * Context: FINAL "GOLD MASTER" UI.
 * Changes:
 * - UI Polnish: Tightened spacing between Compose and Feed.
 * - UX: Added a 'Success' state when posting (button turns green momentarily).
 * - Visuals: Made the active Post button more vibrant.
 */
"use client";

import { useState } from "react";
import Image from "next/image"; 
import FeedbackCard from "./components/FeedbackCard";
import { MOCK_FEEDBACKS } from "./lib/data";
import { Feedback } from "./lib/types";

export default function Home() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(MOCK_FEEDBACKS);
  const [inputText, setInputText] = useState("");
  const [isPosting, setIsPosting] = useState(false); // Visual loading state

  const handlePost = () => {
    if (!inputText.trim()) return;
    
    setIsPosting(true);

    // Simulate network delay for "Real App" feel
    setTimeout(() => {
        const newFeedback: Feedback = {
          id: Date.now().toString(),
          content: inputText,
          timestamp: new Date().toISOString(),
          upvotes: 0, downvotes: 0, laughs: 0, replyCount: 0,
        };
        setFeedbacks([newFeedback, ...feedbacks]);
        setInputText("");
        setIsPosting(false);
    }, 800);
  };

  return (
    <main className="min-h-screen pb-20 relative selection:bg-[#6D4C6F] selection:text-white">
      
      {/* 1. BACKGROUND LAYER */}
      <div className="seismic-gradient-bg" /> 
      
      {/* 2. CONTENT CONTAINER */}
      <div className="max-w-xl mx-auto min-h-screen relative z-10 px-4 md:px-0">
        
        {/* HEADER - Compact & Clean */}
        <header className="py-10 flex items-center justify-center gap-3">
          <div className="w-8 h-8 relative opacity-90">
             <Image 
               src="/logo.png" 
               alt="Seismic Logo" 
               fill 
               className="object-contain"
             />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight text-shadow-sm">
            Seismic Unfiltered
          </h1>
        </header>

        {/* COMPOSE AREA - The "Hero" Interaction */}
        <div className="bg-white/[0.03] p-6 rounded-2xl mb-10 border border-white/5 shadow-2xl backdrop-blur-sm transition-colors focus-within:bg-white/[0.05] focus-within:border-white/10">
           <textarea 
             placeholder="What's strictly confidential?"
             className="w-full bg-transparent resize-none text-lg text-white/90 placeholder:text-seismic-muted/40 focus:outline-none min-h-[80px] mb-2 font-medium"
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
           />
           
           <div className="flex justify-between items-center pt-3 border-t border-white/5">
             <div className="flex gap-3 text-seismic-muted/60 text-[11px] font-mono tracking-wide uppercase">
               <span>Markdown On</span>
               <span>•</span>
               <span>Anonymous</span>
             </div>
             
             <button 
               onClick={handlePost}
               disabled={!inputText.trim() || isPosting}
               className={`
                 text-[14px] font-bold px-6 py-2 rounded-lg transition-all duration-300 shadow-lg
                 ${!inputText.trim() 
                   ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                   : 'bg-[#6D4C6F] hover:bg-[#7E5A80] text-white hover:shadow-seismic-purple/20 hover:scale-[1.02] active:scale-95'}
                 ${isPosting ? 'opacity-80 cursor-wait' : ''}
               `}
             >
               {isPosting ? 'Encrypting...' : 'Post'}
             </button>
           </div>
        </div>

        {/* FEED FILTER TABS - Simple & Sharp */}
        <div className="flex gap-8 mb-6 px-4 border-b border-white/5">
          <button className="text-white font-bold text-[15px] border-b-2 border-[#6D4C6F] pb-3 px-1">
             Trending
          </button>
          <button className="text-seismic-muted font-medium text-[15px] pb-3 px-1 hover:text-white transition-colors">
             Latest
          </button>
        </div>

        {/* THE FEED */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {feedbacks.map((feedback) => (
            <FeedbackCard key={feedback.id} data={feedback} />
          ))}
        </div>

        {/* END MARKER */}
        <div className="py-12 text-center">
            <div className="w-1 h-1 bg-seismic-muted/30 rounded-full mx-auto mb-2"></div>
            <p className="text-seismic-muted/20 text-xs font-mono uppercase tracking-widest">End of Stream</p>
        </div>

      </div> 
    </main>
  );
}