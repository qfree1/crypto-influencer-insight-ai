
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, ChevronRight } from 'lucide-react';
import { RiskReport } from '@/types';
import { getReportHistory } from '@/services/aiService';
import RiskScore from './RiskScore';

interface ReportHistoryProps {
  onSelectReport: (report: RiskReport) => void;
}

const ReportHistory = ({ onSelectReport }: ReportHistoryProps) => {
  const [history, setHistory] = useState<RiskReport[]>(getReportHistory());

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
        <Clock className="w-5 h-5" />
        <h3 className="font-semibold">Recent Analyses</h3>
      </div>
      
      <ScrollArea className="h-48">
        <div className="space-y-2">
          {history.map((report, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
              onClick={() => onSelectReport(report)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8">
                  <RiskScore score={report.riskScore} size="sm" showLabel={false} />
                </div>
                <div>
                  <div className="font-medium">@{report.influencerData.handle}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(report.timestamp)}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ReportHistory;
