import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Sparkles, Copy, Save, Activity, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnostics, setDiagnostics] = useState<any>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkHealth();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const checkHealth = async () => {
    try {
      const supabaseUrl = (supabase as any).supabaseUrl;
      const supabaseKey = (supabase as any).supabaseKey;
      
      const response = await fetch(
        `${supabaseUrl}/functions/v1/ai-chat`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
          },
        }
      );
      const data = await response.json();
      if (data) setDiagnostics(data);
      console.log('Health check:', data);
    } catch (error) {
      console.error('Health check failed:', error);
      setDiagnostics({ ok: false, error: 'Connection failed' });
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      console.log('📤 Sending to ai-chat:', userMsg.content);
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { messages: [...messages, userMsg] },
      });

      console.log('📥 Raw response:', data);
      console.log('❌ Supabase error:', error);

      if (error) {
        throw new Error(error.message || 'Failed to invoke function');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      let aiContent = '';
      if (data?.content) {
        aiContent = data.content;
      } else if (typeof data === 'string') {
        aiContent = data;
      } else if (data?.message) {
        aiContent = data.message;
      } else {
        console.error('Unexpected response format:', data);
        throw new Error('Invalid response format from AI');
      }

      console.log('✅ AI Response:', aiContent.substring(0, 100));
      
      const assistantMsg = { role: 'assistant' as const, content: aiContent };
      setMessages(prev => [...prev, assistantMsg]);

      toast({ title: 'Response received', description: 'AI has replied to your message' });

    } catch (error: any) {
      console.error('💥 Error:', error);
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to get AI response', 
        variant: 'destructive' 
      });
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast({ title: 'Chat cleared', description: 'Starting fresh conversation' });
  };

  const showPromptCard = (prompt: any) => {
    toast({
      title: prompt.title,
      description: (
        <div className="space-y-2">
          <p className="text-xs">{prompt.description}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(prompt.body)}>
              <Copy className="w-3 h-3 mr-1" />Copy
            </Button>
            <Button size="sm" onClick={() => savePrompt(prompt)}>
              <Save className="w-3 h-3 mr-1" />Save
            </Button>
          </div>
        </div>
      ),
    });
  };

  const savePrompt = async (prompt: any) => {
    await supabase.from('custom_prompts').insert({ user_id: user?.id, ...prompt });
    toast({ title: 'Saved!', description: 'Prompt saved to My Custom Prompts' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Prompt copied to clipboard' });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="border-b border-blue-200 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/prompts')}
                className="mr-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-yellow-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Prompt Port AI</h1>
                <p className="text-xs text-blue-600">Create custom AI prompts</p>
              </div>
            </div>
            <div className="flex gap-2">
              {messages.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearChat} className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-yellow-500 flex items-center justify-center shadow-xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-yellow-600 bg-clip-text text-transparent">
                Welcome to Prompt Port AI
              </h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                I'm here to help you create powerful, effective AI prompts. Ask me anything or try one of these:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {[
                  { icon: '✍️', text: 'Help me write a prompt for content creation', prompt: 'I need help creating a prompt for generating blog posts about technology' },
                  { icon: '🎨', text: 'Create an image generation prompt', prompt: 'Help me write a detailed prompt for generating AI art' },
                  { icon: '💼', text: 'Business email writing assistant', prompt: 'I want to create a prompt for writing professional business emails' },
                  { icon: '🔍', text: 'Data analysis prompt', prompt: 'Help me create a prompt for analyzing and summarizing data' },
                ].map((suggestion, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="h-auto p-4 text-left justify-start bg-white hover:bg-blue-50 hover:border-blue-400 border-blue-200 transition-all"
                    onClick={() => {
                      setInput(suggestion.prompt);
                    }}
                  >
                    <span className="text-2xl mr-3">{suggestion.icon}</span>
                    <span className="text-sm text-slate-700">{suggestion.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="relative group max-w-[80%]">
                <Card className={`p-4 ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg border-blue-600' 
                    : 'bg-white shadow-md border-blue-100'
                }`}>
                  <p className={`whitespace-pre-wrap text-sm leading-relaxed ${msg.role === 'assistant' ? 'text-slate-700' : ''}`}>{msg.content}</p>
                </Card>
                {msg.role === 'assistant' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -bottom-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => copyToClipboard(msg.content)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <Card className="p-4 bg-white shadow-md border-blue-100">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              </Card>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-blue-200 bg-white/90 backdrop-blur-sm p-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
          />
          <Button onClick={sendMessage} disabled={loading} size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
