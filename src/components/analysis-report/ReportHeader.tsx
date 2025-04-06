
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkPlus } from 'lucide-react';
import { InfluencerData } from '@/types';
import RiskScore from '../RiskScore';
import { toast } from '@/hooks/use-toast';

interface ReportHeaderProps {
  influencerData: InfluencerData;
  riskScore: number;
  timestamp: number;
  onSaveReport: () => void;
  isSaved: boolean;
}

const ReportHeader = ({ 
  influencerData, 
  riskScore, 
  timestamp, 
  onSaveReport, 
  isSaved 
}: ReportHeaderProps) => {
  
  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="crypto-card">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-shrink-0">
            <img 
              src={influencerData.profileImage || 'https://placehold.co/100x100/1E40AF/FFFFFF/?text=??'} 
              alt={influencerData.handle}
              className="w-24 h-24 rounded-lg object-cover glow"
            />
          </div>
          
          <div className="flex-grow space-y-2">
            <h1 className="text-3xl font-bold">@{influencerData.handle}</h1>
            {influencerData.name && (
              <h2 className="text-xl text-muted-foreground">{influencerData.name}</h2>
            )}
            <div className="text-sm text-muted-foreground">
              Analysis generated on {formatDate(timestamp)}
            </div>
            
            <div className="flex items-center space-x-2 pt-1">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-1"
                onClick={onSaveReport}
                disabled={isSaved}
              >
                {isSaved ? (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-4 h-4" />
                    <span>Save Report</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <RiskScore score={riskScore} size="lg" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ReportHeader;
