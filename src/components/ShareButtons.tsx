
import { Button } from '@/components/ui/button';
import { Share2, Twitter, Linkedin, Copy } from 'lucide-react';
import { RiskReport } from '@/types';
import { toast } from '@/hooks/use-toast';

interface ShareButtonsProps {
  report: RiskReport;
}

const ShareButtons = ({ report }: ShareButtonsProps) => {
  const { influencerData, riskScore } = report;

  // Create share message
  const createShareMessage = () => {
    let riskLevel = 'Low';
    if (riskScore >= 70) riskLevel = 'High';
    else if (riskScore >= 30) riskLevel = 'Medium';

    return `I just analyzed @${influencerData.handle} with Crypto Influencer Insight AI and found a ${riskLevel} Risk Score of ${riskScore}/100. Check your favorite crypto influencers before following their advice!`;
  };

  // Share functions
  const shareOnTwitter = () => {
    const message = createShareMessage();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    const message = createShareMessage();
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = () => {
    const message = createShareMessage();
    navigator.clipboard.writeText(message).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Share text has been copied to your clipboard",
      });
    });
  };

  return (
    <div className="crypto-card p-6 space-y-4">
      <div className="flex items-center space-x-2">
        <Share2 className="w-5 h-5" />
        <h3 className="font-semibold">Share This Analysis</h3>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" className="flex items-center space-x-2" onClick={shareOnTwitter}>
          <Twitter className="w-4 h-4" />
          <span>Twitter</span>
        </Button>
        
        <Button variant="outline" className="flex items-center space-x-2" onClick={shareOnLinkedIn}>
          <Linkedin className="w-4 h-4" />
          <span>LinkedIn</span>
        </Button>
        
        <Button variant="outline" className="flex items-center space-x-2" onClick={copyToClipboard}>
          <Copy className="w-4 h-4" />
          <span>Copy Text</span>
        </Button>
      </div>
    </div>
  );
};

export default ShareButtons;
