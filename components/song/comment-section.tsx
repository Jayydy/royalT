"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/contexts/user-context"
import { MessageSquare, Send, Reply } from "lucide-react"
import type { Comment } from "@/lib/types"

interface CommentSectionProps {
  songId: string
}

export function CommentSection({ songId }: CommentSectionProps) {
   const { user } = useUser()
   const [comments, setComments] = useState<Comment[]>([])
   const [newComment, setNewComment] = useState("")
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [replyingTo, setReplyingTo] = useState<string | null>(null)
   const [replyContent, setReplyContent] = useState("")

  useEffect(() => {
    // Load comments from localStorage
    const storedComments = localStorage.getItem(`comments_${songId}`)
    if (storedComments) {
      setComments(JSON.parse(storedComments))
    }
  }, [songId])

  const getUserProfile = (userId: string) => {
     const userData = localStorage.getItem(`user_${userId}`)
     return userData ? JSON.parse(userData) : null
   }

  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault()
     if (!user || !newComment.trim()) return

     setIsSubmitting(true)
     try {
       const comment: Comment = {
         id: crypto.randomUUID(),
         songId,
         userId: user.id,
         content: newComment,
         createdAt: new Date(),
       }

       const updatedComments = [comment, ...comments]
       setComments(updatedComments)
       localStorage.setItem(`comments_${songId}`, JSON.stringify(updatedComments))
       setNewComment("")
     } catch (error) {
       console.error("[v0] Error posting comment:", error)
     } finally {
       setIsSubmitting(false)
     }
   }

  const handleReply = async (parentCommentId: string) => {
     if (!user || !replyContent.trim()) return

     setIsSubmitting(true)
     try {
       const reply: Comment = {
         id: crypto.randomUUID(),
         songId,
         userId: user.id,
         content: `@${getUserProfile(parentCommentId)?.username || 'user'} ${replyContent}`,
         createdAt: new Date(),
       }

       const updatedComments = [reply, ...comments]
       setComments(updatedComments)
       localStorage.setItem(`comments_${songId}`, JSON.stringify(updatedComments))
       setReplyContent("")
       setReplyingTo(null)
     } catch (error) {
       console.error("[v0] Error posting reply:", error)
     } finally {
       setIsSubmitting(false)
     }
   }

  return (
    <Card className="glass-strong p-6 space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold">Comments ({comments.length})</h3>
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Share your thoughts about this song..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="bg-background/50 resize-none"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !newComment.trim()} className="bg-primary">
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => {
            const userProfile = getUserProfile(comment.userId)
            return (
              <div key={comment.id} className="glass p-4 rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={userProfile?.avatar} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {userProfile?.name?.slice(0, 2).toUpperCase() || comment.userId.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{userProfile?.name || `User ${comment.userId.slice(0, 6)}`}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{comment.content}</p>
                    {user && (
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="h-6 px-2 text-xs"
                        >
                          <Reply className="w-3 h-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    )}
                    {replyingTo === comment.id && user && (
                      <div className="mt-3 space-y-2">
                        <Textarea
                          placeholder={`Reply to ${userProfile?.name || 'user'}...`}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          rows={2}
                          className="bg-background/50 resize-none text-sm"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleReply(comment.id)}
                            disabled={isSubmitting || !replyContent.trim()}
                            className="bg-primary"
                          >
                            <Send className="w-3 h-3 mr-1" />
                            {isSubmitting ? "Posting..." : "Reply"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setReplyingTo(null)
                              setReplyContent("")
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
