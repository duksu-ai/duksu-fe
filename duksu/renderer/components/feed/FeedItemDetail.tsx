import { Sparkles, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
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

interface FeedItemDetailProps {
  article: NewsArticle;
  children: React.ReactNode;
}

export default function FeedItemDetail({ article, children }: FeedItemDetailProps) {
  // Create a unique key for the article
  const articleKey = `read_${article.title}_${article.published_at}`;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleVisitWebsite = () => {
    (window as any).ShellAPI.openExternal(article.url);
  };

  const handleDialogOpen = () => {
    // Mark article as read when dialog opens
    localStorage.setItem(articleKey, 'true');
  };

  return (
    <Dialog onOpenChange={(open) => open && handleDialogOpen()}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Article Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Title and Thumbnail Row */}
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <h2 className="font-medium text-2xl leading-tight">
                {article.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{article.source}</span>
                <span>•</span>
                <span>{formatDate(article.published_at)}</span>
              </div>
            </div>
            {article.thumbnail_url && (
              <div className="w-32 h-18 flex-shrink-0">
                <img 
                  src={article.thumbnail_url} 
                  alt={article.title}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Summary Section */}
          {article.summary && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Summary</span>
              </div>
              <p className="text-base leading-relaxed text-foreground">
                {article.summary}
              </p>
            </div>
          )}

          {/* Visit Website Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleVisitWebsite} className="gap-2">
              Visit Website
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 