
const ApiIntegrationGuide = () => {
  return (
    <div className="bg-muted/30 p-4 rounded-md mt-6">
      <h3 className="font-medium mb-2 flex items-center">
        <img 
          src="/lovable-uploads/cdb1d1dd-f192-4146-a926-a4904db9dd15.png" 
          alt="Web3D Logo" 
          className="w-5 h-5 mr-2" 
        />
        API Integration Guide
      </h3>
      <p className="text-sm text-muted-foreground">
        To use real data for influencer analysis, you need to connect to external APIs that provide:
      </p>
      <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground space-y-1">
        <li>Social media metrics (followers, engagement rates) from Twitter/X, Instagram, and Telegram</li>
        <li>Blockchain transaction data (wallet addresses, token movements)</li>
        <li>Risk assessment algorithms</li>
      </ul>
      <p className="text-sm text-muted-foreground mt-2">
        Recommended API providers: 
      </p>
      <ul className="list-disc pl-5 mt-1 text-sm text-muted-foreground space-y-1">
        <li>Blockchain: Moralis, Alchemy, Etherscan</li>
        <li>Social Media: Twitter/X API, Instagram Graph API, Telegram Bot API</li>
        <li>AI Analysis: OpenAI, specialized crypto influencer analysis platforms</li>
      </ul>
    </div>
  );
};

export default ApiIntegrationGuide;
