
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, ChevronRight, Clock3 } from 'lucide-react';
import { RiskReport } from '@/types';
import { getReportHistory } from '@/services/aiService';
import RiskScore from './RiskScore';

interface ReportHistoryProps {
  onSelectReport: (report: RiskReport) => void;
}

const ReportHistory = ({ onSelectReport }: ReportHistoryProps) => {
  const [history, setHistory] = useState<RiskReport[]>(getReportHistory());
  const [animatedItems, setAnimatedItems] = useState<boolean[]>([]);

  // Initialize animation state for each item
  useEffect(() => {
    // Start with all items hidden
    setAnimatedItems(new Array(history.length).fill(false));
    
    // Animate items one by one with a delay
    history.forEach((_, index) => {
      setTimeout(() => {
        setAnimatedItems(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, 100 + index * 100);
    });
  }, [history.length]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <Card className="crypto-card p-6 space-y-4">
      <div className="flex items-center space-x-2">
        <Clock className="w-5 h-5 text-crypto-cyan" />
        <h3 className="font-semibold">Recent Analyses</h3>
      </div>
      
      <ScrollArea className="h-48">
        <div className="space-y-2">
          {history.map((report, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-all duration-500 transform ${animatedItems[index] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
              onClick={() => onSelectReport(report)}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 relative">
                  <RiskScore score={report.riskScore} size="sm" showLabel={false} />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-background rounded-full flex items-center justify-center">
                    <Clock3 className="w-2 h-2 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <div className="font-medium flex items-center">
                    <span>@{report.influencerData.handle}</span>
                    {/* Recently added indicator */}
                    {Date.now() - report.timestamp < 86400000 && (
                      <span className="ml-2 text-xs bg-primary/20 text-primary rounded-full px-1.5 py-0.5">New</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{formatDate(report.timestamp)}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ReportHistory;
