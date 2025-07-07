import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export interface NewsFeed {
  id: number
  user_id: string
  query_prompt: string
  feed_topic: string
  created_at: string
  updated_at: string | null
}

export interface CreateFeedData {
  user_id: string
  query_prompt: string
  feed_topic: string
}

export default function useCreateFeed() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateFeedData): Promise<NewsFeed> => {
      const { data: feedData, error: supabaseError } = await supabase
        .from('news_feeds')
        .insert([{
          user_id: data.user_id,
          query_prompt: data.query_prompt,
          feed_topic: data.feed_topic
        }])
        .select()
        .single()

      if (supabaseError) {
        throw supabaseError
      }

      return feedData
    },
    onSuccess: () => {
      // Invalidate and refetch any queries that might be affected
      queryClient.invalidateQueries({ queryKey: ['feeds'] })
    }
  })
}
