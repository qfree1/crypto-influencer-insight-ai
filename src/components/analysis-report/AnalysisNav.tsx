
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AnalysisNavProps {
  onNewAnalysis: () => void;
}

const AnalysisNav = ({ onNewAnalysis }: AnalysisNavProps) => {
  return (
    <Card className="crypto-card p-6">
      <button 
        onClick={onNewAnalysis}
        className="w-full py-3 px-4 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
      >
        Analyze Another Influencer
      </button>
    </Card>
  );
};

export default AnalysisNav;
