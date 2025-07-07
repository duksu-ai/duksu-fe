import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export interface UpdateFeedData {
  feedId: number
  query_prompt: string
  feed_topic?: string
}

export default function useUpdateFeed() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateFeedData): Promise<void> => {
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
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch queries that might be affected
      queryClient.invalidateQueries({ queryKey: ['feeds'] })
      queryClient.invalidateQueries({ queryKey: ['feed', variables.feedId] })
    }
  })
}
