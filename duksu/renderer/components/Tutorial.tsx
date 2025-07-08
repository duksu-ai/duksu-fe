import { useState } from 'react';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import Feed, { FeedData } from './feed';
import curatedArticles from '../static/example_news_articles.json';

interface TutorialProps {
  onComplete: () => void;
}

export default function Tutorial({ onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleComplete = () => {
    onComplete();
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  // Transform curated articles data to match FeedData structure
  const feedData: FeedData = {
    feed_topic: curatedArticles.feed_topic,
    items: curatedArticles.items.slice(0, 4).map((article) => ({
      article: {
        title: article.title,
        source: article.source,
        url: article.url,
        thumbnail_url: article.thumbnail_url,
        summary: article.summary,
        keywords: article.keywords,
        published_at: article.published_at
      }
    }))
  };

  const steps = [
    (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">AI-Curated News</h3>
        <p className="text-muted-foreground">
          Get the most relevant news articles tailored to your specific interests and queries.
        </p>
      </div>
    ),
    (
      <div className="space-y-6 pt-8">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Example Query</h4>
          <p className="text-sm text-muted-foreground italic">
            "{curatedArticles.feed_query_prompt}"
          </p>
        </div>
        <div className="grid gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium">1</span>
            </div>
            <div>
              <h5 className="font-medium">Describe Your Interest</h5>
              <p className="text-sm text-muted-foreground">Tell us what kind of news you want to stay updated on</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium">2</span>
            </div>
            <div>
              <h5 className="font-medium">AI Curates Content</h5>
              <p className="text-sm text-muted-foreground">Our AI finds and summarizes relevant articles</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium">3</span>
            </div>
            <div>
              <h5 className="font-medium">Stay Informed</h5>
              <p className="text-sm text-muted-foreground">Get your personalized news feed updated regularly</p>
            </div>
          </div>
        </div>
      </div>
    ),
    (
      <div className="space-y-6 py-8">
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="font-medium text-sm">Your Query:</span>
          </div>
          <p className="text-sm text-muted-foreground italic">
            "{curatedArticles.feed_query_prompt}"
          </p>
        </div>
        
        <Feed 
          data={feedData}
          showTitle={true}
        />
      </div>
    )
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-background p-6 pb-20">
      <div className="max-w-3xl mx-auto">
        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main content */}
        <Card className="mb-8">
          <CardContent>
            {currentStepData}
          </CardContent>
        </Card>
      </div>

      {/* Fixed Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-6">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {currentStep + 1} of {steps.length}
          </div>
          <Button onClick={handleNext} className="gap-2">
            {currentStep < steps.length - 1 ? (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              'Get Started'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 