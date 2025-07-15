import { useEffect, useState } from 'react';
import { Bell, Plus, Check, ArrowUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Toaster, toast } from './ui/sonner';
import { Skeleton } from './ui/skeleton';
import Feed from './feed';
import useGetUserFeeds from '../hooks/useGetUserFeeds';
import useCreateFeed from '../hooks/useCreateFeed';
import useGetUserInfo from '../hooks/useGetUserInfo';
import useUpdateFeed from '../hooks/useUpdateFeed';
import useGetFeedItems from '../hooks/useGetFeedItems';

const MIN_PROMPT_LENGTH = 20;
const MAX_PROMPT_LENGTH = 500;

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [lastSubmittedText, setLastSubmittedText] = useState('')
  
  const { data: userInfo, isLoading: userLoading } = useGetUserInfo();
  const { data: userFeeds, isLoading: feedsLoading } = useGetUserFeeds();

  const feed = !userFeeds ? null : userFeeds[0];
  const createFeed = useCreateFeed();
  const updateFeed = useUpdateFeed();

  // Get feed items if user has a feed
  const { 
    data: feedItemsData, 
    isLoading: feedItemsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetFeedItems({ 
    feedId: feed?.id || 0 
  });

  useEffect(() => {
    localStorage.setItem('last_accessed_at', new Date().toISOString());
  }, []);

  // Initialize prompt with existing feed's query_prompt if it exists
  useEffect(() => {
    if (feed && !prompt && !lastSubmittedText) {
      setPrompt(feed.query_prompt);
      setLastSubmittedText(feed.query_prompt);
    }
  }, [feed, prompt, lastSubmittedText]);

  const scrollToTop = () => {
    const scrollContainer = document.querySelector('.flex-1.overflow-y-auto') as HTMLElement;
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo?.user_id) return

    try {
      if (feed) {
        await updateFeed.mutateAsync({
          feedId: feed.id,
          query_prompt: prompt
        })
      } else {
        await createFeed.mutateAsync({
          user_id: userInfo.user_id,
          query_prompt: prompt
        })
      }

      toast.success("Feed subscription updated!", {
        description: "Your feed will be updated at 11:59 PM",
        icon: <Check className="h-4 w-4 text-green-500" />,
      });

      setLastSubmittedText(prompt)
    } catch (error) {
      console.error('Error with feed:', error)
      toast.error("Something went wrong", {
        description: "Please try again later",
      })
    }
  }

  // Check if button should be disabled
  const isButtonDisabled = prompt === lastSubmittedText || prompt.trim().length < MIN_PROMPT_LENGTH || !userInfo?.user_id || createFeed.isPending || updateFeed.isPending

  if (userLoading || feedsLoading) {
    return (
      <div className="bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="m-6">
            <CardHeader>
              <Skeleton className="h-8 w-80" />
              <Skeleton className="h-4 w-96 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <div className="flex justify-end">
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Prepare feed data for the Feed component
  const feedData = feedItemsData ? {
    items: feedItemsData.pages.flatMap(page => 
      page.items.map(article => ({
        article
        // No onClick handler - will use default behavior (open detail modal)
      }))
    )
  } : { items: [] };

  return (
    <div className="bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="m-6 select-none">
          <CardHeader>
            <CardTitle>Your Daily Dive into News</CardTitle>
            <CardDescription>
              Tell us what interests you. We'll tailor a personalized news feed and keep it updated daily.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <Textarea
                  id="prompt"
                  placeholder="e.g., Latest developments in renewable energy, AI regulation updates, fintech industry trends..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full min-h-[100px]"
                  maxLength={MAX_PROMPT_LENGTH}
                  required
                />
                <div className="flex justify-end mt-2">
                  <span className={`text-sm ${prompt.length > 450 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {prompt.length}/{MAX_PROMPT_LENGTH}
                  </span>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="gap-2 px-6"
                  disabled={isButtonDisabled}
                >
                  <Bell className="h-4 w-4" />
                  Subscribe
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Render feed if user has a feed */}
        {feed && (
          <div className="mt-11">
            {feedItemsLoading ? (
              <div className="max-w-2xl mx-auto space-y-11">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="w-32 h-18 flex-shrink-0" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-18" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <Feed data={feedData} className="mb-8" />
                
                {/* Load More / End of Feed */}
                <div className="flex justify-center items-center py-8">
                  {hasNextPage ? (
                    <Button 
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      variant="outline"
                      className="gap-2"
                    >
                      {isFetchingNextPage ? (
                        <>Loading more articles...</>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Load More Articles
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <p className="text-sm">You've reached the end of your feed</p>
                      <p className="text-xs mt-1">Check back later for new articles</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
        {/* Scroll to Top Button */}
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      
      <Toaster />
    </div>
  )
} 