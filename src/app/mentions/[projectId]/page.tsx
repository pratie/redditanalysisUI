'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, ArrowUpRight, Calendar, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RedditPost {
  formatted_date: string;
  subreddit: string;
  post_id: string;
  title: string;
  content: string;
  url: string;
  matching_keywords: string[];
  generated_reply: string | null;
  relevance_score: number;
}

export default function MentionsPage({ params }: { params: { projectId: string } }) {
  const [mentions, setMentions] = useState<RedditPost[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedMentions = localStorage.getItem(`mentions-${params.projectId}`);
    if (storedMentions) {
      const data = JSON.parse(storedMentions);
      setMentions(data.matching_posts);
    }
  }, [params.projectId]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-gray-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <h1 className="text-2xl font-bold">Mentions</h1>
        </div>

        <div className="space-y-4">
          {mentions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No mentions found for this project.</p>
            </div>
          ) : (
            mentions.map((post) => (
              <Card key={post.post_id} className="p-6">
                <div className="space-y-4">
                  {/* Top row with subreddit, keywords, and metadata */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          r/{post.subreddit}
                        </Badge>
                        <div className="flex gap-1">
                          {post.matching_keywords.map((keyword) => (
                            <Badge
                              key={keyword}
                              variant="secondary"
                              className="bg-orange-50 text-orange-700"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {/* Date and relevance score row */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {post.formatted_date}
                        </div>
                        <div className="flex items-center">
                          <Target className="h-4 w-4 mr-1" />
                          <span className={`font-medium ${
                            post.relevance_score >= 80 ? 'text-green-600' :
                            post.relevance_score >= 50 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            Relevance: {post.relevance_score}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>

                  <h3 className="font-medium">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-orange-600 transition-colors"
                    >
                      {post.title}
                    </a>
                  </h3>

                  {post.content && (
                    <p className="text-sm text-gray-600">{post.content}</p>
                  )}

                  {post.generated_reply && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-sm font-medium">Generated Reply</span>
                      </div>
                      <p className="text-sm">{post.generated_reply}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}