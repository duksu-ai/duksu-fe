import { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { Send, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import useGetUserFeeds from '../hooks/useGetUserFeeds';
import useCreateFeed from '../hooks/useCreateFeed';
import useGetUserInfo from '../hooks/useGetUserInfo';

const examplePrompts = [
  "Give me a summary of this week's multifamily housing news",
  "What are some recent trends in media coverage of the aerospace industry?",
  "Show me the latest developments in renewable energy policy",
  "What's happening in the fintech space this month?",
  "Give me updates on artificial intelligence regulation",
  "What are the recent trends in remote work policies?"
]

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [topic, setTopic] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  
  const { data: userInfo, isLoading: userLoading } = useGetUserInfo();
  const { data: feeds, isLoading: feedsLoading, refetch: refetchFeeds } = useGetUserFeeds();

  const createFeedMutation = useCreateFeed();

  localStorage.setItem('last_accessed_at', new Date().toISOString());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInfo?.user_id) return
    if (!prompt.trim() || !topic.trim()) return

    try {
      await createFeedMutation.mutateAsync({
        user_id: userInfo?.user_id,
        query_prompt: prompt.trim(),
        feed_name: topic.trim()
      })
      
      setPrompt('')
      setTopic('')
      setIsCreating(false)
      refetchFeeds()
    } catch (error) {
      console.error('Error creating feed:', error)
    }
  }

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt)
    // Extract a topic from the prompt (simple heuristic)
    const topicMatch = examplePrompt.match(/(?:about|of|in|on)\s+(.+?)(?:\s+news|\s+industry|\s+space|\s+policy|$)/i)
    if (topicMatch) {
      setTopic(topicMatch[1].trim())
    }
  }

  if (userLoading || feedsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  const hasFeeds = feeds && feeds.length > 0

  return (
    <div className="bg-background p-6">
      <div className="max-w-4xl mx-auto">

        {/* Existing Feeds */}
        {hasFeeds && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your News Feeds</h2>
              <Button
                onClick={() => setIsCreating(true)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Feed
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {feeds.map((feed) => (
                <Card key={feed.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{feed.feed_name}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {feed.query_prompt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(feed.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Create New Feed Form */}
        {(!hasFeeds || isCreating) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Your News Feed
              </CardTitle>
              <CardDescription>
                Tell us what kind of news you're interested in, and we'll curate a personalized feed for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium mb-2">
                    Feed Topic
                  </label>
                  <Input
                    id="topic"
                    placeholder="e.g., Technology, Healthcare, Finance"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                    Describe what you want to know
                  </label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe the type of news and information you're interested in..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={!prompt.trim() || !topic.trim() || createFeedMutation.isPending}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {createFeedMutation.isPending ? 'Creating...' : 'Create Feed'}
                  </Button>
                  
                  {isCreating && hasFeeds && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreating(false)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Example Prompts */}
        {(!hasFeeds || isCreating) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need inspiration?</CardTitle>
              <CardDescription>
                Click on any of these example prompts to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2">
                {examplePrompts.map((example, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="justify-start text-left h-auto p-3 whitespace-normal"
                    onClick={() => handleExampleClick(example)}
                  >
                    <span className="text-sm">{example}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 