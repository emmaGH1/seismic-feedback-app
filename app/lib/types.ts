
export interface Feedback {
  id: string,
  content: string,
  timestamp: string,
  upvotes: number,
  downvotes: number,
  laughs: number,
  replyCount:number,
  tags: string[]
}

export interface Reply {
    id: string,
    feedbackId: string,
    content: string,
    timestamp: string
}

