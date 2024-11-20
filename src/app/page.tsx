// src/app/page.tsx
'use client';
import { useState } from 'react';
import { BrandInput } from '@/components/BrandInput';
import { ResultsSection } from '@/components/ResultsSection';
import { AnalysisSection } from '@/components/AnalysisSection';
import { KeywordResponse, RedditPost } from '@/types';
import { Search, BarChart2, MessageSquare } from 'lucide-react';

export default function Home() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [subreddits, setSubreddits] = useState<string[]>([]);
  const [matchingPosts, setMatchingPosts] = useState<RedditPost[]>([]);

  const handleInitialAnalysis = async (name: string, description: string) => {
    try {
      const response = await fetch('http://localhost:8000/analyze/initial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });
      const data: KeywordResponse = await response.json();
      setKeywords(data.keywords);
      setSubreddits(data.subreddits);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Reddit Analysis Hub
            </h1>
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2 text-sm text-zinc-600 hover:text-blue-600 transition-colors cursor-pointer">
                <Search className="w-4 h-4" />
                <span>Analyze</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-zinc-600 hover:text-blue-600 transition-colors cursor-pointer">
                <BarChart2 className="w-4 h-4" />
                <span>Track</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-zinc-600 hover:text-blue-600 transition-colors cursor-pointer">
                <MessageSquare className="w-4 h-4" />
                <span>Engage</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:gap-12">
          {/* Features Section */}
          <section className="text-center mb-12 opacity-0 animate-fade-in">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">
              Discover Reddit Insights
            </h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              Analyze brand mentions, track engagement, and generate AI-powered responses
              across Reddit communities.
            </p>
          </section>

          {/* Main Content */}
          <div className="grid gap-8 md:gap-12">
            <div className="opacity-0 animate-slide-up">
              <BrandInput onAnalyze={handleInitialAnalysis} />
            </div>

            {keywords.length > 0 && (
              <div className="opacity-0 animate-slide-up">
                <AnalysisSection
                  keywords={keywords}
                  subreddits={subreddits}
                  onResults={setMatchingPosts}
                />
              </div>
            )}

            {matchingPosts.length > 0 && (
              <div className="opacity-0 animate-slide-up">
                <ResultsSection posts={matchingPosts} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}