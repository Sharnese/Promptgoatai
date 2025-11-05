import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FreePromptCardProps {
  promptText: string;
  category: string;
}

export function FreePromptCard({ promptText, category }: FreePromptCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy prompt",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all h-full flex flex-col">
      <CardHeader className="flex-grow">
        <CardDescription className="text-xs font-medium text-primary mb-2">
          {category}
        </CardDescription>
        <CardTitle className="text-sm leading-relaxed font-normal">
          {promptText}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          onClick={handleCopy} 
          variant="outline" 
          size="sm" 
          className="w-full"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Prompt
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
