
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, ChevronRight, Clock3, History } from 'lucide-react';
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
    <Card className="crypto-card p-6 space-y-4 border-primary/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full filter blur-3xl -z-0"></div>
      
      <div className="flex items-center space-x-2 relative z-10">
        <History className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-gradient">Recent Analyses</h3>
      </div>
      
      <ScrollArea className="h-52 relative z-10">
        <div className="space-y-3">
          {history.map((report, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg bg-card/70 backdrop-blur-sm hover:bg-card/90 cursor-pointer transition-all duration-500 transform ${animatedItems[index] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} hover:shadow-md hover:shadow-primary/10 border border-white/5 hover:border-primary/30`}
              onClick={() => onSelectReport(report)}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 relative animate-pulse-subtle">
                  <RiskScore score={report.riskScore} size="sm" showLabel={false} />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-background rounded-full flex items-center justify-center border border-white/10">
                    <Clock3 className="w-2.5 h-2.5 text-primary" />
                  </div>
                </div>
                <div>
                  <div className="font-medium flex items-center">
                    <span className="text-gradient">@{report.influencerData.handle}</span>
                    {/* Recently added indicator */}
                    {Date.now() - report.timestamp < 86400000 && (
                      <span className="ml-2 text-xs bg-primary/20 text-primary rounded-full px-2 py-0.5 animate-pulse-subtle">New</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(report.timestamp)}
                  </div>
                </div>
              </div>
              <div className="bg-primary/10 rounded-full p-1 group transition-all duration-300 hover:bg-primary/20">
                <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ReportHistory;
