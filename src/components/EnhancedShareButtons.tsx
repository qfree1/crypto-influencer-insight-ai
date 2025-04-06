
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Share2, 
  Twitter, 
  Linkedin, 
  Copy, 
  CheckCircle, 
  Link, 
  AlertCircle,
  Clipboard,
  MessageCircle,
  Facebook,
  Send
} from 'lucide-react';
import { RiskReport } from '@/types';
import { toast } from '@/hooks/use-toast';

interface EnhancedShareButtonsProps {
  report: RiskReport;
}

const EnhancedShareButtons = ({ report }: EnhancedShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const { influencerData, riskScore } = report;

  // Create share message
  const createShareMessage = () => {
    let riskLevel = 'Low';
    if (riskScore >= 70) riskLevel = 'High';
    else if (riskScore >= 30) riskLevel = 'Medium';

    return `I just analyzed @${influencerData.handle} with Crypto Influencer Insight AI and found a ${riskLevel} Risk Score of ${riskScore}/100. Check your favorite crypto influencers before following their advice!`;
  };

  // Create share URL
  const createShareUrl = () => {
    return `${window.location.origin}/analyze?handle=${influencerData.handle}`;
  };

  // Share functions
  const shareOnTwitter = () => {
    const message = createShareMessage();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    trackShare('twitter');
  };

  const shareOnLinkedIn = () => {
    const message = createShareMessage();
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    trackShare('linkedin');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
    trackShare('facebook');
  };

  const shareOnTelegram = () => {
    const message = createShareMessage();
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    trackShare('telegram');
  };

  const copyToClipboard = () => {
    const message = createShareMessage();
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      toast({
        title: "Copied to clipboard",
        description: "Share text has been copied to your clipboard",
      });
      trackShare('copy');
    });
  };

  const copyLinkToClipboard = () => {
    const url = createShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link copied",
        description: "Share link has been copied to your clipboard",
      });
      trackShare('link');
    });
  };

  // Track shares (in a real app, this would send to analytics)
  const trackShare = (platform: string) => {
    console.log(`Shared report for ${influencerData.handle} on ${platform}`);
    // In a real app, you would send this to your analytics platform
  };

  return (
    <Card className="crypto-card">
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Share2 className="w-5 h-5" />
          <h3 className="font-semibold">Share This Analysis</h3>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Help others make informed decisions about crypto influencers
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="flex items-center space-x-2" onClick={shareOnTwitter}>
              <Twitter className="w-4 h-4" />
              <span>Twitter</span>
            </Button>
            
            <Button variant="outline" className="flex items-center space-x-2" onClick={shareOnFacebook}>
              <Facebook className="w-4 h-4" />
              <span>Facebook</span>
            </Button>
            
            <Button variant="outline" className="flex items-center space-x-2" onClick={shareOnLinkedIn}>
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </Button>
            
            <Button variant="outline" className="flex items-center space-x-2" onClick={shareOnTelegram}>
              <Send className="w-4 h-4" />
              <span>Telegram</span>
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="secondary" 
            className="flex items-center justify-center space-x-2 flex-1" 
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Clipboard className="w-4 h-4" />
                <span>Copy Text</span>
              </>
            )}
          </Button>
          
          <Button 
            variant="secondary" 
            className="flex items-center justify-center space-x-2 flex-1" 
            onClick={copyLinkToClipboard}
          >
            <Link className="w-4 h-4" />
            <span>Copy Link</span>
          </Button>
        </div>
        
        <div className="pt-2">
          <div className="flex items-start p-3 bg-secondary/50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5 mr-2" />
            <p className="text-sm">
              Sharing analysis helps build a more transparent crypto ecosystem. Always encourage DYOR (Do Your Own Research).
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedShareButtons;
