import { Card, CardContent } from '../ui/card';

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
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleClick = () => {
    if (onClick) {
      onClick(article);
    }
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow relative group cursor-pointer"
      onClick={handleClick}
    >
      {onClick && (
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
      )}
      <CardContent className="p-4 relative">
        <div className="flex flex-col space-y-3">
          <h5 className="font-medium text-xl leading-tight">
            {article.title}
          </h5>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{article.source}</span>
            <span>•</span>
            <span>{formatDate(article.published_at)}</span>
          </div>
          
          {article.thumbnail_url && (
            <div className="w-full">
              <img 
                src={article.thumbnail_url} 
                alt={article.title}
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          {article.summary_short && (
            <p className="text-md leading-relaxed py-3">
              {article.summary_short}
            </p>
          )}
          
          {article.keywords && article.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.keywords.slice(0, 5).map((keyword, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 