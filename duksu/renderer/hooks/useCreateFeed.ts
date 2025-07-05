import { useState } from 'react'
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

export interface UseCreateFeedResult {
  createFeed: (data: CreateFeedData) => Promise<NewsFeed | null>
  loading: boolean
  error: string | null
}

export default function useCreateFeed(): UseCreateFeedResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createFeed = async (data: CreateFeedData): Promise<NewsFeed | null> => {
    try {
      setLoading(true)
      setError(null)
      
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    createFeed,
    loading,
    error
  }
}
