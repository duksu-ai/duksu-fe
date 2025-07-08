import { useInfiniteQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export interface NewsArticle {
  title: string
  author: string | null
  url: string
  published_at: number
  source: string
  raw_html_path: string | null
  content_markdown_path: string | null
  thumbnail_url: string | null
  summary: string | null
  summary_short: string | null
  keywords: string[]
}

export interface FeedItemsPage {
  feedId: number
  items: NewsArticle[]
  nextCursor: number | null
  hasMore: boolean
}

export interface UseGetFeedItemsParams {
  feedId: number
  pageSize?: number
}

export default function useGetFeedItems({ feedId, pageSize = 5 }: UseGetFeedItemsParams) {
  return useInfiniteQuery({
    queryKey: ['feedItems', feedId],
    queryFn: async ({ pageParam = 0 }): Promise<FeedItemsPage> => {
      const from = pageParam * pageSize
      const to = from + pageSize - 1

      const { data, error, count } = await supabase
        .from('news_feed_items')
        .select(`
          *,
          news_articles (*)
        `, { count: 'exact' })
        .eq('news_feed_id', feedId)
        .order('created_at', { ascending: false })
        .order('id', { ascending: true })
        .range(from, to)

      if (error) {
        throw error
      }

      const totalCount = count || 0
      const hasMore = to < totalCount - 1
      const nextCursor = hasMore ? pageParam + 1 : null

      const articles = (data || []).map(item => {
        const article = item.news_articles;
        return {
          ...article,
          keywords: article.keywords ? (() => {
            try {
              return JSON.parse(article.keywords);
            } catch {
              return [];
            }
          })() : []
        };
      });

      return {
        feedId,
        items: articles,
        nextCursor,
        hasMore
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!feedId, // Only run query if feedId is provided
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  })
} 