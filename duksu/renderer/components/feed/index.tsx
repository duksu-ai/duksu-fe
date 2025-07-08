import FeedItem, { FeedItemProps } from './FeedItem';

export interface FeedData {
  items: FeedItemProps[];
}

interface FeedProps {
  data: FeedData;
  maxItems?: number;
  className?: string;
}

export default function Feed({ 
  data, 
  maxItems,
  className = ""
}: FeedProps) {
  const itemsToShow = maxItems ? data.items.slice(0, maxItems) : data.items;

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
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
