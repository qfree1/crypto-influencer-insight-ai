
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { saveOpenAiConfig } from '@/services/keyManagementService';

interface OpenAiTabProps {
  openAiConfig: {
    apiKey: string;
    model: string;
  };
  setOpenAiConfig: React.Dispatch<React.SetStateAction<{
    apiKey: string;
    model: string;
  }>>;
}

const OpenAiTab = ({ openAiConfig, setOpenAiConfig }: OpenAiTabProps) => {
  const [testingOpenAI, setTestingOpenAI] = useState(false);
  
  const testOpenAIConnection = async () => {
    setTestingOpenAI(true);
    try {
      // Save the configuration first
      saveOpenAiConfig(openAiConfig);
      
      // Test OpenAI connection with a simple request
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiConfig.apiKey}`
        },
        body: JSON.stringify({
          model: openAiConfig.model || 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'Say "Connection successful" if you can read this message.' }],
          max_tokens: 20
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Unknown error occurred');
      }
      
      const data = await response.json();
      const message = data.choices[0]?.message?.content || '';
      
      if (message.includes('Connection successful')) {
        toast({
          title: "OpenAI Connection Successful",
          description: "Your API key is working correctly!",
        });
      } else {
        toast({
          title: "Connection Test Complete",
          description: "API responded but with unexpected content",
        });
      }
    } catch (error) {
      console.error('OpenAI test error:', error);
      toast({
        title: "OpenAI Connection Failed",
        description: error instanceof Error ? error.message : "Invalid API key or network error",
        variant: "destructive",
      });
    } finally {
      setTestingOpenAI(false);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2 mb-2">
        <Bot className="w-5 h-5 text-primary" />
        <h3 className="font-medium">OpenAI Configuration</h3>
      </div>
      
      <div className="bg-amber-100 border border-amber-300 p-3 rounded-md dark:bg-amber-950 dark:border-amber-800">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>Important:</strong> An OpenAI API key is required to generate real AI-powered analyses. Without this, the app will fall back to basic templated responses.
        </p>
      </div>
      
      <div>
        <label className="text-sm font-medium mb-1 block">OpenAI API Key</label>
        <Input 
          type="password"
          value={openAiConfig.apiKey} 
          onChange={(e) => setOpenAiConfig({...openAiConfig, apiKey: e.target.value})}
          placeholder="Enter OpenAI API key"
        />
        <p className="text-sm text-muted-foreground mt-1">
          API key for accessing OpenAI services
        </p>
      </div>
      
      <div>
        <label className="text-sm font-medium mb-1 block">Model</label>
        <Input 
          value={openAiConfig.model} 
          onChange={(e) => setOpenAiConfig({...openAiConfig, model: e.target.value})}
          placeholder="OpenAI model name (e.g. gpt-4o-mini)"
        />
        <p className="text-sm text-muted-foreground mt-1">
          The OpenAI model to use for analysis
        </p>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button 
          variant="outline" 
          onClick={testOpenAIConnection}
          disabled={!openAiConfig.apiKey || testingOpenAI}
          className="flex items-center space-x-2"
        >
          {testingOpenAI ? "Testing..." : "Test Connection"}
        </Button>
      </div>
    </>
  );
};

export default OpenAiTab;
