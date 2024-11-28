// src/components/CreateProjectDialog.tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (project: {
    name: string;
    description: string;
    keywords: string[];
    subreddits: string[];
  }) => void;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  onCreateProject,
}: CreateProjectDialogProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    keywords: [] as string[],
    subreddits: [] as string[],
  });

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/analyze/initial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to analyze project');
      }
      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        keywords: data.keywords,
        subreddits: data.subreddits,
      }));
      setStep(2);
    } catch (error) {
      toast.error('Failed to analyze project. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    onCreateProject(formData);
    setStep(1);
    setFormData({
      name: '',
      description: '',
      keywords: [],
      subreddits: [],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="flex justify-between items-center p-6 pb-2">
          <DialogTitle className="text-xl font-semibold">
            Create New Project
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {step === 1 ? (
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name</label>
              <Input
                placeholder="Enter project name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe your project..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                className="min-h-[120px] rounded-lg"
              />
            </div>

            <Button
              className="w-full bg-[#ff4500] hover:bg-[#ff4500]/90 text-white"
              onClick={handleAnalyze}
              disabled={loading || !formData.name || !formData.description}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze & Continue
            </Button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Generated Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="bg-[#ff4500]/10 text-[#ff4500] hover:bg-[#ff4500]/20"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Target Subreddits</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.subreddits.map((subreddit) => (
                    <Badge
                      key={subreddit}
                      variant="outline"
                      className="border-[#ff4500]/20 text-[#ff4500] hover:bg-[#ff4500]/10"
                    >
                      r/{subreddit}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Back to Edit
              </Button>
              <Button
                onClick={handleCreate}
                className="flex-1 bg-[#ff4500] hover:bg-[#ff4500]/90 text-white"
              >
                Create Project
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}