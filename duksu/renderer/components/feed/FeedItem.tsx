import { Card, CardContent } from '../ui/card';

type NewsArticle = {
  title: string;
  source: string;
  url: string;
  thumbnail_url: string;
  summary: string;
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
      className={`hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          <h5 className="font-semibold text-xl leading-tight">
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
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {article.summary}
          </p>
          
          {article.keywords && (
            <div className="flex flex-wrap gap-2">
              {article.keywords.slice(0, 5).map((keyword, idx) => (
                <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
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