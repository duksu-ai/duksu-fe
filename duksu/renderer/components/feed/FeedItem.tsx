import { Card, CardContent } from '../ui/card';
import { Sparkles } from 'lucide-react';
import FeedItemDetail from './FeedItemDetail';
import { useEffect, useState } from 'react';
import { localStorage } from '../../lib/localStorage';

type NewsArticle = {
  title: string;
  source: string;
  url: string;
  thumbnail_url: string | null;
  summary: string | null;
  summary_short: string | null;
  keywords: string[];
  published_at: number;
}

export interface FeedItemProps {
  article: NewsArticle;
  onClick?: (article: NewsArticle) => void;
}

export default function FeedItem({ article, onClick }: FeedItemProps) {
  const [isRead, setIsRead] = useState(false);
  
  // Create a unique key for the article
  const articleKey = `read_${article.title}_${article.published_at}`;

  useEffect(() => {
    // Check if article has been read
    const readStatus = localStorage.getItem(articleKey);
    setIsRead(readStatus === 'true');
  }, [articleKey]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleClick = () => {
    // Mark article as read
    localStorage.setItem(articleKey, 'true');
    setIsRead(true);
    
    if (onClick) {
      onClick(article);
    }
  };

  return (
    <FeedItemDetail article={article}>
      <Card 
        className={`hover:shadow-md transition-shadow relative group cursor-pointer ${
          isRead ? 'bg-gray-100/60 border-gray-300' : ''
        }`}
        onClick={handleClick}
      >
        {onClick && (
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
        )}
        <CardContent className="p-4 relative">
          <div className="flex flex-col space-y-3">
            {/* Title and Thumbnail Row */}
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <h5 className={`font-medium text-xl leading-tight ${
                  isRead ? 'text-gray-700' : ''
                }`}>
                  {article.title}
                </h5>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{article.source}</span>
                  <span>•</span>
                  <span>{formatDate(article.published_at)}</span>
                  {isRead && (
                    <>
                      <span>•</span>
                      <span className="text-gray-600 text-xs">Read</span>
                    </>
                  )}
                </div>
              </div>
              {article.thumbnail_url && (
                <div className="w-32 h-18 flex-shrink-0">
                  <img 
                    src={article.thumbnail_url} 
                    alt={article.title}
                    className={`w-full h-full object-cover rounded-lg ${
                      isRead ? 'opacity-60' : ''
                    }`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* Summary */}
            {article.summary_short && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 text-primary`} />
                  <span className={`font-medium text-sm`}>Summary</span>
                </div>
                <p className={`text-md leading-relaxed`}>
                  {article.summary_short}
                </p>
              </div>
            )}
            
            {/* Keywords */}
            {article.keywords && article.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.keywords.slice(0, 5).map((keyword, idx) => (
                  <span key={idx} className={`px-3 py-1 text-sm rounded-full ${
                    isRead 
                      ? 'bg-gray-200/80 text-gray-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </FeedItemDetail>
  );
} 