import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from 'lucide-react';

const fetchTopStories = async () => {
  const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
  const storyIds = await response.json();
  const top100Ids = storyIds.slice(0, 100);
  
  const storyPromises = top100Ids.map(id =>
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
  );
  
  return Promise.all(storyPromises);
};

const StoryCard = ({ story }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="text-lg font-medium">{story.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-500">Upvotes: {story.score}</p>
      <a
        href={story.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline inline-flex items-center mt-2"
      >
        Read more <ExternalLink className="ml-1 h-4 w-4" />
      </a>
    </CardContent>
  </Card>
);

const SkeletonCard = () => (
  <Card className="mb-4">
    <CardHeader>
      <Skeleton className="h-4 w-3/4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-1/4 mb-2" />
      <Skeleton className="h-4 w-1/3" />
    </CardContent>
  </Card>
);

const HackerNewsTopStories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: stories, isLoading, error } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories
  });

  const filteredStories = stories?.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <div>Error fetching stories: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Hacker News Top 100 Stories</h1>
      <Input
        type="text"
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
      />
      {isLoading ? (
        Array(10).fill().map((_, index) => <SkeletonCard key={index} />)
      ) : (
        filteredStories?.map(story => (
          <StoryCard key={story.id} story={story} />
        ))
      )}
    </div>
  );
};

export default HackerNewsTopStories;