
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Coins, 
  ExternalLink, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { BlockchainData } from '@/types';

interface BlockchainDetailsProps {
  data: BlockchainData;
  showExplorerLink?: boolean;
}

const BlockchainDetails = ({ data, showExplorerLink = true }: BlockchainDetailsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Define risk level based on blockchain data
  const getRiskLevel = () => {
    if (data.rugPullCount > 3 || data.dumpingBehavior === 'high') {
      return { color: 'text-red-500', level: 'High Risk' };
    } else if (data.rugPullCount > 0 || data.dumpingBehavior === 'medium') {
      return { color: 'text-yellow-500', level: 'Medium Risk' };
    }
    return { color: 'text-green-500', level: 'Low Risk' };
  };

  const risk = getRiskLevel();

  return (
    <Card className="crypto-card">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="w-5 h-5" />
            <h3 className="font-semibold">Blockchain Activity</h3>
          </div>
          <div className={`font-medium ${risk.color}`}>{risk.level}</div>
        </div>
        
        {data.address && (
          <div className="bg-muted/50 p-3 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="font-mono text-sm truncate">
                <span className="text-muted-foreground mr-2">Wallet:</span>
                {data.address.substring(0, 8)}...{data.address.substring(36)}
              </div>
              {showExplorerLink && (
                <Button variant="ghost" size="icon" className="shrink-0" onClick={() => window.open(`https://bscscan.com/address/${data.address}`, '_blank')}>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
            <span>Rug Pull Involvement</span>
            <span className="font-mono font-bold">{data.rugPullCount}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
            <span>Dumping Behavior</span>
            <span className="font-mono font-bold capitalize">{data.dumpingBehavior}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
            <span>MEV Activity</span>
            <span className="font-mono font-bold">{data.mevActivity ? "Detected" : "None"}</span>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <span>Show Less</span>
              <ChevronUp className="ml-1 w-4 h-4" />
            </>
          ) : (
            <>
              <span>More Details</span>
              <ChevronDown className="ml-1 w-4 h-4" />
            </>
          )}
        </Button>
        
        {isExpanded && (
          <div className="space-y-4">
            <div className="space-y-3 border-t border-border pt-4">
              <h4 className="font-medium">Activity Analysis</h4>
              <p className="text-sm text-muted-foreground">
                {data.dumpingBehavior === 'high' && (
                  "This influencer consistently sells tokens shortly after promotion, often before significant price drops. This pattern strongly suggests coordinated pump and dump activity."
                )}
                {data.dumpingBehavior === 'medium' && (
                  "This influencer occasionally sells positions after promotion, but doesn't show a consistent pattern of immediate dumping. Some caution is warranted."
                )}
                {data.dumpingBehavior === 'low' && (
                  "This influencer typically maintains positions in promoted tokens for extended periods, suggesting genuine belief in these projects."
                )}
              </p>
              
              {data.mevActivity && (
                <div className="flex items-start p-3 bg-red-900/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 mr-2" />
                  <p className="text-sm">
                    MEV (Maximal Extractable Value) activity detected from this wallet, indicating sophisticated front-running or sandwich attack behaviors.
                  </p>
                </div>
              )}
              
              {data.rugPullCount > 3 && (
                <div className="flex items-start p-3 bg-red-900/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-2" />
                  <p className="text-sm">
                    Significant involvement in multiple rug pulls or failed projects ({data.rugPullCount} incidents). This indicates a concerning pattern of promoting projects that fail or exit scam.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BlockchainDetails;
