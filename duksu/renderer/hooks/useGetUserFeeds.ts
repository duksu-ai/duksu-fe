import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import useGetUserInfo from './useGetUserInfo'

export interface NewsFeed {
  id: number
  user_id: string
  query_prompt: string
  feed_topic: string
  created_at: string
  updated_at: string | null
}

export default function useGetUserFeeds() {
  const { data: userInfo } = useGetUserInfo();

  return useQuery({
    queryKey: ['feeds', userInfo?.user_id],
    queryFn: async (): Promise<NewsFeed[]> => {
      const { data, error: supabaseError } = await supabase
        .from('news_feeds')
        .select('*')
        .eq('user_id', userInfo?.user_id)
        .order('created_at', { ascending: false })

      if (supabaseError) {
        throw supabaseError
      }

      return data || []
    },
    enabled: !!userInfo, // Only run query if userId is provided
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  })
} 