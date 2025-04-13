
import { Input } from '@/components/ui/input';
import { Twitter } from 'lucide-react';

interface TwitterApiTabProps {
  twitterConfig: {
    bearerToken: string;
    accessToken: string;
    accessTokenSecret: string;
    apiKeySecret: string;
  };
  setTwitterConfig: React.Dispatch<React.SetStateAction<{
    bearerToken: string;
    accessToken: string;
    accessTokenSecret: string;
    apiKeySecret: string;
  }>>;
}

const TwitterApiTab = ({ twitterConfig, setTwitterConfig }: TwitterApiTabProps) => {
  return (
    <>
      <div className="flex items-center space-x-2 mb-2">
        <Twitter className="w-5 h-5 text-primary" />
        <h3 className="font-medium">Twitter/X API Configuration</h3>
      </div>
      
      <div>
        <label className="text-sm font-medium mb-1 block">Bearer Token</label>
        <Input 
          type="password"
          value={twitterConfig.bearerToken} 
          onChange={(e) => setTwitterConfig({...twitterConfig, bearerToken: e.target.value})}
          placeholder="Bearer token for Twitter API"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium mb-1 block">Access Token</label>
        <Input 
          type="password"
          value={twitterConfig.accessToken} 
          onChange={(e) => setTwitterConfig({...twitterConfig, accessToken: e.target.value})}
          placeholder="Access token"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium mb-1 block">Access Token Secret</label>
        <Input 
          type="password"
          value={twitterConfig.accessTokenSecret} 
          onChange={(e) => setTwitterConfig({...twitterConfig, accessTokenSecret: e.target.value})}
          placeholder="Access token secret"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium mb-1 block">API Key Secret</label>
        <Input 
          type="password"
          value={twitterConfig.apiKeySecret} 
          onChange={(e) => setTwitterConfig({...twitterConfig, apiKeySecret: e.target.value})}
          placeholder="API key secret"
        />
      </div>
    </>
  );
};

export default TwitterApiTab;
