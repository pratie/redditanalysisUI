// src/components/ProjectCard.tsx
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  subreddits: string[];
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleViewMentions = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching mentions for:', {
        keywords: project.keywords,
        subreddits: project.subreddits
      });

      const response = await fetch('http://localhost:8000/analyze/reddit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          keywords: project.keywords,
          subreddits: project.subreddits,
          post_limit: 20
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error('Failed to fetch mentions');
      }

      const data = await response.json();
      console.log('Received data:', data);

      if (!data || !data.matching_posts) {
        throw new Error('Invalid response format from server');
      }

      // Store the mentions data
      localStorage.setItem(`mentions-${project.id}`, JSON.stringify(data));
      
      // Navigate to mentions page
      router.push(`/mentions/${project.id}`);

    } catch (error) {
      console.error('Error fetching mentions:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch mentions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-gray-100 shadow-md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">{project.name}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm text-gray-500 mb-2">Description</h4>
            <p className="text-sm">{project.description}</p>
          </div>

          <div>
            <h4 className="text-sm text-gray-500 mb-2">Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {project.keywords.slice(0, 3).map((keyword) => (
                <Badge
                  key={keyword}
                  className="bg-orange-50 text-orange-700 hover:bg-orange-100"
                >
                  {keyword}
                </Badge>
              ))}
              {project.keywords.length > 3 && (
                <Badge variant="outline">
                  +{project.keywords.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 mb-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <Button
            variant="outline"
            className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
            onClick={handleViewMentions}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Reddit Posts... (This may take a minute)
              </>
            ) : (
              'View Mentions'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}