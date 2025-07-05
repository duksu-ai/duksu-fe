import { useState } from 'react'
import { supabase } from '../lib/supabase'

export interface UpdateFeedData {
  feedId: number
  query_prompt: string
  feed_topic?: string
}

export interface UseUpdateFeedResult {
  updateFeed: (data: UpdateFeedData) => Promise<boolean>
  loading: boolean
  error: string | null
}

export default function useUpdateFeed(): UseUpdateFeedResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateFeed = async (data: UpdateFeedData): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      
      const updateData: any = {
        query_prompt: data.query_prompt,
        updated_at: new Date().toISOString()
      }

      if (data.feed_topic) {
        updateData.feed_topic = data.feed_topic
      }

      const { error: supabaseError } = await supabase
        .from('news_feeds')
        .update(updateData)
        .eq('id', data.feedId)

      if (supabaseError) {
        throw supabaseError
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    updateFeed,
    loading,
    error
  }
}
