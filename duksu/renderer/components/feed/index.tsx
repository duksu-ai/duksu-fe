import FeedItem, { FeedItemProps } from './FeedItem';

export interface FeedData {
  feed_name: string;
  items: FeedItemProps[];
}

interface FeedProps {
  data: FeedData;
  showTitle?: boolean;
  maxItems?: number;
  className?: string;
}

export default function Feed({ 
  data, 
  showTitle = true, 
  maxItems,
  className = ""
}: FeedProps) {
  const itemsToShow = maxItems ? data.items.slice(0, maxItems) : data.items;

  return (
    <div className={`max-w-2xl mx-auto space-y-8 ${className}`}>
      {showTitle && (
        <div className="text-center">
          <h2 className="text-2xl font-bold">{data.feed_name}</h2>
        </div>
      )}
      
      <div className="space-y-14">
        {itemsToShow.map((itemProps) => (
          <FeedItem 
            key={itemProps.article.title}
            article={itemProps.article}
            onClick={itemProps.onClick}
          />
        ))}
      </div>
    </div>
  );
}
