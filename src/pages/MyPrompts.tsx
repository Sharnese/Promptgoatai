import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CustomPrompt {
  id: string;
  title: string;
  description: string;
  body: string;
  created_at: string;
}

export default function MyPrompts() {
  const { toast } = useToast();
  const [prompts, setPrompts] = useState<CustomPrompt[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    const { data } = await supabase
      .from('custom_prompts')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPrompts(data);
  };

  const copyPrompt = (body: string) => {
    navigator.clipboard.writeText(body);
    toast({ title: 'Copied', description: 'Prompt copied to clipboard' });
  };

  const deletePrompt = async () => {
    if (!deleteId) return;
    
    const { error } = await supabase
      .from('custom_prompts')
      .delete()
      .eq('id', deleteId);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Prompt deleted successfully' });
      loadPrompts();
    }
    setDeleteId(null);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Custom Prompts</h1>
      
      {prompts.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No custom prompts yet. Start a chat to create your first prompt!
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <Card key={prompt.id} className="p-6 flex flex-col">
              <h3 className="font-bold text-lg mb-2">{prompt.title}</h3>
              {prompt.description && (
                <p className="text-sm text-muted-foreground mb-4">{prompt.description}</p>
              )}
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto mb-4 flex-1">
                {prompt.body}
              </pre>
              <div className="flex gap-2">
                <Button
                  onClick={() => copyPrompt(prompt.body)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  onClick={() => setDeleteId(prompt.id)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Prompt</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this prompt? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deletePrompt}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
