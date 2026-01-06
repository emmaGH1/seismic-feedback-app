import { Feedback } from "./types"

export const MOCK_FEEDBACKS: Feedback[] = [
{
    id: "1",
    content: "The new staking UI is confusing. I couldn't find the unstake button for 5 minutes.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    upvotes: 12,
    downvotes: 2,
    laughs: 0,
    replyCount: 3,
  },
  {
    id: "2",
    content: "Whoever designed the dark mode, you dropped this 👑.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    upvotes: 45,
    downvotes: 0,
    laughs: 5,
    replyCount: 1,
  }
]