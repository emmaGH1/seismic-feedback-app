
export interface Feedback {
  id: string,
  content: string,
  timestamp: string,
  upvotes: number,
  downvotes: number,
  laughs: number,
  replyCount:number,
}

export interface Reply {
    id: string,
    feedbackId: string,
    content: string,
    timestamp: string
}

